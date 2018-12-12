import { observable } from "mobx";
import { inject, IReactComponent, observer } from "mobx-react";
import * as React from 'react';
import Store, { MainFrameStore } from "src/shared/components/Layout/store/MainFrameStore";

export const AppStorePropsName = "appStore";
export interface IAppStoreProps {
    [AppStorePropsName]?: AppStore;

}
export interface IAppStoreInjectProps {
    [AppStorePropsName]: AppStore;
}
class AppStore {
  //
  // Following the MobX best practices documentation,
  // https://mobx.js.org/best/store.html use a root store
  // to provide support breaking the application state into
  // multiple child stores
  //
  @observable
  public mainFrameStore: MainFrameStore = Store;
}

/**
 * 
 * @param component 
 */
export function AppChildContainer(component: IReactComponent<IAppStoreProps>): IReactComponent<IAppStoreInjectProps> {
    const InnerComponent = component;
    const OutComponent = ({appStore, ...other}: IAppStoreProps) => {
        if(appStore){
            return <InnerComponent appStore={appStore} {...other}/>
        } 
        return null;
    };
    return (inject(AppStorePropsName)(observer(OutComponent)) as IReactComponent<IAppStoreInjectProps>);
}

export { AppStore };

