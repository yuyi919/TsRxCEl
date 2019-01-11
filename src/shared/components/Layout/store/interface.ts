import { StandardProps } from '@material-ui/core';
import { StyledComponentProps } from '@material-ui/core/styles';
import { IReactComponent } from 'mobx-react';
import { IMainFrameStoreInjectProps, IMainFrameStoreProps } from '../store';

/**
 * @type T props
 * @type ClassKey string
 */
export type OStyledProps<T, ClassKey extends string = string> = StandardProps<IMainFrameStoreProps & StyledComponentProps & T, ClassKey>;
export type OComponent<T> = IReactComponent<OStyledProps<T>>
export type Adapter = IMainFrameStoreInjectProps;