import { ListItemProps } from '@material-ui/core/ListItem';
import { observer } from 'mobx-react';
import * as React from 'react';
// import { IMenuItemConfig } from '.';
import { TreeMenuStore } from "../TreeMenuStore";
import { OCollapseIcon, OItemIcon } from './OItemIcon';
import { OListItem } from './OListItem';
import { OListItemText } from './OListItemText';

@observer
export class OTreeMenuItem extends React.Component<IOTreeMenuItemProps> {
    public render() {
        const { index, store, children, ...other } = this.props;
        // console.log(item)
        return (
            <OListItem store={store} index={index} {...other}>
                <OItemIcon store={store} index={index}/>
                <OListItemText store={store} index={index}/>
                <OCollapseIcon index={index} store={store} />
            </OListItem>
        );
    }
}
// /**
//  * 翻译器
//  * @param index 数据索引
//  * @param config 配置
//  * @param store
//  */
// export const transformFunc = (index: number, config: IMenuItemConfig, store: TreeMenuStore) => {
//     const { icon, children } = config;
//     return Object.assign(config, {
//         icon: icon || (children ? "LibraryBooks" : "Book")
//     });
// };
export interface IOTreeMenuItemProps extends ListItemProps {
    index: number;
    store: TreeMenuStore;
}