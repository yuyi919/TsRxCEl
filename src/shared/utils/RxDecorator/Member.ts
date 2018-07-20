import { EventEmitter } from '../EventEmitter';
import { ActionRequest } from './Action';
import * as Util from './util';

export class Member<T> {
    public propertyName: string;
    public name: string | undefined;
    public changes: EventEmitter<T>;
    private value: T | null = null;
    private target: any;
    private computed: boolean = false;
    constructor(target: any, propertyName: string, name?: string) {
        this.target = target;
        this.propertyName = propertyName;
        this.name = name;
        this.changes = new EventEmitter<T>();
        Util.addParamsName(target, this);
    }
    public setValue(request: ActionRequest<T> | T): boolean {
        if (request instanceof ActionRequest) {
            const { value, actionName } = request;
            console.error(`action-[${actionName}]{ [${this.name}] : ${this.value} => ${value} }`)
            this.value = value;
            this.changes.emit(this.value);
        } else if (this.value == null) {
            console.error(`init{ [${this.name}] : ${request} }`)
            this.value = request;
            this.changes.emit(this.value);
        } else {
            console.error('不能通过[init]或[action]以外的方式赋值：' + JSON.stringify(request))
            return false;
        }
        return true;
    }
    public getValue(): T | null {
        return this.value;
    }
    public getTarget(): any {
        return this.target;
    }
    public setComputed(is: boolean){
        this.computed = is;
    }
    public isComputed(){
        return this.computed;
    }
}

/**
 * 观察成员
 * @param subName 成员别名
 */
export function observable<T = any>(subName?: string) {
    return function member(target: any, propertyName: string) {
        const self: Member<T> = new Member<T>(target, propertyName, subName);
        Reflect.defineMetadata('observable', self, target, propertyName);
        Reflect.defineProperty(target, propertyName, {
            configurable: true,
            enumerable: true,
            get: (): T | null => self.getValue(),
            set: (request: ActionRequest<T> | T) => self.setValue(request)
        });
    }
};

export const getPropertyMember = (target: any, propertyName: string) => {
    return Reflect.getMetadata('observable', target, propertyName);
}
