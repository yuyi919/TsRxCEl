import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Icon } from '../index';

export interface IMenuItemConfig {
    icon?: any;
    title: string;
    children?: Array<IMenuItemConfig>;
    collapse?: boolean;
    select?: boolean;
}

export interface ITreeMenuItemProps extends ListItemProps {
    menuIndex: number | string;
    icon?: React.ReactNode | any;
    collapse?: boolean;
}

export const TreeMenuItem = observer(({ menuIndex, icon, title, children, className, selected = true, ...other }: ITreeMenuItemProps) => {
    const Icon2 = Icon[icon]
    return (
        <ListItem button={true} className={className} selected={selected} dense={true} {...other}>
            {Icon2 && <ListItemIcon><Icon2 /></ListItemIcon>}
            <ListItemText inset={true} primary={title} />
            {children}
        </ListItem>
    )
})
