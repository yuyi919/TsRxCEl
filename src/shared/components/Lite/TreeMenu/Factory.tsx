import List, { ListProps } from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Theme, withStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import * as React from 'react';
import { AutoList } from '../AutoList';
import { Icon } from '../index';
import { IMenuItemConfig, TreeMenuItem } from './Item';

export interface ITreeMenuProps extends ListProps {
    sheader?: string;
    data?: Array<IMenuItemConfig>;
    onItemClick: (e: IMenuItemConfig, parentIndexList: Array<number>, nativeEvent: React.MouseEvent) => void;
    level?: number;
    parentIndexList?: Array<number>;
}
const styles = (theme: Theme) => {
    return {
        root: {
            width: '100%',
            maxWidth: 500,
            backgroundColor: theme.palette.background.paper,
        },
        nested1: {
            paddingLeft: theme.spacing.unit * 1,
            fontSize: 20
        },
        nested2: {
            paddingLeft: theme.spacing.unit * 2,
            fontSize: 15
        },
        nested3: {
            paddingLeft: theme.spacing.unit * 3,
            fontSize: 12
        },
        nested4: {
            paddingLeft: theme.spacing.unit * 4,
            fontSize: 10
        },
    }
};

export const TreeMenuFactory = (container: any) => {
    const InnerContainer = observer(container)
    const CTreeMenu = observer(class CMenuItemList extends React.Component<ITreeMenuProps> {
        public render() {
            const { data, classes = {}, sheader, onItemClick, level = 0, parentIndexList = [], ...other } = this.props;
            const getItem = (itemData: IMenuItemConfig, index: number) => {
                const clickHandler = (e: React.MouseEvent) => onItemClick(itemData, [...parentIndexList, index], e)
                return (
                    <React.Fragment key={index} >
                        <TreeMenuItem
                            menuIndex={index}
                            icon={itemData.icon || (itemData.children ? "LibraryBooks" : "Book")}
                            className={classes["nested" + (level + 1)]!}
                            title={itemData.title}
                            onClick={clickHandler}
                            {...other}
                        >
                            {itemData.children && (itemData.collapse ? <Icon.ExpandLess /> : <Icon.ExpandMore />)}
                        </TreeMenuItem>
                        <InnerContainer itemData={itemData}>
                            <CTreeMenu data={itemData.children} onItemClick={onItemClick} level={level + 1} parentIndexList={[...parentIndexList, index]} />
                        </InnerContainer>
                    </React.Fragment>
                );
            }
            return (
                <List className={classes.root} component="nav" subheader={sheader ? <ListSubheader component="h1">{sheader}</ListSubheader> : undefined} {...other}>
                    <AutoList data={data} itemFactory={getItem} />
                </List>
            )
        }
    })
    return withStyles(styles)(CTreeMenu) as any
}