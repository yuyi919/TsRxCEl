import { BrowserWindow, screen, Size } from 'electron';
// import { Menu } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { WindowChannel } from './Channels/WindowChannel';
import { getAppPath } from './interface';
// import { execFile } from 'child_process';
// import { main as mainMenu } from './menu';

const getCenterWindow = (screensize: Size, windowSize: Size) => {
    return {
        x: (screensize.width - windowSize.width) / 2,
        y: (screensize.height - windowSize.height) / 2,
        width: windowSize.width,
        height: windowSize.height,
        frame: false,
        useContentSize: true,
        resizable: false,
        show: false,
        // webPreferences: {
        //     webSecurity: false
        // }
    }
}
export class MainWindow {
    public win: BrowserWindow | null;
    public service: WindowChannel;

    public development: boolean;
    constructor(development: boolean){
        this.development = development;
    }
    public create(callback?: getAppPath): BrowserWindow {
        logger.log('**********开发模式**************', this.development);
        const electronScreen = screen;
        const screenSize = electronScreen.getPrimaryDisplay().workAreaSize;
        const windowSize: Size = {
            width: 1280,
            height: 720
        }
        // Create the browser window.
        this.win = new BrowserWindow(getCenterWindow(screenSize, windowSize));
        this.service = new WindowChannel(this.win);
        this.win.setAspectRatio(16 / 9, {width:0,height:0});
    
        if (this.development && (callback instanceof Function)) {
            this.win.loadURL(callback(this.win));
        } else if(callback instanceof Function){
            this.win.loadURL(url.format({
                pathname: path.join(callback(this.win), './index.html'),
                protocol: 'file:',
                slashes: true
            }));
            this.win.webContents.toggleDevTools();
        }
    
        this.win.webContents.on("dom-ready",e=>{
            if(this.win!=null){
                logger.log("Completed")
                this.win.show();
            }
        });
        // const menu = Menu.buildFromTemplate(mainMenu);
        // Menu.setApplicationMenu(menu)

        // Emitted when the window is closed.
        this.win.on('closed', () => {
            // Dereference the window object, usually you would store window
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            this.win = null;
        });
        return this.win;
    }

    public getWindow(): BrowserWindow | null{
        return this.win;
    }
}
