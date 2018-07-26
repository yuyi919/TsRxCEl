import { Promise } from 'es6-promise';
import { ClientRequest, ClientResponse, get as httpGet, OutgoingHttpHeaders, request as httpRequest, RequestOptions } from 'http';
import * as querystring from 'querystring';


export class HttpClient {
    public host: string;
    public port: number;
    public cookies: string | string[] | undefined;
    constructor(host: string, port?: number){
        this.host = host;
        this.port = port || 80;
    }
    public setHost(host: string){
        this.host = host;
    }
    public setPort(port: number){
        this.port = port;
    }
    public getDefaultOptions(): RequestOptions {
        return {
            hostname: this.host,
            port: this.port
        };
    }
    public getDefaultHeader(): OutgoingHttpHeaders {
        const cookie = (this.cookies instanceof Array)?this.cookies.join(';'):this.cookies;
        console.log(cookie)
        return cookie?{
            'Cookie': cookie
        }:{};
    }
    public get(url: string, param: object): Promise<any> {
        const $ = this;
        return new Promise((resolve,reject)=>{
            const options: RequestOptions = {
                ...this.getDefaultOptions(),
                path: url + (param?('?'+querystring.stringify(param)):""),
                headers: this.getDefaultHeader()
            };
            console.log(options);
            httpGet(options, (response: ClientResponse) => {
                let body: string = '';
                const {statusCode, headers} = response;
                console.log('HEADERS: ' + JSON.stringify(headers));  
                console.log('STATUS: ' + response.statusCode + ' | ' + response.statusMessage);

                const contentType = response.headers['content-type'];
                let error;
                if (statusCode !== 200) {
                  error = new Error('请求失败。\n' +  `状态码: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType || '')) {
                  error = new Error('无效的 content-type.\n' +  `期望 application/json 但获取的是 ${contentType}`);
                }
                if (error) {
                  console.error(error.message);
                  // 消耗响应数据以释放内存
                  response.resume();
                  reject(error);
                }
                $.cookies = headers['set-cookie'];

                response.setEncoding('utf-8');
                response.on('data', next => body += next);
                response.on('end', () => {
                    // Data reception is done, do whatever with it!
                    console.log('end',body);
                    resolve(body);
                });
                response.on('error',(err: Error)=>{
                    console.log('error!',err);
                    reject(err);
                });
            })
        });
    }
    public post(url: string, param: object, option?: RequestOptions): Promise<any> {
        const $ = this;
        const postData: string = querystring.stringify(param);
        const options: RequestOptions = {
            ...option,
            headers: {  
                ...this.getDefaultHeader(),
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            },
            ...this.getDefaultOptions(),
            method: 'POST',
            path: url
        };
        console.log(options, postData, param);
        return new Promise((resolve,reject)=>{
            const request: ClientRequest = httpRequest(options, (response: ClientResponse) => {
                // Continuously update stream with data
                let body: string = '';
                const {statusCode, statusMessage, headers} = response;
                console.log('HEADERS: ' + JSON.stringify(headers));  
                console.log('STATUS: ' + statusCode + ' | ' + statusMessage);
                $.cookies = headers['set-cookie'];
                console.log($.cookies,headers['set-cookie']);
                if(response.statusCode == 302) {// 重定向
                    console.log(headers.location);
                    reject(new Error('redirect:'+headers.location));
                }
                response.setEncoding('utf-8');
                response.on('data', next => body += next);
                response.on('end', () => {
                    // Data reception is done, do whatever with it!
                    console.log('end', body);
                    resolve(body);
                });
            });
            request.setTimeout(4000, () => {
                // 设置请求4s超时，超时后终止，引发请求抛错
                request.abort();
            });
            request.on('error',(err: Error)=>{
                console.log('error!',err);
                reject(err);
            })
            request.write(postData);
            request.end();
        });
    }
}