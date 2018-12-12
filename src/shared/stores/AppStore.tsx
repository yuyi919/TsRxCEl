import { observable } from "mobx";
import Store, { MainFrameStore } from "src/shared/components/Layout/store/MainFrameStore";
import { OFactoryCreater } from 'src/shared/utils/OFactoryCreater';

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


export const AppChildContainer = OFactoryCreater<IAppStoreProps, IAppStoreInjectProps>(AppStorePropsName);

export { AppStore };

