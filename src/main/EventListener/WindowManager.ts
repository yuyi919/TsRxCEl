import { app, BrowserWindow } from 'electron';
import { MainWindow } from '../MainWindow';
import { FileChannel } from './FileChannel';
import { channel, IpcListener } from './index';

export type getAppPath = (win: BrowserWindow) => string;

@IpcListener
export class WindowManager {
    private mainWindow: MainWindow;
    private win: BrowserWindow | null | undefined = null;
    private serve: boolean;
    private channels: FileChannel;
    private callback: getAppPath | undefined;

    constructor(serve: boolean, callback?: getAppPath) {
        this.serve = serve;
        this.windowCreate();
        this.callback = callback;
        this.channels = new FileChannel();
    }

    @channel<boolean, boolean>('windowReCreate')
    public windowCreate(): boolean {
        this.mainWindow = new MainWindow(this.serve);
        if (this.win != null) {
            const last = this.win;
            this.win = this.mainWindow.create(this.callback);
            last.close();
        }
        return true;
    }

    public process(): this {
        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        app.on('ready', () => {
            if (this.win === null) {
                console.log("Dev Server Starting");
                this.win = this.mainWindow.create(this.callback);
            }
            // win.webContents.openDevTools();
            // require('electron-react-devtools').install();
        });

        // Quit when all windows are closed.
        app.on('window-all-closed', () => {
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            // if (process.platform !== 'darwin') {
            //     app.quit();
            // }
            app.quit();
        });

        app.on('activate', () => {
            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (this.win === null) {
                this.win = this.mainWindow.create();
            }
        });
        return this;
    }

    public onDestroy(): void {
        this.channels.onDestroy();
        console.log('disposed');
    }
}