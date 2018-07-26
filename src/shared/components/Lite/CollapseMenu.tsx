import Collapse from '@material-ui/core/Collapse';
import List, { ListProps } from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Theme, withStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import * as React from 'react';
import { AutoList } from './AutoList';
import { Icon } from './index';

export interface IMenuItemConfig {
    icon?: any;
    title: string;
    children?: Array<IMenuItemConfig>;
    collapse?: boolean;
    select?: boolean;
}
export interface ITreeMenuProps extends ListProps {
    sheader?: string;
    data: Array<IMenuItemConfig>;
    onItemClick: (e: IMenuItemConfig, parentIndexList: Array<number>, nativeEvent: React.MouseEvent) => void;
    level?: number;
    parentIndexList?: Array<number>;
}

export interface ITreeMenuItemProps extends ListItemProps {
    menuIndex: number | string;
    icon?: React.ReactNode | any;
    collapse?: boolean;
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


export const TreeMenuItem = observer(({ menuIndex, icon, title, children, className, selected = true, ...other }: ITreeMenuItemProps) => {
    const Icon2 = Icon[icon]
    // const clickEvent = (e: any) => {
    //     if (onItemClick) {
    //         onItemClick(menuIndex as any, e)
    //     }
    // }
    return (
        <ListItem button={true} className={className} selected={selected} dense={true} {...other}>
            {Icon2 && <ListItemIcon><Icon2 /></ListItemIcon>}
            <ListItemText inset={true} primary={title} />
            {children}
        </ListItem>
    )
})

@observer
class CMenuItemList extends React.Component<ITreeMenuProps> {
    public componentDidUpdate(nextProps: ITreeMenuProps) {
        console.log(this.props.data == nextProps.data)
    }
    public render() {
        const { data, classes = {}, sheader, onItemClick, level = 0, parentIndexList = [] } = this.props;
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
                    >
                        {itemData.children && (itemData.collapse ? <Icon.ExpandLess /> : <Icon.ExpandMore />)}
                    </TreeMenuItem>
                    {itemData.children && <Collapse in={itemData.collapse} timeout="auto" unmountOnExit={itemData.children.length < 20}>
                        <CollapseMenu data={itemData.children} onItemClick={onItemClick} level={level + 1} parentIndexList={[...parentIndexList, index]} />
                    </Collapse>}
                </React.Fragment>
            );
        }
        return (
            <List className={classes.root} component="nav" subheader={sheader ? <ListSubheader component="h1">{sheader}</ListSubheader> : undefined}>
                <AutoList data={data} itemFactory={getItem} />
            </List>
        )
    }
}

export const CollapseMenu = withStyles(styles)(CMenuItemList)