import { ListProps } from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import { IReactComponent, observer } from 'mobx-react';
import * as React from 'react';
import { IMenuItemConfig, ITreeMenuContainerProps } from '.';
import { OTreeMenuItem } from "./Item";
import { OAutoMenuList, OList } from './List';
import { styles } from './styles';
import { TreeMenuStore } from "./TreeMenuStore";


export interface IOTreeListProps extends ListProps {
    sheader?: string;
    data?: Array<IMenuItemConfig>;
    store: TreeMenuStore;
}

/**
 * 
 * @param container 
 */
export const TreeMenuFactory = (container: IReactComponent<ITreeMenuContainerProps>) => {
    const InnerContainer: IReactComponent<ITreeMenuContainerProps> = observer(container);
    const CTreeMenu = observer(class OTreeItemList extends React.Component<IOTreeListProps, any> {
        public getItem = (item: IMenuItemConfig, index: number): JSX.Element => {
            const { classes = {}, store } = this.props;
            item.index = index;
            const nextStore = store.getChildrenStore(index)
            return (
                <React.Fragment key={index} >
                    <OTreeMenuItem item={item} index={index} store={store} />
                    {
                        nextStore && 
                            <InnerContainer index={index} store={store}>
                                <CTreeMenu store={nextStore} classes={classes} />
                            </InnerContainer>
                    }
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