import { FileFilter } from "electron";
import { Observable } from "rxjs";
// import { IOpenFile } from "src/main/EventListener/FileChannel";
import { ClientEventEmitter } from "./ClientEventEmitter";

export interface IOpenFile {
    title?: string;
    filter?: FileFilter[] | FileFilter;
    encode?: string;
}
const service: ClientEventEmitter<IOpenFile, string> = new ClientEventEmitter<IOpenFile, string>("load");

export const openAulFile = (encode?: string): Observable<string> => {
    return service.get({
        title: "打开exo文件",
        encode: encode || 'shift-jis',
        filter: [{
            extensions: ["exo","exa"],
            name: "aviutl导出文件格式"
        }]
    })
}

export const openTxtFile = (): Observable<string> => {
    return service.get({
        title: "打开文本文件",
        encode: "utf-8",
        filter: [{
            extensions: ["txt","log"],
            name: "文本格式"
        }]
    })
}

export const saveFile = (): Observable<string> => {
    return service.get({
        title: "打开exo文件",
        encode: "utf-8",
        filter: [{
            extensions: ["exo","exa"],
            name: "aviutl导出文件格式"
        }]
    })
}