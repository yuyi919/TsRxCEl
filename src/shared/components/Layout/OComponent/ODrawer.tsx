import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import classNames from 'classnames';
import * as React from 'react';
import * as Compose from 'src/shared/components/Compose';
// import * as Lite from 'src/shared/components/Lite';
import { OMainFrameComponentFactory } from '../store';
import { Adapter, OComponent, OStypedStoreProps } from './interface';


export const ODrawer: OComponent<DrawerProps> = OMainFrameComponentFactory(
    ({ classes = {}, mainFrameStore, children, ...other }: OStypedStoreProps<DrawerProps> & Adapter) => {
        return (
            <Drawer variant="permanent" classes={{ paper: classNames(classes.drawerPaper, !mainFrameStore.open && classes.drawerPaperClose) }} anchor="left" {...other}>
                {children}
                <Compose.CollapseTreeMenu store={mainFrameStore.menuList} />
            </Drawer>
        );
    }
);