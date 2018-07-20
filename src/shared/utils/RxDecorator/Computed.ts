import { EventEmitter } from '../EventEmitter';
import { getPropertyMember, Member } from './Member';
import * as Util from './util';

// console.warn = () => { };
export class GuideProxy<T> {
    private root: string[];
    private proxy: any;
    private onDestroy: EventEmitter<any> = new EventEmitter<any>();
    private lastValue: T;
    private rootMap: Map<string, Array<string>> = new Map<string, Array<string>>();
    constructor(instance: any) {
        this.init();
        this.proxy = this.getGuideProxy(instance);
    }
    public init(){
        this.root = ['this'];
    }
    public setRootTree(){
        this.rootMap.set(this.root[1], this.root);
        this.init();
    }
    public getRootTree(){
        return this.rootMap;
    }
    public getRoot(){
        return this.root.join('=>')
    }
    public addRoot(root: string){
        this.root.push(root);
    }
    public run(method: any, change?: boolean){
        if(change){
            const r: T = Reflect.apply(method, this.proxy, [])
            this.lastValue = r;
            return r;
        }
        return this.lastValue;
    }
    /**
     * 代理类成员的get成员
     * @param innerTarget 
     * @param keyName 
     * @param receiver 
     */
    private getGuideProxy(property: any): { proxy: any, revoke: () => void } {
        console.warn(`代理了${this.getRoot()}`, property)
        const { proxy, revoke } = Proxy.revocable(property, {
            get: (innerTarget: any, keyName: string, receiver: any) => {
                // 如果想要获取方法
                const member = Reflect.get(innerTarget, keyName, receiver);
                // console.warn(`得到 ${this.getRoot()}[${keyName}]:`, member);
                const descriptor = Reflect.getOwnPropertyDescriptor(innerTarget, keyName);
                if (descriptor && descriptor.writable == false) { // 如果已被封锁，直接返回即可
                } else if (member instanceof Function) {
                    const { proxy: proxy2, revoke: revoke2 } = Proxy.revocable(member, {
                        apply: () => console.error(`无法调用 ${this.getRoot()}[${keyName}]方法`) // 拦截一切调用
                    })
                    this.onDestroy.subscribe(revoke2);
                    return proxy2;
                } else if (member instanceof Object) {
                    this.addRoot(keyName);
                    return this.getGuideProxy(member);
                }
                console.warn(`直接返回 ${this.getRoot()}[${keyName}]:`, member);
                this.addRoot(keyName);
                this.setRootTree();
                return member;
            },
            set: (innerTarget: any, keyName: string, value: any, receiver: any): any => {
                const m = getPropertyMember(innerTarget, keyName);
                if (m) {
                    console.error(`无法为 ${this.getRoot()}[${keyName}]赋值:`, value);
                    return Reflect.get(innerTarget, keyName, receiver);
                }
                return value;
            }
        })
        this.onDestroy.subscribe(revoke);
        return proxy;
    };
}
export function computed(...members: string[]) {
    return (target: any, propertyName: string, descriptor: any) => {
        let guideProxy: GuideProxy<any> | null = null;
        const self = new Member(target, propertyName);
        self.setComputed(true);

        console.warn(members, Util.getMembers(target), descriptor.get);
        const computedGet = descriptor.get;
        if (!descriptor.get || descriptor.value || descriptor.set) {
            throw new Error(`@computed只适用于@get访问器, [${target.constructor.name}.${propertyName} ]不适用`)
        }

        descriptor.get = function () {
            if (!guideProxy) {
                guideProxy = new GuideProxy(this);
            }
            console.log(propertyName, guideProxy.getRootTree());
            return guideProxy.run(computedGet, true);
            // return Reflect.apply(computedGet, this, []);
        }
    }
}