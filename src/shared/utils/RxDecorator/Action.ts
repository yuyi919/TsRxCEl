import produce, { setAutoFreeze } from 'immer';
import { getMembers } from './Member';

export class ActionRequest<T> {
    public value: T;
    public actionName: string;
    constructor(value: T, actionName: string) {
        this.value = value;
        this.actionName = actionName;
    }
}
setAutoFreeze(false);
/** 
 * 动作
 * @param actionName 动作别名
 */
export function action<T = any>(actionName?: string) {
    return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
        if (!propertyName) {
            throw new Error('this decorator must be used for class property');
        }   // 必须用于类属性，如果作用于class或其他不会有name参数
        if(typeof descriptor.value!='function') {
            throw new Error(`@action只适用于函数, [${target.constructor.name}.${propertyName} ]不适用`)
        }
        const render = descriptor.value;
        let result: any = null;
        descriptor.value = function (...args: any[]) {
            if (target.isPrototypeOf(this)) {
                if (!this.hasOwnProperty('constructor')) {
                    const handler: Type.Prototype = this as any;
                    const members = getMembers(handler);
                    const innerInstance: any = members.getInnerInstance();
                    console.log(innerInstance);
                    const after: any = produce(innerInstance, (draftHandler: any) => {
                        result = Reflect.apply(render, draftHandler, args);
                    });
                    Object.keys(innerInstance).forEach((key: string) => {
                        if (after[key] != innerInstance[key]) {
                            const request = new ActionRequest<T>(after[key], actionName || propertyName);
                            console.log(key)
                            handler[key] = request;
                        }
                    })
                    console.info(after, innerInstance, after == innerInstance)
                    return result;
                }
            }
            throw new Error('the symbol is not a instance')
        }
    }
};