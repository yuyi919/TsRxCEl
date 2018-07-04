//  { ReadLine } from 'readline'; 
import { Promise } from 'es6-promise';
import * as fs from 'fs';

export class FileUtil {
    public path: string;
    constructor(path: string){
        this.path = path;
    }
    public read() {
        const buf: Buffer = new Buffer(1024);
        let read: string = '';
        console.log("准备打开已存在的文件！");
        return new Promise((resolve,reject)=>{
            fs.open(this.path, 'r', (openError, fd) => {
                if (openError) {
                    reject(openError);
                } 
                console.log("文件打开成功！");
                console.log("准备读取文件：");
                fs.read(fd, buf, 0, buf.length, 0, (readError, bytes) => {
                    if (readError){
                        reject(readError);
                    }
                    console.log(bytes + "  字节被读取");
                    // 仅输出读取的字节
                    if(bytes > 0){
                        // console.log(buf.slice(0, bytes).toString());
                        read = buf.slice(0, bytes).toString();
                    }
                    // 关闭文件
                    fs.close(fd, closeError => {
                        if (closeError){
                            reject(closeError);
                        } 
                        console.log("文件关闭成功 close success");
                        resolve(read);
                    });
                });
            });
        })
    }
}