import { Dialog, FileFilter, OpenDialogOptions, Shell } from 'electron';
import { Observable, Observer, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { FileUtil } from './file-util';


declare const window: any;
export type DialogProperties = 'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory';

/**
 * 
 */
export class FileDialog {
    private dialog: Dialog;
    private filters: FileFilter[];
    private properties: Set<DialogProperties> = new Set<DialogProperties>([]);

    /**
     * 
     * @param isRemote 
     */
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

    /**
     * 
     * @param title  
     */
    public getOptions(title: string): OpenDialogOptions {
        return {
            title,
            defaultPath: '',
            filters: this.filters,
            properties: Array.from(this.properties)
        }
    }

    /**
     * 
     * @param filter 
     */
    public setFilters(filter?: FileFilter[] | FileFilter): FileDialog {
        if (filter instanceof Array) {
            this.filters = filter;
        } else {
            this.filters = [filter || {
                name: 'All Files',
                extensions: ['*']
            }];
        }
        return this;
    }
    /**
     * 打开窗口取得路径并按路径读取文件内容字符串
     * @param title 窗口标题
     * @param encoding 编码
     */
    public readFile(title?: string, encoding?: string): Observable<string> {
        return this.getPaths(title || '打开').pipe(
            mergeMap((path: string) => {
                return this.readFileByPath(path, encoding)
            })
        );
    }

    /**
     * 通过路径读取文件
     * @param path 
     * @param encoding 
     * @return Observable();
     */
    public readFileByPath(path: string, encoding?: string): Observable<string> {
        return new FileUtil(path).readFiles(encoding);
    }

    /**
     * 
     * @param title 
     */
    public openFile(title?: string){
        return this.getPaths(title || '打开').pipe(
            mergeMap((path: string) => {
                return this.openFileByPath(path)
            })
        );
    }
    
    /**
     * 
     * @param path 
     */
    public openFileByPath(path: string){
        const shell: Shell = window.require("electron").shell;
        try{
            shell.openItem(path);
        } catch(e) {
            shell.beep();
        }
        return of(true);
    }

    /**
     * 打开文件窗口，获取一个文件路径
     * @param title 窗口标题
     */
    public getPaths(title: string): Observable<string> {
        return new Observable<any>((obser: Observer<string>) => {
            this.dialog.showOpenDialog(this.getOptions(title), (filePath: string[]) => {
                if(filePath && filePath.length > 0){
                    for(const path of filePath){
                        console.log(path);
                        obser.next(path);
                    }
                }
                obser.complete();
            });
        });
    }

    /**
     * 
     * @param title 
     */
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