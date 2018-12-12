import MenuIcon from '@material-ui/icons/Menu';
import classNames from 'classnames';
import * as React from 'react';
import * as Lite from 'src/shared/components/Lite';
import { OMainFrameComponentFactory } from '../store';
import { Adapter, OComponent, OStypedStoreProps } from './interface';

// import withStyle from './styles';

export const OTopBar:OComponent<Lite.ITopBarProps> = OMainFrameComponentFactory(
    ({ classes = {}, children, mainFrameStore, className, ...other }: OStypedStoreProps<Lite.ITopBarProps> & Adapter) => {
        console.log(mainFrameStore.title)
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