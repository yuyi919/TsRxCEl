import { IpcMessageEvent, IpcRenderer } from 'electron';
import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';

// const share = require('rxjs/operators');

let ipcRenderer: IpcRenderer | any;
try{
    const electron = window.require('electron');
    ipcRenderer = electron.ipcRenderer;
} catch(e){
    ipcRenderer = {}
}
declare const window: any;

export interface IClientResponse {
    event: IpcMessageEvent;
    args: any[];
}
/**
 * @type A 标准入参类型
 * @type R Observable返回值类型
 */
export class ClientEventEmitter<A, R> extends Observable<R> {
    public observer: Observer<R>;
    private channelName: string;
    // 频道名称
    constructor(channelName: string) {
        super();
        this.channelName = "$$$IPCL_"+channelName;
        this.source = new Observable((observer: Observer<R>) => {
            this.observer = observer;
            console.log(this);
        }).pipe(
            share()
        )
        if(ipcRenderer){
            ipcRenderer.on(this.channelName, this.onResponse)
        }
    }
    /**
     * 请求后台
     * @param receive 传入参数
     * @param args 
     */
    public get(receive: A, ...args: any[]) {
        if(ipcRenderer){
            ipcRenderer.send(this.channelName, receive, ...args);
        }
        return this;
    }
    public dispose() {
        this.observer.complete();
        if(ipcRenderer){
            ipcRenderer.removeListener(this.channelName, this.onResponse);
        }
    }
    private onResponse = (event: IpcMessageEvent, response: R): void => {
        console.warn(event,this.observer)
        if (this.observer) {
            this.observer.next(response);
        }
    }
}