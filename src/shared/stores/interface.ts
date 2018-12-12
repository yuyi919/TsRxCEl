import { StyledComponentProps } from '@material-ui/core/styles';
import { IReactComponent } from 'mobx-react';
import { IAppStoreInjectProps, IAppStoreProps } from './AppStore';

export namespace AppStores {
    export type OStyledProps<T = React.Props<any>> = IAppStoreProps & StyledComponentProps & T;
    export type OComponent<T = React.Props<any>> = IReactComponent<OStyledProps<T>>
    export type Adapter = IAppStoreInjectProps;
}