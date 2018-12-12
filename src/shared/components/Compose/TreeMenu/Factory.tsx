import { ListProps } from '@material-ui/core/List';
import { IReactComponent, observer } from 'mobx-react';
import * as React from 'react';
import { IMenuItemConfig, ITreeMenuContainerProps } from '.';
import { OTreeMenuItem } from "./Item";
import { OAutoMenuList, OList } from './List';
import withStyle from './styles';
import { ITreeMenuStore } from "./TreeMenuStore";


export interface IOTreeListProps extends ListProps {
    sheader?: string;
    data?: Array<IMenuItemConfig>;
    store: ITreeMenuStore;
}

/**
 * 
 * @param container 
 */
export const TreeMenuFactory = (container: IReactComponent<ITreeMenuContainerProps>) => {
    const InnerContainer: IReactComponent<ITreeMenuContainerProps> = observer(container);
    const getItemFactory = (props: IOTreeListProps) => {
        return (item: IMenuItemConfig, index: number): JSX.Element => {
            const { classes = {}, store } = props;
            item.index = index;
            const nextStore = store.getChildrenStore(index)
            return (
                <React.Fragment key={index} >
                    <OTreeMenuItem item={item} index={index} store={store} classes={classes}/>
                    {
                        nextStore && 
                            <InnerContainer index={index} store={store}>
                                <CTreeMenu store={nextStore} classes={classes} />
                            </InnerContainer>
                    }
                </React.Fragment>
            );
        }
    }
    const CTreeMenu = observer(class OTreeItemList extends React.Component<IOTreeListProps, any> {
        public render() {
            const { classes = {}, sheader, store, ...other } = this.props;
            return (
                <OList className={classes.root} sheader={sheader} {...other}>
                    <OAutoMenuList store={store} itemFactory={getItemFactory(this.props)} />
                </OList>
            )
        }
    })
    return withStyle(CTreeMenu) as any
}