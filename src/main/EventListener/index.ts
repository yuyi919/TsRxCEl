import { ipcMain, IpcMessageEvent } from 'electron';
import 'reflect-metadata';
import * as Rx from 'rxjs';
import { share } from 'rxjs/operators';
import '../../global';

export interface IpcMessageResponse<T = any> {
    event: IpcMessageEvent;
    response: T;
}
export type IpcMessageFunc<T> = (event: IpcMessageResponse<T>) => T;
/**
 * 监听 electron主线程 频道的观察者对象
 * 
 */
export class IpcEventListener<T = any, S = any> extends Rx.Observable<IpcMessageResponse<T>> {
    private channelName: string;
    private listeners: Map<IpcMessageFunc<T>, Rx.Subscription> = new Map<IpcMessageFunc<T>, Rx.Subscription>();
    /**
     * 创建频道监听
     * @param channelName  频道名
     */
    constructor(channelName: string) {
        super();
        this.channelName = channelName;
        this.source = new Rx.Observable((observer: Rx.Observer<IpcMessageResponse<T>>) => {
            ipcMain.on(channelName, (event: IpcMessageEvent, response: T) => {
                // 转换为IpcMessageResponse格式
                observer.next({ event, response })
            })
        }).pipe(
            share()
        )
    }
    /**
     * 监听并记录subscription
     * @param listener 回调方法
     */
    public listen(listener: IpcMessageFunc<T>) {
        this.listeners.set(listener, this.subscribe(listener));
    }
    /**
     * 返回值
     * @param returnValue 
     */
    public return(e: IpcMessageEvent, returnValue: S | undefined) {
        if (returnValue != null) {
            e.sender.send(this.channelName, returnValue);
        }
    }
    /**
     * 清除指定回调方法的监听和对应subscription
     * @param listener 回调方法
     */
    public remove(listener: IpcMessageFunc<T>) {
        const sub: Rx.Subscription | undefined = this.listeners.get(listener);
        if (sub) {
            sub.unsubscribe();
            this.listeners.delete(listener);
        }
    }
    /**
     * 销毁该监听器
     */
    public dispose() {
        Array.from(this.listeners.values()).forEach(i => i.unsubscribe())
        ipcMain.removeAllListeners(this.channelName);
    }
}
export interface IEventListenClass<T extends object> extends Type.ClassConstructor {
    new(): {
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
                const listener: IpcEventListener<any> = new IpcEventListener<any>(channelName);
                methodList.forEach((methodName: string) => {
                    const method = Reflect.get(instance, methodName, instance);
                    listener.listen((e: IpcMessageResponse<any>) => {
                        console.log(e);
                        const response = Reflect.apply(method, instance, [e.response, e.event])
                        if (response instanceof Rx.Observable){
                            response.subscribe(asyncResponse=>{
                                listener.return(e.event, asyncResponse);
                            })
                        } else {
                            listener.return(e.event, response);
                        }
                    })
                })
                listenerMap.set(channelName, listener);
            })

            Reflect.defineProperty(proxyTarget, '$$$listener', {
                enumerable: false,
                get: () => listenerMap,
                set: (value: any) => {
                    if (value == null) {
                        listenerMap.forEach(listener => listener.dispose());
                    }
                }
            });
            console.log(listenerMap);
            return instance;
        }
    }) as IEventListenClass<T>;
}

export type IChannelMethod<Q, S> = TypedPropertyDescriptor<(response: Q, responseEvent?: IpcMessageEvent) => S>;
export function channel<Q extends object | string, S = object>(channelName: string) {
    return (target: Type.Prototype, prpoertyName: string, descriptor: IChannelMethod<Q, S>) => {
        // 获取或创建channelsMap
        const channels: Map<string, string[]> = Reflect.get(target, '$$$listener') || new Map<string, string[]>();
        // 获取或创建Map存储的频道
        const channelListener: string[] = channels.get(channelName) || [];
        if (channelListener.length == 0) {
            channels.set(channelName, channelListener);
        }
        // 订阅频道的方法
        channelListener.push(prpoertyName)
        // 记录建channelsMap
        Reflect.defineProperty(target, '$$$listener', {
            enumerable: false,
            writable: true,
            value: channels
        });
    }
}