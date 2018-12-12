// import { withStyles } from '@material-ui/core';
import { OFactoryCreater } from 'src/shared/utils/OFactoryCreater';
import { MainFrameStore } from './index';


export const MainFrameStorePropName = "mainFrameStore";

export interface IMainFrameStoreProps {
    [MainFrameStorePropName]?: MainFrameStore;
}

export interface IMainFrameStoreInjectProps {
    [MainFrameStorePropName]: MainFrameStore;
}

export const OMainFrameComponentFactory = OFactoryCreater<IMainFrameStoreProps, IMainFrameStoreInjectProps>(MainFrameStorePropName, 'classes');

