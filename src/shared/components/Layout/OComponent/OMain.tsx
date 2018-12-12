import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { Adapter, OComponent, OMainFrameComponentFactory, OStyledProps } from '../store';

export const OMainPanel: OComponent<any> = OMainFrameComponentFactory(({ classes, mainFrameStore, children, ...other }: OStyledProps<any> & Adapter) => {
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