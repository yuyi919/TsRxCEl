import ListItemIcon from '@material-ui/core/ListItemIcon';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ICON } from 'src/shared/components/Lite';
import { IOItemProps } from './interface';

export const ItemIcon = ({ icon, ...other }: IOItemIconProps) => {
    // console.log("icon update")
    if (icon && ICON[icon]) {
        const Icon = ICON[icon];
        return <ListItemIcon {...other}><Icon /></ListItemIcon>;
    }
    else {
        return null;
    }
};

export interface IOItemIconProps {
    icon?: any;
}

export const OItemIcon = observer(({ item }: IOItemProps) => {
    // console.log("icon update")
    if(item != null){
        const icon = item.icon || (item.children ? "LibraryBooks" : "Book")
        return <ItemIcon icon={icon} />
    }
    return null;
});



export const OCollapseIcon = observer(({ store, item, index }: IOItemProps) => {
    if (item != null && item.children != null) {
        console.log("CollapseIcon update")
        return store.isCollapse(index) ? <ICON.ExpandLess /> : <ICON.ExpandMore />;
    }
    return null;
});