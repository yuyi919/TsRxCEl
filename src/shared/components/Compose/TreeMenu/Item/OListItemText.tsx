import ListItemText, { ListItemTextProps } from '@material-ui/core/ListItemText';
import { observer } from 'mobx-react';
import * as React from 'react';
import { IOItemProps } from './interface';

export const CListItemText = ({ title, ...other }: ListItemTextProps) => {
    // console.log("text update")
    return <ListItemText primary={title} {...other} />;
};

export const OListItemText = observer(({ store, item, classes }: IOItemProps) => {
    // console.log("text update")
    if (item != null) {
        return <CListItemText inset={true} title={item.title} className={classes["nested" + (store.level + 1)]} />;
    }
    return null;
});