import { Observable } from 'rxjs';
import { FileDialog } from '../dialog';
import { channel, IpcListener } from './index';
export interface IResponse {
    text: string;
}
@IpcListener
export class FileChannel {
    

    @channel<IResponse, string>('go')
    public go1(response: IResponse) {
        console.log('receive', response);
        return 'failed!';
    }

    @channel<string, Observable<string>>('load')
    public readFile(response: string) {
        console.log('receive', response);
        return new FileDialog().openFile('打开', response)
    }

    // @channel<IResponse, string>('go')
    // public go2(response: IResponse): string {
    //     console.log('receive', response);
    //     return 'success!';
    // }

    public onDestroy(): void {
        console.log('disposed');
    }
}