import { Dialog, FileFilter, OpenDialogOptions} from 'electron';
import * as Rx from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { FileUtil } from './file-util';

declare const window: any;
export type DialogProperties = 'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory';
export class FileDialog {
    private dialog: Dialog;
    private filters: FileFilter[];
    private properties: Set<DialogProperties> = new Set<DialogProperties>([]);
    constructor(isRemote?: boolean) {
        if(isRemote){
            const remote = window.require('electron').remote;
            this.dialog = remote.dialog;
            return;
        } else {
            const { dialog } = require('electron');
            this.dialog = dialog;
        }
    } 
    public getOptions(title: string): OpenDialogOptions {
        return {
            title,
            defaultPath: '',
            filters: this.filters,
            properties: Array.from(this.properties)
        }
    }
    public setFilters(filter?: FileFilter[] | FileFilter) {
        if (filter instanceof Array) {
            this.filters = filter;
        } else {
            this.filters = [filter || {
                name: 'All Files',
                extensions: ['*']
            }];
        }
    }
    public openFile(title?: string, encoding?: string): Rx.Observable<any> {
        return this.getPaths(title || '打开').pipe(
            mergeMap((path: string) => {
                if(!path) {
                    return Rx.of(false)
                }
                return this.openFileByPath(path, encoding)
            })
        );
    }
    public openFileByPath(path: string, encoding?: string): Rx.Observable<any> {
        return new FileUtil(path).readFiles(encoding);
    }
    public getPaths(title: string): Rx.Observable<string> {
        return new Rx.Observable<any>((obser: Rx.Observer<string>) => {
            this.dialog.showOpenDialog(this.getOptions(title), (filePath: string[]) => {
                filePath.forEach((path: string) => {
                    console.log(path);
                    obser.next(path);
                })
                obser.complete();
            });
        });
    }
    public getPathsSync(title: string): string[] {
        return this.dialog.showOpenDialog(this.getOptions(title));
    }

    public setMultiSelect(is: boolean): void {
        if (is) {
            this.properties.add('multiSelections');
            return;
        }
        this.properties.delete('multiSelections');
    }
}