import { IpcMessageEvent, IpcRenderer } from 'electron';
import * as Rx from 'rxjs';
declare const window: any;

const electron = window.require('electron');
const ipcRenderer: IpcRenderer = electron.ipcRenderer;


export * from './http';
export interface IClientResponse {
    event: IpcMessageEvent;
    args: any[];
}
export class ClientEventEmitter<A, R> extends Rx.Observable<R> {
    public observer: Rx.Observer<R>;
    private channelName: string;
    constructor(channelName: string) {
        super();
        this.channelName = channelName;
        this.source = new Rx.Observable((observer: Rx.Observer<R>) => {
            this.observer = observer;
            console.log(this)
        })
        ipcRenderer.on(this.channelName, this.onResponse)
    }
    public get(receive: A, ...args: any[]) {
        ipcRenderer.send(this.channelName, receive, ...args);
        return this;
    }
    public dispose() {
        this.observer.complete();
        ipcRenderer.removeListener(this.channelName, this.onResponse);
    }
    private onResponse = (event: IpcMessageEvent, response: R): void => {
        console.warn(event,this.observer)
        if (this.observer) {
            this.observer.next(response);
        }
    }
}