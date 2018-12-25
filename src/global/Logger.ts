// import * as iconv from 'iconv-lite';
// import {  } from 'electron-debug';
import log4js, { Appender, Configuration, ConsoleAppender, DateFileAppender, FileAppender, Log4js, Logger as Logger4js, LogLevelFilterAppender, StandardOutputAppender } from 'log4js';
// import { app } from 'node-log4js';
import path from 'path';
import 'log4js/lib/appenders/logLevelFilter';
const isElectronRenderer: boolean = require('is-electron-renderer');
const isDevelopment: boolean = process && process.env && process.env.NODE_ENV === 'development';

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
        encoding: 'utf-8',//default "utf-8"，文件的编码,
        keepFileExt: true
    })
    private dateFile = (filename: string): DateFileAppender => ({
        type: "dateFile",
        filename: path.join(process.cwd(), 'logs/' + filename),//您要写入日志文件的路径
        alwaysIncludePattern: isDevelopment,//（默认为false） - 将模式包含在当前日志文件的名称以及备份中
        // compress : true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
        pattern: "-yyyy-MM-dd.log",//（可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
        encoding: 'utf-8',//default "utf-8"，文件的编码
        keepFileExt: true
    })
    public errorFilter = (appender: string): { [key: string]: LogLevelFilterAppender } => isElectronRenderer ? ({}) : ({
        [appender + 'Error']: {
            type: "logLevelFilter", appender: appender,
            level: "ALL"
        }
    });

    private config = (): Configuration => ({
        appenders: {
            console: this.console,
            stduot: this.stduot,
            renderFile: this.file('renderer'),
            renderDatafile: this.dateFile('renderer'),
            systemFile: this.file('system'),
            systemDatefile: this.dateFile('system'),
            ...this.errorFilter('renderDatafile'),
            ...this.errorFilter('systemDatefile'),
        },
        categories: {
            default: {
                appenders: ['stduot'],
                level: 'all'
            },
            Renderer: {
                appenders: ['console', 'renderFile', 'renderDatafile', 'stduot'],
                level: 'all'
            },
            System: {
                appenders: ['systemFile', 'systemDatefileError', 'stduot'],
                level: 'all'
            },
            // RendererError: {
            //     appenders: ['console', 'renderFile', 'stduot'],
            //     level: 'all'
            // },
            // SystemError: {
            //     appenders: ['console', 'renderFile', 'stduot'],
            //     level: 'all'
            // },
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
        if (isElectronRenderer) {
            this.logger.error = this.logger.warn;
            this.logger.warn = this.logger.debug;
            this.logger.info = this.logger.trace;
            this.logger.log();
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
        this.trace(`=====${title}=====`)
        this.log(msgs);
        this.trace(`=====${title}=====`)
    }
    public log(...msgs: any[]): void {
        this.logger.info(this.getOutput(...msgs, this.getTrace()));
    }

    public warn(...msgs: any[]): void {
        this.logger.warn(this.getOutput(...msgs, this.getTrace()));
    }

    /**
     * 调试输出
     * @param dbs 想输出的队列平铺
     */
    public debug(...dbs: any[]): void {
        const trace = this.getTrace();
        this.trace('=====debug');
        for(const db of dbs){
            this.logger.debug(db);
        }
        this.trace('=====debug: '+ trace);
    }
    /**
     * 错误提示
     * @param instance 理由/对象/捕获异常
     */
    public error(instance: string | object | Error): void {
        const trace = this.getTrace();
        if(instance instanceof Error){
            this.logger.error(instance);
            this.logger.trace('catch:' + trace);
        } else {
            this.logger.error(this.getOutput(instance, trace));
        }
    }

    /**
     * 致命错误
     * @param error 抛出的错误
     * @returns promise返回捕获错误的位置信息
     */

    public fatal(error: Error): Promise<string> {
        return this.getTraceAsync().then((trace: string) => {
            this.logger.fatal(error);
            this.trace(this.getOutput('catch', trace))
            return trace;
        })
    }

    /**
     * 跟踪
     * @param msg 跟踪消息
     */
    public trace(msg: string): void {
        this.logger.trace(msg);
    }

    private getOutput(...msgs: any[]): string {
        for (let i in msgs) {
            if (typeof msgs[i] == "object") {
                msgs[i] = this.transform(msgs[i]);
            }
        }
        return msgs.join(' ');
    }
    private transform(msg: any): string {
        // return iconv.decode(iconv.encode(msg, 'binary'), "utf8");
        return JSON.stringify(msg);
    }

    private getTraceAsync = () => new Promise((resolve) => {
        const trace: string = this.getTrace();
        setTimeout(() => {
            resolve(trace)
        }, 200)
    })

    /**
     * 返回输出源的栈
     */
    private getTrace(): string {
        try {
            throw new Error();
        } catch (e) {
            const stackList = ((e.stack || '') as string).split('\n');
            let i: number = 1;
            while (stackList[i] != null) {
                const stack: string = stackList[i++];
                if (stack.indexOf('src\\global\\') == -1 && (stack.indexOf('src\\') > -1 && (stack.indexOf('at Logger.') == -1))) {
                    return ' -' + stack;
                }
            }
        }
        return ''
    }

}
declare global {
    /**
     * log4js
     */
    var logger: Logger;
    var isElectronRenderer: boolean;
    var isDevelopment: boolean;
    namespace NodeJS {
        interface Global {
            logger: Logger
            isElectronRenderer: boolean;
            isDevelopment: boolean;
        }
    }
    interface Window {
        logger: Logger;
        isElectronRenderer: boolean;
    }
}

const logger = new Logger();
Object.freeze(logger)
global.logger = logger;
global.isElectronRenderer = isElectronRenderer;
// declare const window: Window;
// if(window != undefined) {
//     window.logger = logger;
// }
export default logger;