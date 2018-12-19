import { FileFilter } from 'electron';
import { Observable } from 'rxjs';
import { FileDialog } from '../Electron/dialog';
import { channel, IpcListener } from "../EventListener/IpcListener";
export interface IResponse {
    text: string;
}
export interface IOpenFile {
    title?: string;
    filter?: FileFilter[] | FileFilter;
    encode?: string;
}

@IpcListener
export class FileChannel {
    @channel<IResponse, string>('go')
    public go1(response: IResponse) {
        logger.log('receive', response);
        return 'failed!';
    }

    @channel<IOpenFile, Observable<string>>('load')
    public readFile({title,filter,encode}: IOpenFile) {
        logger.log('receive', title, filter, encode);
        return new FileDialog().setFilters(filter).readFile(title || '打开', encode)
    }

    // @channel<IResponse, string>('go')
    // public go2(response: IResponse): string {
    //     logger.log('receive', response);
    //     return 'success!';
    // }

    public onDestroy(): void {
        logger.log('disposed');
    }
}