import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import classNames from 'classnames';
import * as React from 'react';
import * as Compose from 'src/shared/components/Compose';
// import * as Lite from 'src/shared/components/Lite';
import { Adapter, OComponent, OMainFrameComponentFactory, OStyledProps } from '../store';


export const ODrawer: OComponent<DrawerProps> = OMainFrameComponentFactory(
    ({ classes = {}, className, mainFrameStore, children, ...other }: OStyledProps<DrawerProps> & Adapter) => {
        return (
            <Drawer variant="permanent" classes={{ paper: classNames(classes.drawerPaper, !mainFrameStore.open && classes.drawerPaperClose, className) }} anchor="left" {...other}>
                {children}
                <Compose.CollapseTreeMenu store={mainFrameStore.menuList} />
            </Drawer>
        );
    }
);