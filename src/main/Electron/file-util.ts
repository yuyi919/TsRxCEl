//  { ReadLine } from 'readline'; 
import { close as fsClose, createReadStream, open as fsOpen, read as fsRead, readdir as fsReaddir, ReadStream, writeFile as fsWriteFile } from 'fs';
// import { readFile as fsReadFile } from 'fs';
import * as iconv from 'iconv-lite';
import { Observable, Observer } from "rxjs";
// import { map } from "rxjs/operators";

// const iconv = require('iconv-lite');

export class FileUtil {
    public path: string;
    constructor(path: string) {
        this.path = path;
    }
    public read(): Promise<Buffer> {
        const buf: Buffer = new Buffer(1024);
        let read: Buffer;
        logger.log("准备打开已存在的文件！");
        return new Promise((resolve, reject) => {
            fsOpen(this.path, 'r', (openError: NodeJS.ErrnoException, fd: number) => {
                if (openError) {
                    reject(openError);
                }
                logger.log("文件打开成功！");
                logger.log("准备读取文件：");
                fsRead(fd, buf, 0, buf.length, 0, (readError: any, bytes: any) => {
                    if (readError) {
                        reject(readError);
                    }
                    logger.log(bytes + "  字节被读取");
                    // 仅输出读取的字节
                    if (bytes > 0) {
                        // logger.log(buf.slice(0, bytes).toString());
                        read = buf;
                    }
                    // 关闭文件
                    fsClose(fd, (closeError: any) => {
                        if (closeError) {
                            reject(closeError);
                        }
                        logger.log("文件关闭成功 close success");
                        resolve(read);
                    });
                });
            });
        })
    }
    public getDirFiles() {
        return new Observable<string>((observer: Observer<string>) => {
            fsReaddir(this.path, 'utf8', (err: NodeJS.ErrnoException, files: string[]) => {
                if (err) {
                    observer.error(err);
                } else {
                    files.forEach(observer.next);
                }
                observer.complete();
            })
        })
    }
    public readFiles(endocingName = 'utf8'): Observable<string> {
        return new Observable<string>((observer: Observer<string>) => {
            const res: ReadStream = createReadStream(this.path);
            const chunks: Buffer[] = [];
            let size = 0;
            res.on('data', (chunk: Buffer) => {
                logger.log('读取文件数据:', chunk);
                chunks.push(chunk);
                size += chunk.length;
            });
            res.on('error', (err) => {
                logger.log('发生异常:', err);
            });
            res.on('ready', () => {
                logger.log('文件已准备好..');
            });
            res.on('close', () => {
                logger.log('文件已关闭！');
            });
            res.on('end', () => {
                const buf = Buffer.concat(chunks, size);
                const str = iconv.decode(buf, endocingName);
                // logger.log('读取已完成..', str);
                observer.next(str);
            });
            // fsReadFile(this.path, "binary", function (err: NodeJS.ErrnoException, text: string) {
            //     if (err) {
            //         observer.error(err);
            //     } else {
            //         observer.next(text);
            //     }
            //     observer.complete();
            // });
        })
        // .pipe(
        //     map((text: string) => iconv.decode(new Buffer(text, "binary"), endocingName))
        // )

    }
    public writeTextFile(text: string) {
        return new Promise<boolean>((resolve, reject) => {
            fsWriteFile(this.path, text, (err) => {
                if (err) {
                    reject(err);
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        })
    }
}