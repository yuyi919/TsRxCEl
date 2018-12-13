import { ipcMain, IpcMessageEvent } from 'electron';
import { Observable, Observer, Subscription } from 'rxjs';
import { share } from 'rxjs/operators';


export interface IpcMessageResponse<T = any> {
    event: IpcMessageEvent;
    response: T;
}
export type IpcMessageFunc<T> = (event: IpcMessageResponse<T>) => T;

/**
 * 监听 electron主线程 频道的观察者对象
 *
 */
export class IpcEventListener<T = any, S = any> extends Observable<IpcMessageResponse<T>> {
    private channelName: string;
    private listeners: Map<IpcMessageFunc<T>, Subscription> = new Map<IpcMessageFunc<T>, Subscription>();
    /**
     * 创建频道监听
     * @param channelName  频道名
     */
    constructor(channelName: string) {
        super();
        this.channelName = channelName;
        this.source = new Observable((observer: Observer<IpcMessageResponse<T>>) => {
            ipcMain.on(channelName, (event: IpcMessageEvent, response: T) => {
                // 转换为IpcMessageResponse格式
                observer.next({ event, response });
            });
        }).pipe(share());
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
        const sub: Subscription | undefined = this.listeners.get(listener);
        if (sub) {
            sub.unsubscribe();
            this.listeners.delete(listener);
        }
    }
    /**
     * 销毁该监听器
     */
    public dispose() {
        Array.from(this.listeners.values()).forEach(i => i.unsubscribe());
        ipcMain.removeAllListeners(this.channelName);
    }
}