import * as iconv from 'iconv-lite';
// import {  } from 'electron-debug';
import { Appender, Configuration, ConsoleAppender, DateFileAppender, FileAppender, Log4js, Logger as Logger4js, LogLevelFilterAppender, StandardOutputAppender } from 'log4js';
// import { app } from 'node-log4js';
import path from 'path';
import 'log4js/lib/appenders/logLevelFilter';
const isElectronRenderer = require('is-electron-renderer');
const log4js = require('log4js');


export class Logger {
    static systemPath: string;
    private console: Appender & ConsoleAppender = { type: 'console', layout: { type: "basic" } }
    private stduot: Appender & StandardOutputAppender = { type: 'stdout' }
    private file = (filename: string): FileAppender => ({
        type: 'file',
        filename: path.join(process.cwd(), 'logs/' + filename + '.log'),//文件目录，当目录文件或文件夹不存在时，会自动创建
        maxLogSize: 1024,//文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
        backups: 3,//default value = 5.当文件内容超过文件存储空间时，备份文件的数量
        //compress : true,//default false.是否以压缩的形式保存新文件,默认false。如果true，则新增的日志文件会保存在gz的压缩文件内，并且生成后将不被替换，false会被替换掉
        encoding: 'utf-8',//default "utf-8"，文件的编码
    })
    private dateFile = (filename: string): DateFileAppender => ({
        type: "dateFile",
        filename: path.join(process.cwd(), 'logs/' + filename),//您要写入日志文件的路径
        alwaysIncludePattern: true,//（默认为false） - 将模式包含在当前日志文件的名称以及备份中
        //compress : true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
        pattern: "-yyyy-MM-dd.log",//（可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
        encoding: 'utf-8',//default "utf-8"，文件的编码
    })
    public errorFilter = (appender: string): LogLevelFilterAppender | DateFileAppender | any => isElectronRenderer ? ({}) : ({
        [appender + 'Error']: {
            type: "logLevelFilter", appender: appender,
            level: "WARN", maxLevel: 'FATAL'
        }
    });

    private config = (): Configuration => ({
        appenders: {
            console: this.console,
            stduot: this.stduot,
            file: this.file('renderer'),
            datefile: this.dateFile('system'),
            ...this.errorFilter('datefile')
        },
        categories: {
            default: {
                appenders: ['stduot'],
                level: 'all'
            },
            Renderer: {
                appenders: ['console', 'file', 'stduot'],
                level: 'all'
            },
            System: {
                appenders: (isElectronRenderer ? [] : ['datefileError']).concat(['datefile', 'stduot']),
                level: 'all'
            }
        }
    })
    private logger: Logger4js;
    public logger2: Logger4js;
    private name: string = isElectronRenderer ? "Renderer" : "System"
    private log4js: Log4js;
    constructor() {
        // console.log(this.config())
        if (!Logger.systemPath) {
            Logger.systemPath = __dirname || '';
        }
        if (!this.log4js) {
            log4js.configure(this.config());
            this.log4js = log4js;
            this.logger = this.log4js.getLogger(this.name);
            this.logger2 = this.log4js.getLogger();
        }
        // this.logger2.info(this.config());
    }
    public quit() {
        if (log4js) {
            log4js.shutdown((e?: Error) => {
                console.log(e || 'logger shutdown')
            });
        }
    }
    /**
     * name
     */
    public logLine(instance: Type.ClassConstructor | object | string, ...msgs: any[]) {
        let title: string = "undefined";
        if (typeof instance == "function") {
            title = instance.name;
        } else if (typeof instance == "object" && instance.constructor != Object) {
            title = instance.constructor.name
        } else if (typeof instance == "string") {
            title = instance
        }
        this.log(`#*******#${title}#*******#`)
        this.log(msgs);
        this.log(`#*******#${title}#*******#`)
    }
    public log(msg: any, ...msgs: any[]): void {
        if (isElectronRenderer) {
            this.logger.trace(msg, ...msgs, this.getTrace(this.log));
        } else {
            this.logger.info(msg, ...this.getStr(msgs), this.getTrace(this.log));
        }
    }
    public warn(instance: any, ...msgs: any[]): void {
        if (isElectronRenderer) {
            this.logger.debug(instance, ...msgs, this.getTrace(this.log));
        } else {
            this.logger.warn(instance, ...this.getStr(msgs), this.getTrace(this.log));
        }
    }
    public error(instance: any, ...msgs: any[]): void {
        if (isElectronRenderer) {
            this.logger.warn(instance, ...msgs, this.getTrace(this.log));
        } else {
            this.logger.error(instance, ...this.getStr(msgs), this.getTrace(this.log));
        }
    }
    public fatal(instance: any, ...msgs: any[]): void {
        if (isElectronRenderer) {
            this.logger.fatal(instance, ...msgs);
        } else {
            this.logger.fatal(instance, ...this.getStr(msgs));
        }
    }

    private getStr(msgs: any[]): any[] {
        for (let i in msgs) {
            if (typeof msgs[i] == "string") {
                msgs[i] = this.transform(msgs[i]);
            }
        }
        return msgs;
    }
    private transform(msg: string): string {
        return iconv.decode(iconv.encode(msg, 'binary'), "utf8");
    }

    private prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): string | void {
        let i: number = 0;
        // const list = stackTraces.map(i=>i.getEvalOrigin());
        // console.log(list);
        while (stackTraces[i] != null) {
            const trace = stackTraces[i++];
            const fileName = trace.getFileName();
            if (fileName && fileName.indexOf('src\\global\\') == -1 && (fileName.indexOf('src\\') > -1 || fileName.indexOf('localhost') > -1)) {
                let functionName: string | null = trace.getFunctionName() || trace.getMethodName();
                const line = trace.getLineNumber();
                const column = trace.getColumnNumber();
                // const currentIndex = i++;
                // while (stackTraces[i] != null && (functionName == null || functionName.indexOf('_')==0) && (i-currentIndex)<16) {
                //     functionName = stackTraces[i].getMethodName() || stackTraces[i].getFunctionName() || functionName;
                //     i++;
                // }
                return ['Function: ', functionName || "<anonymous>", '  src: ', fileName, ':', line, ':', column].join('');
            }
        }
    }
    private getTrace(caller?: Function): string | void {
        try {
            throw new Error();
        } catch (e) {
            const stackList = ((e.stack || '') as string).split('\n');
            let i: number = 1;
            while (stackList[i] != null) {
                const stack: string = stackList[i++];
                if (stack.indexOf('src\\global\\') == -1 && (stack.indexOf('src\\') > -1 || stack.indexOf('localhost') > -1)) {
                    return ' -' + stack;
                }
            }
        } finally {
            // Error.prepareStackTrace = original;
        }
    }

}
declare global {
    /**
     * log4js
     */
    var logger: Logger;
    namespace NodeJS {
        interface Global {
            logger: Logger
        }
    }
    interface Window {
        logger: Logger
    }
}

const logger = new Logger();
Object.freeze(logger)
global.logger = logger;
// declare const window: Window;
// if(window != undefined) {
//     window.logger = logger;
// }
export default logger;