import { inject, observer } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Observable } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
import { debounceTime, share, switchMap, takeUntil } from 'rxjs/operators';
import styled from 'styled-components';
import { InjectMethod } from '.';
import { EventEmitter } from '..';
import { InjectMethodGroup } from './EventDecorator';
import { RxcEventType } from './interface';
import { RxcNativeEvent } from './RxcNativeEvent';
import { RxComponentBasic } from './RxComponentBasic';

export interface IRxComponentConfig {
    name: string;
    observer?: boolean
    inject?: Array<string>;
    style?: string | ((props: any) => string);
    portal?: Element | null | undefined;
}

/**
 * 
 * @param keyName 
 */
export function RxComponent(config: IRxComponentConfig) {
    return function(target: React.ComponentClass) {
        // target.prototype.$isRxComponent = true;
        if(config.observer){
            target = observer(target);
        }
        const InnerComponent = target; 
        const injectMethods: InjectMethodGroup = target.prototype.$RxcListeningFunction;
        const methodEmitter: EventEmitter<any> = new EventEmitter<any>();
        const methodDriver: Observable<any> = methodEmitter.pipe(debounceTime(20),share());
        if(injectMethods){
            console.log(injectMethods);
            injectMethods.getBeans().forEach((bean: InjectMethod, methodName: string)=>{
                if(bean.getInject().size>0){
                    target.prototype["$"+bean.getMethodName()] = target.prototype[bean.getMethodName()];
                    target.prototype[bean.getMethodName()] = (...args: any[]) => {
                        methodEmitter.emit(new RxcNativeEvent({type: RxcEventType.Custom, instance: target.prototype, args}));
                    };
                }
            });
        }
        let basicComponent = styled(class RxComponents extends RxComponentBasic {
            constructor(props: any) {
                super(props);
                console.log("*************************",target.name,"init");
                if (injectMethods) {
                    injectMethods.getTypes().forEach((methods: Set<InjectMethod>, type: RxcEventType)=>{
                        this.getRxEventEmitter(type).pipe(
                            takeUntil(this.$onDestroy),
                            switchMap(e=>this.connect(e))
                        ).subscribe(({e,args}: RxcNativeEvent)=>{
                            methods.forEach((method:InjectMethod)=>{
                                if(method.getSub().some(i=>i==type)){
                                    method.getMethod().call(e.instance,...args);
                                }
                            })
                        })
                    })
                    injectMethods.getBeans().forEach((bean: InjectMethod, methodName: string)=>{
                        if(bean.getInject().size>0){
                            const preFunc: any = target.prototype["$"+bean.getMethodName()];
                            methodDriver.pipe(
                                takeUntil(this.$onDestroy),
                                switchMap((args: RxcNativeEvent)=>this.connect(args)),
                            ).subscribe((result: RxcNativeEvent)=>{
                                bean.getInject().forEach((type: RxcEventType, paramIndex: number)=>{
                                    result.args[paramIndex] = this.getRxEventEmitter(type);
                                })
                                // console.log(preFunc, bean.getMethodName(), result.args, result.getInstance());
                                preFunc.call(result.getInstance(),...result.args);
                            });
                            
                        }
                    });
                }
            }
            public render() {
                const show = <InnerComponent ref={this.innerComponentRef} {...this.props} {...this.rxEventProps} />;
                if(config.portal){
                    return ReactDOM.createPortal(show, config.portal)
                } else {
                    return show;
                }
            }
        })`${config.style}` as any;
        if(config.inject){
            basicComponent = inject(...config.inject)(basicComponent);
        }
        return basicComponent;
    }
}
