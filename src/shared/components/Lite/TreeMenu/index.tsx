import Collapse from '@material-ui/core/Collapse';
import * as React from 'react';
import { TreeMenuFactory } from './Factory';

@TreeMenuFactory
export class CollapseMenu extends React.Component<any> {
    public render() {
        const { itemData, children, ...other } = this.props;
        if (!itemData.children) {
            return null
        }
        return (
            <Collapse in={itemData.collapse} timeout="auto" unmountOnExit={itemData.children.length < 20} {...other}>
                {children}
            </Collapse>
        );
    }
}

export * from './Item';
export * from './Factory';