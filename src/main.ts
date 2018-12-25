import { app } from 'electron';
import './global';
import * as MainLibrary from './main/index';
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
// declare let this: any;
// logger.log(this as any, typeof (this as any)!);
// const MainLibrary: any = require('../build/main/index');
// const MainLibrary = require('../devlib/main/src/main/index');
// declare const MainLibrary: any;

class Main {
    public static main(): void{
        const windowManager = new MainLibrary.WindowManager(app, serve, () => {
            if (serve) {
                const path = require('path'); // eslint-disable-line
                require('electron-reload')(__dirname, {
                    electron: require(path.join(__dirname, `../node_modules/electron`))
                });
                logger.log("dev reload");
                return 'http://localhost:3000/';
            } else {
                const path = require('path'); // eslint-disable-line
                logger.log(path.join(__dirname, './index.html'))
                return __dirname;
            }
        });
        logger.log(windowManager);
        windowManager.process();
        // throw new Error('test');
    }
}
try {
    // logger.log(MainLibrary, typeof MainLibrary);
    // const superAgent: SuperAgent<any> = require('superagent');
    // logger.log(require('../config/webpack.config.dev'));

    Main.main();
    // let http: HttpClient;
    // ipcMain.on('http-get', (event: IpcMessageEvent, url: string, param?: object, ...args: any[]) => {
    //     superAgent.get(encodeURI(url)).end((err: any, res: any) => {
    //         if (err) {
    //             logger.log(err);
    //         }
    //         event.sender.send('http-get', res.text);
    //     });
    // })


    // ipcMain.on('get', (event: IpcMessageEvent, url: string, param?: object, ...args: any[]) => {
    //     try {
    //         if (!http) {
    //             http = new HttpClient('localhost', 8080);
    //         }
    //         logger.log(url, param);
    //         http.get(url, param || {}).then(response => {
    //             event.sender.send(response)
    //         }).catch(e => {
    //             event.sender.send(e)
    //         });
    //     } catch (e) {
    //         event.sender.send(e);
    //     }
    // })
    // ipcMain.on('post', (event: IpcMessageEvent, url: string, param?: object, ...args: any[]) => {
    //     try {
    //         if (!http) {
    //             http = new HttpClient('localhost', 8080);
    //         }
    //         logger.log(url, param);
    //         http.post(url, param || {}).then(response => {
    //             event.sender.send(response);
    //         }).catch(e => event.sender.send(e));
    //     } catch (e) {
    //         event.sender.send(e);
    //     }
    // })

} catch (e) {
    // Catch Error
    // throw e;

    logger.fatal(e).then(()=>{
        app.quit();
        process.exit();
    });
}

export default {
    serve
}