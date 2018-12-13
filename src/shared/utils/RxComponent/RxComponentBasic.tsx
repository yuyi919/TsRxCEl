import { Component } from 'react';
import { merge, Observable, of } from 'rxjs';
import { filter, map, share, takeUntil } from 'rxjs/operators';
import { EventEmitter } from '../EventEmitter';
import { RxcEventType } from './interface';
import { RxcInnerComponentProps } from './RxcInnerComponentProps';
import { RxcNativeEvent } from './RxcNativeEvent';
import { RxcProviderInstance } from './RxcProvider';

/**
 * RxComponent组件抽象类
 */
export abstract class RxComponentBasic extends Component<any,any> {
    public state: any = { }
    public $onDestroy: EventEmitter<any> = new EventEmitter<any>(); // 本身组件被卸载
    public rxEventProps: RxcInnerComponentProps;
    
    /**
     * 依附组件实例
     */
    public innerInstance: any = null;
    public innerComponent: any;
    public $innerComponentMount: Observable<any> = this.getRxEventEmitter(RxcEventType.InnerMount);
    public $innerComponentUnmount: Observable<any> = this.getRxEventEmitter(RxcEventType.InnerUnmount);

    public $componentDidMount: Observable<RxcNativeEvent> = this.getRxEventEmitter(RxcEventType.DidMount);
    public $componentDidUpdate: Observable<RxcNativeEvent> = this.getRxEventEmitter(RxcEventType.DidUpdate);
    public $componentWillUnmount: Observable<RxcNativeEvent> = this.getRxEventEmitter(RxcEventType.WillUnmount);
    
    
    constructor(props: any) {
        super(props);
        this.$componentWillUnmount.subscribe(()=>{
            RxcProviderInstance.removeEventListener(this);
        })
        this.rxEventProps = this.getRxEventProps();
    }
    public getRxEventEmitter(type: RxcEventType){
        return RxcProviderInstance.getRxEventEmitter(type, this, this.$onDestroy);
    }
    public eventEmit(type: RxcEventType, ...args: any[]){
        RxcProviderInstance.emitRxEvent(type, this, ...args);
    }
    public getRxEventProps(): RxcInnerComponentProps{ 
        return {
            onInit: this.$componentDidMount,
            onChanges: this.$componentDidUpdate,
            onDestroy: this.$componentWillUnmount
        }
    }
    public componentDidMount() {
        this.eventEmit(RxcEventType.DidMount);
    }
    public componentDidUpdate(...args: any[]) {
        this.eventEmit(RxcEventType.DidUpdate, ...args);
        console.log(args);
    }
    public componentWillUnmount(...args: any[]) {
        this.eventEmit(RxcEventType.WillUnmount, ...args);
        this.$onDestroy.emit(null);
        this.$onDestroy.dispose();
    }
    
    public innerComponentRef = (ref: any) => {
        this.innerInstance = ref;
        if(ref){
            this.eventEmit(RxcEventType.InnerMount, ref);
            this.innerComponent = {...ref};
        } else {
            this.eventEmit(RxcEventType.InnerUnmount, this.innerComponent);
        }
    }
    public getInnerInstance() {
        return merge(
            of(this.innerInstance),
            this.$innerComponentMount.pipe(
                takeUntil(this.$onDestroy),
                map((refEvent: RxcNativeEvent)=>refEvent.args[0])
            )
        ).pipe(
            filter(e=>e),
            share()
        );
    }
    public connect(mergeEvent: RxcNativeEvent){
        return this.getInnerInstance().pipe(
            takeUntil(this.$onDestroy),
            map((instance: any)=>{
                mergeEvent.e.instance = instance;
                return mergeEvent;
            }),
            share()
        )
    }
    public equal(target: any): boolean {
        return (this.innerInstance) instanceof target;
    }
}

/**
 * RxComponent事件接口
 */
export interface IRxcEvent {
    type: RxcEventType;
    typeStr?: string;
    instance: RxComponentBasic;
    isTruth?: boolean;
    args?: any;
}
