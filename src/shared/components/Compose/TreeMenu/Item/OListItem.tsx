import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import { IReactComponent, observer } from 'mobx-react';
import * as React from 'react';
import { IOItemProps } from './interface';

export const OListItemSelect = observer(({ store, item, index, children, ...other }: IOListItemSelectProps) => {
    console.log("item selected update")
    return (
        <ListItem selected={store.isCurrentIndex(index)} {...other}>
            {children}
        </ListItem>
    );
});
export interface IOListItemSelectProps extends ListItemProps, IOItemProps {
    icon?: React.ReactNode | any;
    collapse?: boolean;
}

export function OListItemFactory(InnerComponent: IReactComponent<IOItemProps>) {
    return observer(
        ({ store, item, index, ...other }: IOItemProps) => {
            return <InnerComponent store={store} item={item} index={index} {...other} />
        }
    ) as IReactComponent<IOItemProps>;
}

export const OListItem = observer(({ store, item, index, children, classes = {}, ...other }: IOItemProps) => {
    console.log("item update", classes, "nested" + (store.level + 1))
    const clickHandler = (e: React.MouseEvent) => store.onItemClick({ index, nativeEvent: e });
    return (
        <OListItemSelect button={true} dense={true}
            store={store}
            item={item}
            index={index}
            className={classes["nested" + (store.level + 1)]!}
            onClick={clickHandler}
            {...other}
        > {children} </OListItemSelect>
    );
});


// @observer
// export class OListItem extends React.PureComponent<IOListItemProps> {
//     public render() {
//         const { children, ...other } = this.props;
//         return (
//             <ListItem button={true} dense={true} {...other}>
//                 {children}
//             </ListItem>
//         )
//     }
// }