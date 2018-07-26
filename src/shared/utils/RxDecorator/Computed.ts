import { EventEmitter } from '../EventEmitter';
import { ActionRequest } from './Action';
import { getMembers, Member } from './Member';

// console.warn = () => { };
/**
 * 代理整个类的实例
 */
export class GuideProxy<T extends object> {
    public members: Member<T>;
    private root: string[];
    private proxy: T;
    private onDestroy: EventEmitter<any> = new EventEmitter<any>();
    private rootMap: Map<string, Array<string>> = new Map<string, Array<string>>();
    private willUpdate: boolean = true;
    constructor(instance: Interface.IPrototype) {
        this.init();
        this.members = getMembers(instance);
        this.proxy = this.getGuideProxy(instance);
        console.log(this.proxy);
    }
    public init() {
        this.root = ['this'];
    }
    public clipRootTree() {
        console.log(this.root);
        this.rootMap.set(this.root[1], this.root);
        this.init();
    }
    public getRootTree() {
        return this.rootMap;
    }
    public getRootStr() {
        return this.root.join('=>')
    }
    public addRoot(root: string) {
        this.root.push(root);
    }
    public run(method: any, propertyName: string) {
        if (this.willUpdate) {
            const r: T = Reflect.apply(method, this.proxy, []);
            const request: ActionRequest<T> = new ActionRequest(r, 'computed: ' + this.members.getMemberName(propertyName))
            this.members.setValue(request, propertyName);
            // this.willUpdate = false;
            return r;
        }
        return this.members.getMemberValue(propertyName);
    }
    /**
     * 代理类成员的get成员
     * @param innerTarget 
     * @param keyName 
     * @param receiver 
     */
    private getGuideProxy(target: Interface.IPrototype): T {
        console.warn(`代理了${this.getRootStr()}`, target)
        const { proxy, revoke } = Proxy.revocable(target, {
            get: (innerTarget: any, keyName: string, receiver: any) => {
                // 如果想要获取方法
                const member = Reflect.get(innerTarget, keyName, receiver);
                if((member instanceof Member) || (member instanceof GuideProxy)){ // 对Member对象放行
                    return member;
                }
                // console.warn(`得到 ${this.getRoot()}[${keyName}]:`, member);
                const descriptor = Reflect.getOwnPropertyDescriptor(innerTarget, keyName);
                if (descriptor && descriptor.writable == false) { // 如果已被封锁，直接返回即可
                } else if (member instanceof Function) {
                    const { proxy: proxy2, revoke: revoke2 } = Proxy.revocable(member, {
                        apply: () => console.error(`无法调用 ${this.getRootStr()}[${keyName}]方法`) // 拦截一切调用
                    })
                    this.onDestroy.subscribe(revoke2);
                    return proxy2;
                } else if (member instanceof Object) {
                    this.addRoot(keyName);
                    return this.getGuideProxy(member);
                }
                this.addRoot(keyName);
                console.warn(`直接返回 ${this.getRootStr()}[${keyName}]:`, member, this.root);
                this.clipRootTree();
                return member;
            },
            set: (innerTarget: any, keyName: string, value: any, receiver: any): any => {
                // 取得当前对象内 [ keyName ] 的值
                // 如果是引用类成员的值，禁止修改
                const innerValue = Reflect.get(innerTarget, keyName, receiver); 
                if (this.members.isPropertyMember(innerValue)) {
                    console.error(`无法为 ${this.getRootStr()}[${keyName}]赋值:`, value);
                    return innerValue;
                }
                return value;
            }
        })
        this.onDestroy.subscribe(revoke); 
        return proxy;
    };
}

export function computed<T extends object>(subName?: string, ...members: string[]): Type.Function {
    return (target: Type.Prototype, propertyName: string, descriptor: PropertyDescriptor) => {
        if (!descriptor.get || descriptor.value || descriptor.set) {
            throw new Error(`@computed只适用于@get访问器, [${target.constructor.name}.${propertyName} ]不适用`)
        }
        let computedGet: Type.Function = descriptor.get;
        console.log(target, getMembers(target), computedGet);
        Object.assign(descriptor,{
            get(): any {
                const instance: Interface.IPrototype = (this as any);
                computedGet = computedGet.bind(instance);
                console.log(instance, target);
                let guideProxy: GuideProxy<T> = getGuideProxy(instance);
                if(!guideProxy){
                    guideProxy = setGuideProxy(instance);
                }
                if(!guideProxy.members.hasProperty(propertyName)){
                    console.log(propertyName);
                    guideProxy.members.addMember(propertyName, true, subName);
                }
                console.log(instance, propertyName, guideProxy.getRootTree());
                return guideProxy.run(computedGet, propertyName);
            }
        });
    }
}

export function getGuideProxy(target: Interface.IPrototype): GuideProxy<any>{
    return Reflect.get(target, '$$guideProxy');
}
export function setGuideProxy(target: Interface.IPrototype){
    const guideProxy: GuideProxy<any> = new GuideProxy(target);
    Reflect.defineProperty(target, '$$guideProxy', {
        writable: false,
        enumerable: false,
        value: guideProxy
    })
    return guideProxy;
}