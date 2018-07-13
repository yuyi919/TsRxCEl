import { RxcEventType } from './interface';


/**
 * 注入方法对象分析
 * @memberOf getInject 获取参数注入信息
 */
export class InjectMethod {
    private method: string;
    private sub: Array<RxcEventType> = new Array<RxcEventType>();
    private inject: Map<number, RxcEventType> = new Map<number, RxcEventType>();
    private target: any;
    constructor(method: string, target?: any){
        // console.log('new', method);
        this.method = method;
        this.target = target;
    }
    public subserbe(eventType: RxcEventType): void {
        this.sub.push(eventType);
    }
    public provide(paramIndex: number, eventType: RxcEventType): void {
        this.inject.set(paramIndex, eventType)
    }
    public getSub(){
        return this.sub;
    }
    public hasSub(type: RxcEventType): boolean {
        return this.sub.some(i=>i==type);
    }
    public getTarget(): any {
        return this.target;
    }
    public getInject():  Map<number, RxcEventType>{
        return this.inject;
    }
    public getMethod(): () => any {
        return Reflect.get(this.target, this.method);
    }
    public getMethodName(): string{
        return this.method;
    }
};

export const getInjectedMethod = (target: any, method: string, injectMap: Map<number, any>): any => {
    const nativeMethod = Reflect.get(target, method);
    if(nativeMethod){
        return new Proxy(nativeMethod,{
            apply: (methodTarget: any, handler: ProxyHandler<any>, args: Array<any>) => {
                injectMap.forEach((paramValue: any, paramIndex: number) => {
                    args[paramIndex] = paramValue;
                });
                console.log(method, handler, args);
                return Reflect.apply(methodTarget, handler, args);
            }
        });
    } else {
        return null;
    }
}