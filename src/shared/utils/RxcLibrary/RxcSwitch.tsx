import equal from 'fast-deep-equal';
import * as React from 'react';
import { componentTypeEqual } from '../ComponentEqual';
import { IRxcIfProps, RxcIf } from './RxcIf';

export interface IRxcSwitchProps {
    is?: any;
    children?: React.ReactNodeArray;
}
export interface IRxcSwitchState {
    showIndex: number;
}
export class RxcSwitch extends React.Component<IRxcSwitchProps, { showIndex: number }> {
    public static getShowChildren(children: React.ReactNode, showIndex: number) {
        return React.Children.toArray(children).map((child: React.ReactChild, index: number) => {
            // console.log(showIndex, index, index != showIndex);
            if (React.isValidElement(child) && componentTypeEqual(RxcIf, child)) {
                return index != showIndex ? null : (child.props as any).children;
            } else {
                return child;
            }
        }).filter(child => child)
    }
    public static getDerivedStateFromProps(nextProps: IRxcSwitchProps, prevState: IRxcSwitchState): IRxcSwitchState {
        const nextChildren = React.Children.toArray(nextProps.children);
        for (let i = 0; i < nextChildren.length; i++) {
            const child: React.ReactChild = nextChildren[i];
            if (React.isValidElement(child) && componentTypeEqual(RxcIf, child)) {
                const { is } = child.props as IRxcIfProps;
                if (RxcIf.showControl(is)) {
                    return { showIndex: i };
                }
            }
        }
        return { showIndex: -1 }
    }
    public state: IRxcSwitchState = {
        showIndex: -1
    }
    public shouldComponentUpdate(nextProps: IRxcSwitchProps) {
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
    public render() {
        console.log('***********************************rerender');
        const { children } = this.props;
        return <>{RxcSwitch.getShowChildren(children, this.state.showIndex)}</>;
    }
}