// import { withStyles } from '@material-ui/core';
import { inject, IReactComponent, observer } from 'mobx-react';
import * as React from 'react';
import { MainFrameStore } from './index';


export const MainFrameStorePropName = "mainFrameStore";

export interface IMainFrameStoreProps {
    [MainFrameStorePropName]?: MainFrameStore;
}

export interface IMainFrameStoreInjectProps {
    [MainFrameStorePropName]: MainFrameStore;
}

export function OMainFrameComponentFactory(component: IReactComponent<IMainFrameStoreProps>): IReactComponent<IMainFrameStoreInjectProps> {
    const InnerComponent = component;
    const OutComponent = ({ mainFrameStore, ...other }: IMainFrameStoreProps) => {
        if (mainFrameStore) {
            return <InnerComponent mainFrameStore={mainFrameStore} {...other} />;
        }
        return null;
    };
    return inject(MainFrameStorePropName, "classes")(observer(OutComponent)) as IReactComponent<IMainFrameStoreInjectProps>;
}

// export default {
//     MainFrameStorePropName as propName,
//     IMainFrameStoreProps as Props,
//     IMainFrameStoreInjectProps as PnjectProps,
//     OMainFrameComponentFactory as OFactory
// };