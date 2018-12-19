import equal from 'fast-deep-equal';
import * as React from 'react';

export interface IRxcForProps {
    children?: React.ReactElement<any>;
    objArr?: Array<object>;
    component?: React.ComponentFactory<any, any>;
    keyField?: string;
}
export class RxcFor extends React.Component<IRxcForProps> {
    public shouldComponentUpdate(nextProps: IRxcForProps): boolean {
        const { objArr: list, component, keyField: key, ...props } = this.props;
        const { objArr: nextList, component: nextComponent, keyField: nextKey, ...next } = nextProps;
        if (!(nextList instanceof Array) || !(list instanceof Array) || nextComponent != component) {
            return true;
        } else if (nextList.length - list.length != 0 || key != nextKey) {
            return true;
        } else if (!equal(nextList, list)) {
            return true;
        }
        return equal(next, props)!;
    }
    public render() {
        const { children, objArr = [{}], component, keyField } = this.props;
        if (component) {
            const Component = component;
            return <>{objArr.map((props: any, index: number) => (<Component key={keyField ? objArr[keyField] : index} {...props} />))}</>;
        } else if (React.isValidElement(children)) {
            return <>{objArr.map((props: any, index: number) => React.cloneElement(children, { ...props, key: index }))}</>;
        } else {
            return <></>;
        }
    }
}