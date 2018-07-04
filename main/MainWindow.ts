import { BrowserWindow, Menu, screen, Size } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { main as mainMenu } from './menu';

const getCenterWindow = (screensize: Size, windowSize: Size) => {
    return {
        x: (screensize.width - windowSize.width) / 2,
        y: (screensize.height - windowSize.height) / 2,
        width: windowSize.width,
        height: windowSize.height
    }
}
export default class MainWindow {
    public win: BrowserWindow | null;

    public development: boolean;
    constructor(development: boolean){
        this.development = development;
    }
    public create(): BrowserWindow {
        console.log('************************', this.development);
        const electronScreen = screen;
        const screenSize = electronScreen.getPrimaryDisplay().workAreaSize;
        const windowSize: Size = {
            width: 1280,
            height: 720
        }
        // Create the browser window.
        this.win = new BrowserWindow(getCenterWindow(screenSize, windowSize));
        this.win.setAspectRatio(16 / 9, {width:0,height:0});
    
        if (this.development) {
            require('electron-reload')(__dirname, {
                electron: require(path.join(__dirname, `../node_modules/electron`))
            });
            this.win.loadURL('http://localhost:3000/');
        } else {
            this.win.loadURL(url.format({
                pathname: path.join(__dirname, '../build/index.html'),
                protocol: 'file:',
                slashes: true
            }));
        }
        this.win.webContents.openDevTools();
    
        
        const menu = Menu.buildFromTemplate(mainMenu);
        Menu.setApplicationMenu(menu)
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
