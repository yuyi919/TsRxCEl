import Collapse, { CollapseProps } from '@material-ui/core/Collapse';
import * as React from 'react';
import { TreeMenuStore } from '../index';
import { TreeMenuFactory } from './Factory';

@TreeMenuFactory
export class CollapseMenu extends React.Component<{ index: number; store: TreeMenuStore } & CollapseProps> {
    public render() {
        const { store, index, children, ...other } = this.props;
        const item = store.getItem(index)
        if (item && item.children != null) {
            // console.log(index, store, item)
            return (
                <Collapse in={store.collapseIndex == index} timeout="auto" unmountOnExit={item.children.length < 20} {...other}>
                    {children}
                </Collapse>
            );
        }
        return null
    }
}

export * from './Factory';
export * from './interface';
export * from './Item';
export * from './store';
