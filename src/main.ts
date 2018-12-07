import { ipcMain, IpcMessageEvent } from 'electron';
import * as superagent from 'superagent';
import { WindowManager } from './main/EventListener/WindowManager';
import { HttpClient } from './main/index';

const serve: boolean = process.env.NODE_ENV === 'development';

if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support'); // eslint-disable-line
    sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
    require('electron-debug')(); // eslint-disable-line global-require
    const path = require('path'); // eslint-disable-line
    const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
    require('module').globalPaths.push(p); // eslint-disable-line
}

const windowManager: WindowManager = new WindowManager(serve);

try {
    windowManager.process();
    let http: HttpClient;
    ipcMain.on('http-get', (event: IpcMessageEvent, url: string, param?: object, ...args: any[]) => {
        superagent.get(encodeURI(url)).end((err: any, res: any) => {
            if (err) {
                console.log(err);
            }
            event.sender.send('http-get', res.text);
        });
    })


    ipcMain.on('get', (event: IpcMessageEvent, url: string, param?: object, ...args: any[]) => {
        try {
            if (!http) {
                http = new HttpClient('localhost', 8080);
            }
            console.log(url, param);
            http.get(url, param || {}).then(response => {
                event.sender.send(response)
            }).catch(e => {
                event.sender.send(e)
            });
        } catch (e) {
            event.sender.send(e);
        }
    })
    ipcMain.on('post', (event: IpcMessageEvent, url: string, param?: object, ...args: any[]) => {
        try {
            if (!http) {
                http = new HttpClient('localhost', 8080);
            }
            console.log(url, param);
            http.post(url, param || {}).then(response => {
                event.sender.send(response);
            }).catch(e => event.sender.send(e));
        } catch (e) {
            event.sender.send(e);
        }
    })

} catch (e) {
    // Catch Error
    // throw e;
}