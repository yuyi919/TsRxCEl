import { BrowserWindow } from 'electron';
import { channel, IpcListener } from "../EventListener/IpcListener";

@IpcListener
export class WindowChannel {
    private win: BrowserWindow;
    constructor(window: BrowserWindow){
        this.win=window;
    }
    
    @channel<boolean, boolean>('windowReload')
    public windowChange(isForce: boolean){
        if (this.win) {
            if(isForce){
                this.win.reload()
            } else {
                this.win.webContents.reloadIgnoringCache();
            }
        }
        return true;
    }

    public onDestroy(): void {
        logger.log('disposed');
    }
}