import { StyledComponentProps } from '@material-ui/core/styles';
import { IReactComponent } from 'mobx-react';
import { IMainFrameStoreInjectProps, IMainFrameStoreProps } from '../store';


export type OStypedStoreProps<T> = IMainFrameStoreProps & StyledComponentProps & T;
export type OComponent<T> = IReactComponent<OStypedStoreProps<T>>
export type Adapter = IMainFrameStoreInjectProps;