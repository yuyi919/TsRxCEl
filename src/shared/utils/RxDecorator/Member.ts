import { ActionRequest } from './Action';
import * as Util from './util';

export class Member<T> {
    public name: string;
    private value: T | null = null;
    constructor(target: any, name: string, value?: T) {
        Util.addParamsName(target, name);
        this.name = name;
        this.value = value || null;
    }
    public setValue(request: ActionRequest<T> | T | null){
        if (request instanceof ActionRequest) {
            const { value, actionName } = request;
            console.warn(`通过[${actionName}]更新了[${this.name}], 上个值为${this.value}, 当前值为${value}`)
            this.value = value;
        } else if (this.value == null) {
            console.warn(`初始化[${this.name}], 当前值为${request}`)
            this.value = request;
        } else {
            console.error('你不能通过[初始化]或[action]以外的方式赋值：' + JSON.stringify(request))
        }
    }
    public getValue(){
        return this.value;
    }
}


export function observable<T = any>(name?: string) {
    return function member(target: any, propertyName: string) {
        const self: Member<T> = new Member<T>(target, name || propertyName);
        Reflect.defineProperty(target, propertyName, {
            configurable: true,
            enumerable: true,
            get: (): T | null => self.getValue(),
            set: (request: ActionRequest<T> | T | null) => self.setValue(request)
        })
    }
};
