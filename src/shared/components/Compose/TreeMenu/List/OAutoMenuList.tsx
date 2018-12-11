import { observer } from 'mobx-react';
import * as React from 'react';
import { IMenuItemConfig } from '..';
import { IFactoryListProps, OFactoryList } from '../../FactoryList';
import { ITreeMenuStore } from "../TreeMenuStore";

export const OAutoMenuList = observer(({ store, itemFactory, ...other }: IOAutoMenuList) => {
    console.log("menu update")
    return <OFactoryList<IMenuItemConfig> data={store.getDataList()} itemFactory={itemFactory} {...other} />;
});

/**
 * 
 */
export interface IOAutoMenuList extends IFactoryListProps<IMenuItemConfig> {
    /**
     * TreeMenuStore
     */
    store: ITreeMenuStore;
}