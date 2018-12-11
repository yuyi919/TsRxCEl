import { ListItemProps } from '@material-ui/core/ListItem';
import { observer } from 'mobx-react';
import * as React from 'react';
import {  IOItemProps } from './interface';
import { OCollapseIcon, OItemIcon } from './OItemIcon';
import { OListItem } from './OListItem';
import { OListItemText } from './OListItemText';

export type IOTreeMenuItemProps = ListItemProps & IOItemProps;
export const OTreeMenuItem = observer(({ index, item, store, children, ...other }: IOTreeMenuItemProps)=> (
    <OListItem item={item} store={store} index={index} {...other}>
        <OItemIcon item={item} store={store} index={index}/>
        <OListItemText item={item} store={store} index={index}/>
        <OCollapseIcon item={item} index={index} store={store} />
    </OListItem>
));
// @observer
// export class OTreeMenuItem extends React.Component<IOTreeMenuItemProps> {
//     public render() {
//         const { index, item, store, children, ...other } = this.props;
//         // console.log(item)
//         return (
//             <OListItem item={item} store={store} index={index} {...other}>
//                 <OItemIcon item={item} store={store} index={index}/>
//                 <OListItemText item={item} store={store} index={index}/>
//                 <OCollapseIcon item={item} index={index} store={store} />
//             </OListItem>
//         );
//     }
// }
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