import { from, Observable } from 'rxjs';
import { filter, map, share, take, takeUntil, tap } from 'rxjs/operators';
import { EventEmitter } from '..';
import { RxcEventGroup, RxcEventType, rxcEventTypes } from './interface';
import { RxcNativeEvent } from './RxcNativeEvent';
import { IRxcEvent, RxComponentBasic } from './RxComponentBasic';


export class RxComponentProvider {
    /** 底层事件发射器 */
    public RxcEventEmitter: EventEmitter<IRxcEvent>;
    /** 销毁触发器 */
    public onDispose: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** 高级RxcEvent触发器提供者 */
    public rxEventProvider: RxcEventGroup = new Map<RxcEventType, any>();
    /** 已注册的component实例和对应的RxcEvent触发器集合 */
    public rxcAndEventMap: Map<RxComponentBasic, RxcEventGroup> = new Map<RxComponentBasic, RxcEventGroup>();

    /** 
     * 初始化基础事件发射器
     */
    constructor() {
        // 初始化底层事件发射器
        this.RxcEventEmitter = new EventEmitter<IRxcEvent>().takeUntil(this.onDispose);

        rxcEventTypes.forEach((type: RxcEventType) => {
            this.rxEventProvider.set(type, this.registerRxcEvent(type)); // 遍历注册高级事件触发器
        })
    }

    /** 发射事件
     * @param type 事件类型
     * @param instance 所属component的实例
     * @param ...args 参数
     */
    public emitRxEvent(type: RxcEventType, instance: RxComponentBasic, ...args: any[]): void {
        this.RxcEventEmitter.emit({ instance, type, args })
    }

    /** 返回事件发射器
     * @param type 限定触发事件类型
     * @param instance 限定触发事件所属component的实例
     */
    public getRxEventEmitter(type?: RxcEventType, instance?: RxComponentBasic, destroyEmitter?: Observable<any>): Observable<RxcNativeEvent> {
        /** RxcEvent集合 */
        let config: RxcEventGroup;
        if (instance && this.rxcAndEventMap.has(instance)) {
            // 如果传入组件实例且对应实例已经注册, 取出
            config = this.rxcAndEventMap.get(instance)!;
        } else if (instance) {
            // 如果传入组件实例但对应实例未注册, 初始化并配置对应组件实例事件集合
            config = new Map<RxcEventType, any>();
            this.rxcAndEventMap.set(instance, config);
        } else {
            // 未传入组件实例则视为获取公共事件发射器集合
            config = this.rxEventProvider;
        }

        if (type && config.has(type)) {
            // 限定获取事件类型且对应类型已经注册，直接取出返回
            return config.get(type);
        } else if (type) {
            // 限定获取事件类型且对应类型未注册，初始化并返回
            const eventEmitter = this.toFinalEventOutput(this.rxEventProvider.get(type), instance, destroyEmitter, type);
            config.set(type, eventEmitter); // 设定
            return eventEmitter;
        } else {
            // 无限定类型则返回底层事件发射器并返回
            return this.toFinalEventOutput(this.RxcEventEmitter);
        }
    }
    /** 直接注册事件
     * @param type 限定触发事件类型
     * @param instance 限定触发事件所属component的实例
     * @param func 事件方法
     */
    public registerRxEventEmitter(type: RxcEventType, instance: RxComponentBasic, func: () => {}): void {
        this.getRxEventEmitter(type, instance).subscribe(func);
    }
    public removeEventListener(instance: RxComponentBasic) {
        const events = this.rxcAndEventMap.get(instance);
        if (events) {
            events.clear();
        }
        this.rxcAndEventMap.delete(instance);
    }
    public dispose() {
        this.onDispose.emit(true);
        this.onDispose.dispose()
        this.onDispose = null!;
        this.RxcEventEmitter = null!;
        this.rxEventProvider = null!;
        this.rxcAndEventMap = null!;
    }

    /**内部方法
     * @param type 
     */
    private registerRxcEvent(type: RxcEventType): Observable<IRxcEvent> {
        return from(this.RxcEventEmitter).pipe(
            filter((e: IRxcEvent) => (e.type == type)),
            takeUntil(this.onDispose),
            share()
        );
    }
    /** 将底层事件流转化为高层事件流
     * @param input 底层流
     */
    private toFinalEventOutput(input: Observable<IRxcEvent>, instance?: RxComponentBasic, dispose?: Observable<any>, type?: RxcEventType): Observable<RxcNativeEvent> {
        return from(input).pipe(
            takeUntil(this.onDispose),
            filter((e: IRxcEvent) => instance ? (e.instance == instance) : true), // 判断是否是对象组件
            dispose ? takeUntil(dispose) : take(1),
            tap((e: IRxcEvent) => console.log(e.instance, RxcEventType[e.type])),
            map((e: IRxcEvent) => new RxcNativeEvent(e)),
            share()
        )
    }
}

export const RxcProviderInstance: RxComponentProvider = new RxComponentProvider();