import MenuIcon from '@material-ui/icons/Menu';
import classNames from 'classnames';
import * as React from 'react';
import * as Lite from 'src/shared/components/Lite';
import { Adapter, OComponent, OMainFrameComponentFactory, OStyledProps } from '../store';

// import withStyle from './styles';

export type ClassKey = 'appBarShift' | 'appBar';
export const OTopBar: OComponent<Lite.ITopBarProps> = OMainFrameComponentFactory(
    ({ classes = {}, children, mainFrameStore, className, ...other }: OStyledProps<Lite.ITopBarProps, ClassKey> & Adapter) => {
        return (
            <Lite.TopBar
                title={mainFrameStore.title}
                position='absolute'
                icon={<MenuIcon />}
                onIconClick={mainFrameStore.toggle}
                className={classNames(classes.appBar, mainFrameStore.open && classes.appBarShift, className)}
                {...other}
            >
                {children}
            </Lite.TopBar>
        );
    }
);

export default OTopBar;