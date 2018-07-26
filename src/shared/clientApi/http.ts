
import { IpcMessageEvent, IpcRenderer } from 'electron';
import * as Rx from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import * as XmlDom from 'xmldom';
declare const window: any;

const electron = window.require('electron');
const ipcRenderer: IpcRenderer = electron.ipcRenderer;

export default class HttpService {
    public static get(url: string, params: any, ...other: any[]){
        return new Rx.Observable((observer: Rx.Observer<any>)=>{
            ipcRenderer.once('http-get',(event: IpcMessageEvent, response: object | string)=>{
                observer.next(response);
                observer.complete();
            })
            ipcRenderer.send('http-get', url, params, ...other);
        });
    }

    public static getXml(url: string, params: any, ...other: any[]){
        return this.get(url,params,...other).pipe(
            switchMap((text: string)=>{
                const dom: Document = new XmlDom.DOMParser().parseFromString(text);
                let i: number = 1;
                let link: any = dom.getElementById(i+'');
                const linkArray: Array<any> = [];
                while(link != null){
                    link = new XmlDom.DOMParser().parseFromString(new XmlDom.XMLSerializer().serializeToString(link)).getElementsByTagName('a');
                    console.log(link[0].getAttribute('href'));
                    linkArray.push(link[0].getAttribute('href'));
                    link = dom.getElementById(++i +'');
                }
                return Rx.from(linkArray);
            }),
            mergeMap((linkUrl)=>{
                return this.get(linkUrl,{});
            }),
            map(text=>{
                return text.substring(0,20);
            })
        )
    }
}