import { IpcMessageEvent } from 'electron';
import 'reflect-metadata';
import { Observable } from 'rxjs';
import { IpcEventListener, IpcMessageResponse } from "./IpcEventListener";

export interface IEventListenClass<T extends object> extends Type.ClassConstructor {
    new(...arg: any[]): {
        onDestroy(): void;
    } & T;
}

export function IpcListener<T extends object>(target: IEventListenClass<T>): IEventListenClass<T> {
    const channels: Map<string, string[]> = Reflect.get(target.prototype, '$$$listener');
    if (!channels) {
        return target;
    }
    return new Proxy(target, {
        construct(proxyTarget: Type.ClassConstructor, args: any[], handler: Type.Prototype) {
            const listenerMap: Map<string, IpcEventListener<any>> = new Map<string, IpcEventListener<any>>();
            const instance = Reflect.construct(proxyTarget, args, handler);
            Reflect.get(instance, '$$$listener').forEach((methodList: string[], channelName: string) => {
                const listener: IpcEventListener<any> = new IpcEventListener<any>("$$$IPCL_" + channelName);
                methodList.forEach((methodName: string) => {
                    const method = Reflect.get(instance, methodName, instance);
                    listener.listen((e: IpcMessageResponse<any>) => {
                        console.log(e);
                        const response = Reflect.apply(method, instance, [e.response, e.event]);
                        if (response instanceof Observable) {
                            response.subscribe(asyncResponse => {
                                listener.return(e.event, asyncResponse);
                            });
                        }
                        else {
                            listener.return(e.event, response);
                        }
                    });
                });
                listenerMap.set(channelName, listener);
            });
            Reflect.defineProperty(proxyTarget, '$$$listener', {
                enumerable: false,
                get: () => listenerMap,
                set: (value: any) => {
                    if (value == null) {
                        listenerMap.forEach(listener => listener.dispose());
                    }
                }
            });
            // console.log(listenerMap);
            return instance;
        }
    }) as IEventListenClass<T>;
}
export type IChannelMethod<Q, S> = TypedPropertyDescriptor<(response: Q, responseEvent?: IpcMessageEvent) => S>;
/**
 * @type Q 入参类型
 * @type S 返回值类型（允许Observable对象）
 * @param channelName 频道名称
 */
export function channel<Q extends object | string | number | boolean, S = object>(channelName: string) {
    return (target: Type.Prototype, prpoertyName: string, descriptor: IChannelMethod<Q, S>) => {
        // 获取或创建channelsMap
        const channels: Map<string, string[]> = Reflect.get(target, '$$$listener') || new Map<string, string[]>();
        // 获取或创建Map存储的频道
        const channelListener: string[] = channels.get(channelName) || [];
        if (channelListener.length == 0) {
            channels.set(channelName, channelListener);
        }
        // 订阅频道的方法
        channelListener.push(prpoertyName);
        // 记录建channelsMap
        Reflect.defineProperty(target, '$$$listener', {
            enumerable: false,
            writable: true,
            value: channels
        });
    };
}

export default {
    channel,
    IpcListener
}