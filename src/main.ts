import { app, BrowserWindow, dialog, FileFilter, ipcMain, IpcMessageEvent, OpenDialogOptions } from 'electron';
import * as superagent from 'superagent';
import { FileChannel } from './main/EventListener/FileChannel';
import { FileUtil, HttpClient, MainWindow } from './main/index';

const serve: boolean = process.env.NODE_ENV === 'development';

if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support'); // eslint-disable-line
    sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
    require('electron-debug')(); // eslint-disable-line global-require


    console.log('debug');
    const path = require('path'); // eslint-disable-line
    const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
    require('module').globalPaths.push(p); // eslint-disable-line
}

const mainWindow = new MainWindow(serve);
let win: BrowserWindow | null | undefined = null;

try {

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', () => {
        win = mainWindow.create();
        win.webContents.openDevTools();
        // require('electron-react-devtools').install();
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            win = mainWindow.create();
        }
    });

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

    ipcMain.on('openFile', (event: IpcMessageEvent, ...args: any[]) => {
        console.log(event, args);
        const exoFilter: FileFilter = {
            name: "EXO",
            extensions: ["exo"]
        };
        const options: OpenDialogOptions = {
            title: "test",
            filters: [exoFilter]
        };
        dialog.showOpenDialog(options, (filePath: string[]) => {
            filePath.forEach((path: string) => {
                console.log(path);
                new FileUtil(path).read().then(result => {
                    event.returnValue = result;
                });
            })
        });
    });


} catch (e) {
    // Catch Error
    // throw e;
}

const channels = new FileChannel();
console.log(channels);