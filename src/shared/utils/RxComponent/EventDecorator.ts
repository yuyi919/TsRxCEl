import 'reflect-metadata';
import { InjectMethod } from './InjectMethod';
import { RxcEventType } from './interface';

export class InjectMethodGroup {
    private typeMap: Map<RxcEventType, Set<InjectMethod>>;
    private methodMap: Map<string,InjectMethod>;
    constructor(){
        this.typeMap = new Map<RxcEventType, Set<InjectMethod>>();
        this.methodMap = new Map<string,InjectMethod>();
    }
    public addMethod(type: RxcEventType, method: InjectMethod){
        // console.log('add', RxcEventType[type],method);
        if(!this.methodMap.has(method.getMethodName())){
            this.methodMap.set(method.getMethodName(), method);
        }
        if(this.typeMap.has(type)){
            this.typeMap.get(type)!.add(method);
        } else {
            this.typeMap.set(type, new Set<InjectMethod>([method]));
        }
    }
    public get(type: RxcEventType){
        return this.typeMap.get(type);
    }
    public getByMethod(methodName: string) {
        return this.methodMap.get(methodName);
    }
    public getTypes() {
        return this.typeMap;
    }
    public getBeans() {
        return this.methodMap;
    }
}
function getBean(target: any, methodName: string, type: RxcEventType) {
    // console.log('getBean', methodName,RxcEventType[type])
    let methods: InjectMethodGroup = target.$RxcListeningFunction;
    if(!(methods instanceof InjectMethodGroup)) {
        methods = new InjectMethodGroup();
        target.$RxcListeningFunction = methods;
    }
    let bean: InjectMethod | undefined = methods.getByMethod(methodName);
    if(!(bean instanceof InjectMethod)){
        bean = new InjectMethod(methodName, target);
    }
    methods.addMethod(type, bean);
    return bean;
}
/**
 * 监听事件
 * @param eventType 
 */
export function EventListener(eventType: RxcEventType) {
    return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
        // create or update
        // console.log(target[methodName]);
        // console.log(RxcEventType[eventType])
        getBean(target,methodName,eventType).subserbe(eventType);
    }
}

/**
 * 订阅componentDidMount的事件
 * @param keyName 
 */
export function onInit(keyName?: string) {
    return EventListener(RxcEventType.DidMount);
}
/**
 * 订阅componentDidUpdate的事件
 * @param keyName 
 */
export function onChanges(keyName?: string) {
    return EventListener(RxcEventType.DidUpdate);
}
/**
 * 订阅componentWillUnmount的事件
 * @param keyName 
 */
export function onDestroy(keyName?: string) {
    return EventListener(RxcEventType.WillUnmount);
}

export const ReflectMetadataType = {
    type: "design:type",
    paramTypes: "design:paramtypes",
    returnType: "design:returntype"
}
/**
 * 注入EventEmitter实例作为参数
 * @param listenerEventType 
 */
export function getEventListener(listenerEventType: RxcEventType) {
    return function (target: any, methodName: string, paramIndex: number) {
        getBean(target,methodName,listenerEventType).provide(paramIndex, listenerEventType);
    }
}

/**
 * 同componentDidMount
 */
export function rxcInit() {
    return getEventListener(RxcEventType.DidMount);
}
/**
 * 同componentDidUpdate
 */
export function rxcChanges() {
    return getEventListener(RxcEventType.DidUpdate);
}
/**
 * 同componentWillUnmount
 */
export function rxcDestroy() {
    return getEventListener(RxcEventType.WillUnmount);
}

