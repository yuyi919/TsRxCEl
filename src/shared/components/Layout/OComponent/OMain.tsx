import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { OMainFrameComponentFactory } from '../store';
import { Adapter, OComponent, OStypedStoreProps } from './interface';

export const OMainPanel: OComponent<any> = OMainFrameComponentFactory(({ classes, mainFrameStore, children, ...other }: OStypedStoreProps<any> & Adapter) => {
    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Typography noWrap={true}>
                <span dangerouslySetInnerHTML={{ __html: mainFrameStore.content.join("<br/>") }} />
                {children}
            </Typography>
        </main>
    );
});