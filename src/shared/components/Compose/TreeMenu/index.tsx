import Collapse, { CollapseProps } from '@material-ui/core/Collapse';
import * as React from 'react';
import { TreeMenuFactory } from './Factory';
import { ITreeMenuContainerProps } from './interface';

// export class CollapsePoint extends React.Component<ITreeMenuContainerProps & CollapseProps> {
//     public render() {
//         const { store, index = 0, children, ...other } = this.props;
//         const item = store.getDataItem(index)
//         if (item && item.children != null) {
//             // console.log(index, store, item)
//             return (
//                 <Collapse in={store.isCollapse(index)} timeout="auto" unmountOnExit={item.children.length < 20} {...other}>
//                     {children}
//                 </Collapse>
//             );
//         }
//         return null
//     }
// }
const CollapsePoint = ({store, index = 0, children, ...other}: ICollapseTreeMenuProps) => {
    const item = store.getDataItem(index)
    if (item && item.children != null) {
        // console.log(index, store, item)
        return (
            <Collapse in={store.isCollapse(index)} timeout="auto" unmountOnExit={item.children.length < 20} {...other}>
                {children}
            </Collapse>
        );
    }
    return null
}

export const CollapseTreeMenu = TreeMenuFactory(CollapsePoint);
export type ICollapseTreeMenuProps = ITreeMenuContainerProps & CollapseProps

export * from './Factory';
export * from './interface';
export * from './Item';
export * from './List';
export * from './TreeMenuStore';