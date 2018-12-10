import List, { ListProps } from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Theme, withStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ICON } from '../../Lite';
import { IAutoListProps, OAutoList } from '../AutoList';
import { IMenuItemConfig, TreeMenuStore } from './interface';
import { OTreeMenuItem } from './Item';

export interface ITreeMenuProps extends ListProps {
    sheader?: string;
    data?: Array<IMenuItemConfig>;
}
export interface IOTreeItemListProps extends ITreeMenuProps {
    store: TreeMenuStore;
}

const styles = (theme: Theme) => {
    return {
        root: {
            width: '100%',
            maxWidth: 500,
            backgroundColor: theme.palette.background.paper,
        },
        nested1: {
            paddingLeft: theme.spacing.unit * 2,
            fontSize: 20
        },
        nested2: {
            paddingLeft: theme.spacing.unit * 2.5,
            fontSize: 15
        },
        nested3: {
            paddingLeft: theme.spacing.unit * 3,
            fontSize: 12
        },
        nested4: {
            paddingLeft: theme.spacing.unit * 3.5,
            fontSize: 10
        },
    }
};

export const TreeMenuItemCollapseIcon = observer(({ store, index }: { store: TreeMenuStore, index: number }) => {
    if (store.hasChildren(index, (config: IMenuItemConfig) => config.children != null)) {
        return store.isCollapse(index) ? <ICON.ExpandLess /> : <ICON.ExpandMore />
    }
    return null;
})

export interface IOListProps extends ListProps {
    sheader?: string;
}
export const OList = observer(({ sheader, children, ...other }: IOListProps) => {
    return (
        <List component="nav" subheader={sheader ? <ListSubheader component="h1">{sheader}</ListSubheader> : undefined} {...other}>
            {children}
        </List>
    )
})
export interface IOAutoMenuList extends IAutoListProps {
    store: TreeMenuStore;
}
export const OAutoMenuList = observer(({ store, itemFactory, ...other }: IOAutoMenuList) => {
    return <OAutoList data={store.data} itemFactory={itemFactory} {...other} />
})

export const TreeMenuFactory = (container: any) => {
    const InnerContainer = observer(container);
    const CTreeMenu = observer(class OTreeItemList extends React.Component<IOTreeItemListProps, any> {
        
        public getChildrenStore = (index: number): TreeMenuStore | null => {
            const { store } = this.props;
            if (!store.childrenStore[index]) {
                const { level = 0, parentIndexList = [], ...other } = store.config;
                const children = store.getItem(index).children;
                if (children && children.length > 0) {
                    const nextConfig = {
                        ...other,
                        level: level + 1,
                        parentIndexList: [...parentIndexList, index]
                    }
                    store.childrenStore[index] = new TreeMenuStore(store.getItem(index).children, nextConfig);
                }
            }
            return store.childrenStore[index];
        }
        public getItem = (itemData: IMenuItemConfig, index: number) => {
            const { classes = {}, store } = this.props;
            const { onItemClick, level = 0, parentIndexList = [] } = store.config;
            const clickHandler = (e: React.MouseEvent) => onItemClick(index, store, [...parentIndexList, index], e)
            const nextStore = this.getChildrenStore(index)
            return (
                <React.Fragment key={index} >
                    <OTreeMenuItem
                        index={index}
                        store={store}
                        className={classes["nested" + (level + 1)]!}
                        onClick={clickHandler}
                    >
                        <TreeMenuItemCollapseIcon index={index} store={store} />
                    </OTreeMenuItem>

                    {nextStore && <InnerContainer index={index} store={store}><CTreeMenu store={nextStore} classes={classes} /></InnerContainer>}

                </React.Fragment>
            );
        }
        public render() {
            const { classes = {}, sheader, store, ...other } = this.props;
            return (
                <OList className={classes.root} sheader={sheader} {...other}>
                    <OAutoMenuList store={store} itemFactory={this.getItem} />
                </OList>
            )
        }
    })
    return withStyles(styles)(CTreeMenu) as any
}