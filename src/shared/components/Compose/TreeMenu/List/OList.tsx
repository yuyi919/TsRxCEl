import List, { ListProps } from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { observer } from 'mobx-react';
import * as React from 'react';

export interface IOListProps extends ListProps {
    /**
     * 样式名
     */
    className?: string;
    /**
     * 小标题
     */
    sheader?: string;
}
export const OList = observer(({ sheader, children, ...other }: IOListProps) => {
    return (<List component="nav" subheader={sheader ? <ListSubheader component="h1">{sheader}</ListSubheader> : undefined} {...other}>
        {children}
    </List>);
});