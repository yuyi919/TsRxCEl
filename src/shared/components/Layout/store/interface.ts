import { StyledComponentProps } from '@material-ui/core/styles';
import { IReactComponent } from 'mobx-react';
import { IMainFrameStoreInjectProps, IMainFrameStoreProps } from '../store';


export type OStyledProps<T = React.SFC> = IMainFrameStoreProps & StyledComponentProps & T;
export type OComponent<T = React.SFC> = IReactComponent<OStyledProps<T>>
export type Adapter = IMainFrameStoreInjectProps;