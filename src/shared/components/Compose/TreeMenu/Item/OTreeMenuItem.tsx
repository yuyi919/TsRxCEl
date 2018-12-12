import { ListItemProps } from '@material-ui/core/ListItem';
import { observer } from 'mobx-react';
import * as React from 'react';
import {  IOItemProps } from './interface';
import { OCollapseIcon, OItemIcon } from './OItemIcon';
import { OListItem } from './OListItem';
import { OListItemText } from './OListItemText';

export type IOTreeMenuItemProps = ListItemProps & IOItemProps;
export const OTreeMenuItem = observer(({ children, ...other }: IOTreeMenuItemProps)=> (
    <OListItem {...other}>
        <OItemIcon {...other}/>
        <OListItemText {...other} />
        { children }
        <OCollapseIcon {...other} />
    </OListItem>
));