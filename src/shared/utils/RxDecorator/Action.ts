import produce from 'immer';
import * as Util from './util';

export class ActionRequest<T> {
    public value: T;
    public actionName: string;
    constructor(value: T, actionName: string) {
        this.value = value;
        this.actionName = actionName;
    }
}

export function action<T = any>(actionName?: string) {
    return (target: any, propertyName: string, descriptor: any) => {
        const keysList: string[] = Reflect.getMetadata(Util.keyName, target) || [];
        if (!propertyName) {
            throw new Error('this decorator must be used for class property');
        }   // 必须用于类属性，如果作用于class或其他不会有name参数
        const render = descriptor.value;
        let result: any = null;
        descriptor.value = function (...args: any[]) {
            if (target.isPrototypeOf(this)) {
                if (!this.hasOwnProperty('constructor')) {
                    const handler: any = this;
                    const base: any = Util.getMember(handler, keysList);
                    const after: any = produce(base, (draftHandler: any) => {
                        result = Reflect.apply(render, draftHandler, args);
                    });
                    keysList.forEach((key: string) => {
                        if (after[key] != base[key]) {
                            const request = new ActionRequest<T>(after[key], actionName || propertyName);
                            handler[key] = request;
                        }
                    })
                    console.info(after, base, after == base)
                    return result;
                }
            }
            throw new Error('the symbol is not a instance')
        }
    }
};