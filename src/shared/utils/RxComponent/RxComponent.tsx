import { inject, observer } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'reflect-metadata';
import { Observable, Subscription } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
import styled from 'styled-components';
import { InjectMethod } from '.';
import { InjectMethodGroup } from './EventDecorator';
import { RxcEventType } from './interface';
import { RxcNativeEvent } from './RxcNativeEvent';
import { RxcProviderInstance } from './RxcProvider';
import * as RxComponentUtil from './utils';

export interface IRxComponentConfig {
    name: string;
    observer?: boolean
    inject?: Array<string>;
    style?: string | ((props: any) => string);
    portal?: Element | null | undefined;
    [key: string]: any
}

export const stringOfRxcEventType = {
    'componentDidMount': RxcEventType.DidMount,
    'componentDidUpdate': RxcEventType.DidUpdate,
    'componentWillUnmount': RxcEventType.WillUnmount
}
export const nameOfRxcEventType = {
    [RxcEventType.DidUpdate]: 'rxcOnChanges$',
    [RxcEventType.WillUnmount]: 'rxcOnDestroy$',
}

/**
 * 
 * @param keyName 
 */
export function RxComponent(config: IRxComponentConfig) {
    return function (target: React.ComponentClass) {
        // target.prototype.$isRxComponent = true;
        console.log(target);
        if (config.observer) {
            target = observer(target);
        }
        const injectMethods: InjectMethodGroup = target.prototype.$RxcListeningFunction || new InjectMethodGroup();
        const types: Map<RxcEventType, Set<InjectMethod>> = injectMethods.getTypes();
        // render代理
        const proxyRender = (render: any, handler: ProxyHandler<any>, args: Array<any>) => {
            const r = Reflect.apply(render, handler, args)
            if (config.portal) {
                return ReactDOM.createPortal(r, config.portal)
            } else {
                return r;
            }
        };
        RxComponentUtil.setProxy(target.prototype, 'render', (render: any, handler: ProxyHandler<any>, args: Array<any>) => {
            const result = proxyRender(render, handler, args);
            Reflect.set(handler, 'render', new Proxy(Reflect.get(handler, 'render'), { apply: proxyRender }));
            return result;
        });
        // 列出所有被标注为注入的方法
        injectMethods.getBeans().forEach((method: InjectMethod, methodName: string) => {
            type paramIndex = number;
            const injectPre: Map<paramIndex, RxcEventType> = method.getInject();
            if (injectPre.size > 0) {
                RxComponentUtil.setProxy(target.prototype, methodName, (thisTarget: any, thisHandler: ProxyHandler<any>, thisArgs: Array<any>) => {
                    injectPre.forEach((type: RxcEventType, index: paramIndex) => {
                        thisArgs[index] = Reflect.get(thisHandler, nameOfRxcEventType[type]);
                    })
                    return Reflect.apply(thisTarget, thisHandler, thisArgs);
                })
            }
        });


        // 组件载入代理
        RxComponentUtil.setProxy(target.prototype, 'componentDidMount', (onInit: () => void, handler: ProxyHandler<any>, args: Array<any>) => {
            // 组件注销事件
            // const onDestroy$: EventEmitter<boolean> = new EventEmitter<boolean>();
            const onDestroy$: Observable<RxcNativeEvent> = Reflect.get(handler, nameOfRxcEventType[RxcEventType.WillUnmount]) || RxcProviderInstance.getRxEventEmitter(RxcEventType.WillUnmount, handler as any);
            const onChanges$: Observable<RxcNativeEvent> = Reflect.get(handler, nameOfRxcEventType[RxcEventType.DidUpdate]) || RxcProviderInstance.getRxEventEmitter(RxcEventType.DidUpdate, handler as any, onDestroy$);
            Reflect.set(handler, nameOfRxcEventType[RxcEventType.WillUnmount], onDestroy$);
            const sub: Subscription = onDestroy$.subscribe(() => {
                Reflect.set(handler, nameOfRxcEventType[RxcEventType.WillUnmount], null);
                Reflect.set(handler, nameOfRxcEventType[RxcEventType.DidUpdate], null);
                RxcProviderInstance.removeEventListener(handler as any);
                sub.unsubscribe();
                console.log(sub);
            });
            // 组件更新事件
            Reflect.set(handler, nameOfRxcEventType[RxcEventType.DidUpdate], onChanges$);
            const result = Reflect.apply(onInit, handler, args);
            const type: RxcEventType = RxcEventType.DidMount;
            const injectArray: Set<InjectMethod> | undefined = types.get(type);
            if (injectArray instanceof Set) {
                injectArray.forEach((applyMethod: InjectMethod) => {
                    if (applyMethod.getSub().indexOf(type) > -1) {
                        Reflect.apply(applyMethod.getMethod(), handler, args);
                    }
                });
            }
            RxcProviderInstance.emitRxEvent(RxcEventType.DidMount, handler as any);
            return result;
        });

        // 组件更新代理
        RxComponentUtil.setProxy(target.prototype, 'componentDidUpdate', (onChanges: any, handler: ProxyHandler<any>, args: Array<any>) => {
            const type: RxcEventType = RxcEventType.DidUpdate;
            const injectArray: Set<InjectMethod> | undefined = types.get(type) || new Set<InjectMethod>();
            const result = Reflect.apply(onChanges, handler, args);
            if (injectArray instanceof Set) {
                injectArray.forEach((applyMethod: InjectMethod) => {
                    if (applyMethod.getSub().indexOf(type) > -1) {
                        console.log(nameOfRxcEventType[type], applyMethod, handler, args);
                        Reflect.apply(applyMethod.getMethod(), handler, args);
                    }
                });
            }
            RxcProviderInstance.emitRxEvent(type, handler as any);
            return result;
        });
        RxComponentUtil.setProxy(target, 'getDerivedStateFromProps', (willUpdate: any, handler: ProxyHandler<any>, args: Array<any>) => {
            // console.log(handler, target.name, args);
            return Reflect.apply(willUpdate, handler, args) || null;
        })
        // 组件卸载代理
        RxComponentUtil.setProxy(target.prototype, 'componentWillUnmount', (onDestroy: any, handler: ProxyHandler<any>, args: Array<any>) => {
            const type: RxcEventType = RxcEventType.WillUnmount;
            const injectArray: Set<InjectMethod> | undefined = types.get(type);
            const result = Reflect.apply(onDestroy, handler, args);
            if (injectArray instanceof Set) {
                injectArray.forEach((applyMethod: InjectMethod) => {
                    if (applyMethod.getSub().indexOf(type) > -1) {
                        Reflect.apply(applyMethod.getMethod(), handler, args);
                    }
                });
            }
            console.log(nameOfRxcEventType[type], handler, args);
            RxcProviderInstance.emitRxEvent(type, handler as any);
            return result;
        });
        let basicComponent = styled(target)`${config.style}` as any;
        if (config.inject) {
            basicComponent = inject(...config.inject)(basicComponent);
        }
        // return new Proxy(basicComponent.prototype.constructor,{
        //     construct:(component: any, args: Array<any>, newTarget: any)=>{
        //         console.log(component,args);
        //         return Reflect.construct(component, args);
        //     }
        // });
        return basicComponent;
    }
}
