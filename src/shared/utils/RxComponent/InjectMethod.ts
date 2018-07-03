import { RxcEventType } from './interface';


/**
 * 注入方法对象分析
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
    public getInject():  Map<number, RxcEventType>{
        return this.inject;
    }
    public getMethod(): ()=>any {
        return this.target[this.method];
    }
    public getMethodName(): string{
        return this.method;
    }
};