import { observer } from 'mobx-react';
import * as React from 'react';
import { IMenuItemConfig } from '..';
import { IAutoListProps, OAutoList } from '../../AutoList';
import { TreeMenuStore } from "../TreeMenuStore";

export const OAutoMenuList = observer(({ store, itemFactory, ...other }: IOAutoMenuList) => {
    console.log("menu update")
    return <OAutoList<IMenuItemConfig> data={store.data} itemFactory={itemFactory} {...other} />;
});

/**
 * 
 */
export interface IOAutoMenuList extends IAutoListProps<IMenuItemConfig> {
    /**
     * TreeMenuStore
     */
    store: TreeMenuStore;
}