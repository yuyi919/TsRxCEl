import * as equal from 'fast-deep-equal';
import produce from 'immer';
import * as React from 'react';
import { Observable, Subscription } from 'rxjs';

export type controlValue = boolean | string | number | object | null | undefined;
export interface IRxcIfProps<T = controlValue> {
    is: T | Observable<T>;
    children?: React.ReactChild | Array<React.ReactChild>;
}
export class RxcIf<T = controlValue> extends React.Component<IRxcIfProps<T>> {
    public static showControl(is: any): boolean {
        return (is != null && is != false) ? true : false;
    }
    private listener$: Subscription;
    private is$: boolean | null = null;
    public showControl(is: T | Observable<T>): boolean {
        return (this.is$ != null) ? this.is$ : RxcIf.showControl(is);
    }
    public setListener(props: IRxcIfProps<T>) {
        if (this.listener$) {
            this.listener$.unsubscribe();
        }
        if (props.is instanceof Observable) {
            this.listener$ = props.is.subscribe((value: T) => {
                console.log(value);
                this.is$ = RxcIf.showControl(value);
                this.forceUpdate();
            })
        } else {
            this.is$ = null;
        }
    }
    public componentDidMount() {
        this.setListener(this.props);
        const test = [[1,2,3,4,5]];
        const test2 = produce(test, (state)=>{
            state[0].push(6);
        });
        console.log(test,test2,test==test2);
        (window as any).produce = produce;
    }
    public shouldComponentUpdate(nextProps: IRxcIfProps<T>) {
        if (nextProps.is != this.props.is) { // is不一必然更新
            this.setListener(nextProps);
            return true;
        }
        // 个人优化
        const nextChildren = React.Children.toArray(nextProps.children);
        const children = React.Children.toArray(this.props.children);
        if (nextChildren.length - children.length != 0) { // 如果children数量不一，必然更新
            return true;
        }
        for (let i = 0; i < children.length; i++) {
            if (!equal(nextChildren[i], children[i])) { // 遍历child判断更新
                return true;
            }
        }
        return false;
    }
    public componentWillUnmount(): void {
        if (this.listener$) {
            this.listener$.unsubscribe();
        }
    }
    public render() {
        console.log('***********************************rerender',this.is$);
        const { children, is } = this.props;
        return <>{this.showControl(is) && children}</>;
    }
}