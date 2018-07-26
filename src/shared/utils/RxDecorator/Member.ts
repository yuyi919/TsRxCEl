import produce from 'immer';
import { EventEmitter } from '../EventEmitter';
import { ActionRequest } from './Action';

export interface IMember<T extends object> {
    /**
     * 添加成员
     * @param propertyName 成员名称
     * @param computed 是否为衍生
     * @param name 别名
     */
    addMember(propertyName: string, computed: boolean, name?: string): void;
    /**
     * 返回成员的当前名称
     * @param propertyName 成员属性名
     * @returns name
     */
    getMemberName(propertyName: string): string | null;
    /**
     * 返回成员的当前值
     * @param propertyName 成员属性名
     * @returns value
     */
    getMemberValue(propertyName: string, defaultValue?: any): any;
    /**
     * 设置成员当前值
     * @param propertyName 
     * @param value 
     */
    setMemberConfig(propertyName: string, configName: string, value: any): void;
    /**
     * 设置来自Action请求的值
     * @param request Action请求
     * @param propertyName 
     */
    setValue(request: ActionRequest<T> | T, propertyName: string): boolean;
    /**
     * 获取值
     * @param propertyName 
     */
    getValue(propertyName: string): any;
}

export interface IPropertyConfig<T = any> {
    propertyName: string,
    displayName: string,
    computed: boolean;
    value: T | null;
}

export interface IMemberChangeResponse<T = any> {
    propertyName: string;
    currentValue: T;
    preValue?: T;
}

export class Member<T extends object> implements IMember<T> {
    public changes: EventEmitter<IMemberChangeResponse>;
    private target: any;
    private members: Map<string, IPropertyConfig> = new Map<string, IPropertyConfig>();
    private memberValues: Map<string, any> = new Map<string, any>();

    constructor(target: Type.Prototype) {
        this.target = target;
        this.changes = new EventEmitter<IMemberChangeResponse>();
    }

    public addMember(propertyName: string, computed: boolean = false, name?: string) {
        this.members.set(name || propertyName, {
            propertyName,
            displayName: name || propertyName,
            computed,
            value: null
        });
    }

    public getMemberValue(propertyName: string, defaultValue?: any): any {
        const config: IPropertyConfig | undefined = this.members.get(propertyName);
        return config ? config.value : defaultValue;
    }

    public getMemberName(propertyName: string): string | null {
        const config: IPropertyConfig | undefined = this.members.get(propertyName);
        return config ? config.displayName : null;
    }

    public setMemberConfig(propertyName: string, configName: string, value: any): void {
        this.members.set(propertyName, produce(
            this.members.get(propertyName),
            (config: IPropertyConfig) => {
                config[configName] = value;
            }
        )!);
    }

    public isPropertyMember(propertyValue: any): boolean {
        return new Set<any>(this.memberValues.values()).has(propertyValue);
    }

    public hasProperty(propertyName: string): boolean {
        return this.members.has(propertyName);
    }

    public getPropertyConfigs(): IPropertyConfig[] {
        return Array.from(this.members.values());
    }

    public getPropertyNames(): string[] {
        return Array.from(this.members.keys());
    }

    public getInnerInstance(receiver?: any): { [key: string]: any } {
        const result = {};
        this.getPropertyConfigs().forEach((config: IPropertyConfig) => {
            result[config.propertyName] = Reflect.get(this.target, config.propertyName, receiver)
        })
        return result;
    }

    public setValue(request: ActionRequest<T> | T, propertyName: string): boolean {
        const preValue: any = this.getMemberValue(propertyName);
        if (request instanceof ActionRequest) {
            const { value: currentValue, actionName } = request;
            console.warn(`action-[${actionName}]{ [${this.getMemberName(propertyName)}] : ${preValue} => ${currentValue} }`)
            this.changes.emit({ propertyName, currentValue, preValue });
            this.setMemberConfig(propertyName, 'value', currentValue);

        } else if (preValue == null) {
            console.warn(`init{ [${this.getMemberName(propertyName)}] : ${request} }`)
            this.setMemberConfig(propertyName, 'value', request);
            this.changes.emit({ propertyName, currentValue: request });

        } else {
            console.error('不能通过[init]或[action]以外的方式赋值：' + JSON.stringify(request))
            return false;
        }
        return true;
    }

    public getValue(propertyName: string): any {
        return this.getMemberValue(propertyName);
    }

    public getTarget(): any {
        return this.target;
    }
}

/**
 * 观察成员
 * @param subName 成员别名
 */
export function observable<T extends object>(subName?: string): Type.Function {
    return function member(target: Type.Prototype, propertyName: string) {
        Reflect.defineMetadata('observable', subName, target, propertyName);
        Reflect.defineProperty(target, propertyName, {
            configurable: true,
            enumerable: true,
            get(): T | null {
                const members: Member<T> = getMembers(target) || setMembers(target);
                return members.getMemberValue(propertyName)
            },
            set(request: ActionRequest<T> | T): void {
                const members: Member<T> = getMembers(this as any) || setMembers(target);
                if (!members.hasProperty(propertyName)) {
                    // 首次初始化
                    members.addMember(propertyName, false, subName);
                }
                members.setValue(request, propertyName);
            }
        });
    }
};

export function getMembers(target: Type.Prototype): Member<any> {
    return Reflect.get(target, '$$member');
}
export function setMembers<T extends object>(target: Type.Prototype): Member<any> {
    const value = new Member<T>(target);
    Reflect.defineProperty(target, '$$member', {
        configurable: true,
        enumerable: false,
        writable: false,
        value
    });
    return value;
}
export const getMemberName = (target: Type.Prototype, propertyName: string) => {
    return Reflect.getMetadata('observable', target, propertyName);
}