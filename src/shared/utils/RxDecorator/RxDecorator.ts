import produce, { setAutoFreeze } from 'immer';
import 'reflect-metadata';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { EventEmitter } from '../EventEmitter';
import { ActionRequest } from './Action';
import { keyName } from './interface';
import { Member } from './Member';
import { getMember } from './util';

setAutoFreeze(true);

export function observable<T = any>(name?: string) {
    return function member(target: any, propertyName: string) {
        console.log(Reflect.getMetadata('design:type', target, propertyName), Reflect.getMetadata('design:type', target, propertyName) == Observable)
        const self: Member<T> = new Member<T>(target, name || propertyName);
        Reflect.defineProperty(target, propertyName, {
            configurable: true,
            enumerable: true,
            get: (): T | null => self.getValue(),
            set: (request: ActionRequest<T> | T | null) => self.setValue(request)
        })
    }
};

export function action<T = any>(actionName?: string) {
    return (target: any, propertyName: string, descriptor: any) => {
        const keysList: string[] = Reflect.getMetadata(keyName, target) || [];
        if (!propertyName) {
            throw new Error('this decorator must be used for class property');
        }   // 必须用于类属性，如果作用于class或其他不会有name参数
        const render = descriptor.value;
        let result: any = null;
        descriptor.value = function (...args: any[]) {
            if (target.isPrototypeOf(this)) {
                if (!this.hasOwnProperty('constructor')) {
                    const handler: any = this;
                    const base: any = getMember(handler, keysList);
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


export function create<T>(sub: (input: T) => T, type?: any): (...args: any[]) => void {
    return function eventEmitter(target: any, propertyName: string) {
        const emitter: EventEmitter<T> = new EventEmitter<T>(sub);
        const memberType = Reflect.getMetadata('design:type', target, 'name');
        console.log(propertyName, memberType, target.constructor);
        // Reflect.set(target, propertyName, emitter);
        const log: EventEmitter<any> = new EventEmitter<any>();
        log.pipe(
            distinctUntilChanged()
        ).subscribe(console.log);

        //  const Target: any = target.constructor;
        // targetObject == target
        console.log(Reflect.getMetadataKeys(target));
        Reflect.defineProperty(target, propertyName, {
            configurable: true,
            enumerable: true,
            get: (): EventEmitter<T> => {
                log.emit({ type: 'get', emitter });
                return emitter;
            },
            set: (value: T): void => {
                log.emit({ type: 'set', value });
                emitter.emit(value);
            }
        })
        console.log(Reflect.getOwnPropertyDescriptor(target, propertyName));
        // Target.prototype = new Proxy(target, {
        //     set: (instanceTarget: any, keyName: string, value: T, receiver: any): any => {
        //         switch(keyName){
        //             case propertyName: 
        //                 log.emit({type: 'set', keyName, receiver, instanceTarget});
        //                 emitter.emit(value);
        //                 return emitter;
        //             default:        
        //                 return Reflect.set(instanceTarget, keyName, value, receiver);
        //         }
        //     },
        //     get: (instanceTarget: any, keyName: string, receiver: any) => {
        //         const value = Reflect.get(instanceTarget, keyName, receiver);
        //         if(keyName==propertyName){
        //             log.emit({type: 'get', keyName, receiver,instanceTarget});
        //         }
        //         return value;
        //     }
        // });
        // Reflect.set(target, propertyName,
        //     new Proxy(emitter, {
        //         get: (instanceTarget: any, keyName: string) => {
        //             console.log(instanceTarget, keyName);
        //         }
        //     })
        // );
        // console.log(target);
        // Reflect.set(target, 'constructor', Target)
    }
}