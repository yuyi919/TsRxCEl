import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText, { ListItemTextProps } from '@material-ui/core/ListItemText';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ICON } from '../../Lite';
import { IMenuItemConfig, ITreeMenuConfig, TreeMenuStore } from './interface';



export interface ITreeMenuItemProps extends ListItemProps {
    icon?: React.ReactNode | any;
    collapse?: boolean;
}


export interface IOItemIconProps {
    icon?: any;
}
export const OItemIcon = observer(({ icon, ...other }: IOItemIconProps) => {
    // console.log("icon update")
    if (icon && ICON[icon]) {
        const ItemIcon = ICON[icon]
        return <ListItemIcon {...other}><ItemIcon /></ListItemIcon>;
    } else {
        return null;
    }
})

export const OListItemText = observer(({ title, ...other }: ListItemTextProps) => {
    // console.log("text update")
    return <ListItemText primary={title} {...other} />
})

export const OListItem = observer(({ children, ...other }: ITreeMenuItemProps) => {
    // console.log("item update")
    return (
        <ListItem button={true} dense={true} {...other}>
            {children}
        </ListItem>
    )
})
// @observer
// export class OListItem extends React.PureComponent<ITreeMenuItemProps> {
//     public render() {
//         const { children, ...other } = this.props;
//         return (
//             <ListItem button={true} dense={true} {...other}>
//                 {children}
//             </ListItem>
//         )
//     }
// }


export const transformFunc = (index: number, config: IMenuItemConfig, store: TreeMenuStore) => {
    const { icon, children, ...other } = config;
    return {
        ...other,
        icon: icon || (children ? "LibraryBooks" : "Book")
    }
}
export interface IOTreeMenuItemProps extends ListItemProps {
    index: number;
    store: TreeMenuStore;
}
// export const OTreeMenuItem = observer(({ index, store, children, ...other }: IOTreeMenuItemProps) => {
//     const item = store.getItem(index, transformFunc)
//     console.log(item)
//     return (
//         <OListItem {...other} selected={item.selected}>
//             <OItemIcon icon={item.icon} />
//             <OListItemText inset={true} primary={item.title} />
//             {children}
//         </OListItem>
//     )
// })
@observer
export class OTreeMenuItem extends React.Component<IOTreeMenuItemProps> {
    public render() {
        const { index, store, children, ...other } = this.props;
        const item = store.getItem(index, transformFunc)
        // console.log(item)
        return (
            <OListItem {...other} selected={store.selectedIndex==index}>
                <OItemIcon icon={item.icon} />
                <OListItemText inset={true} primary={item.title} />
                {children}
            </OListItem>
        )
    }
}