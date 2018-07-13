import { Tooltip as ToolTopContainer } from '@material-ui/core';
import * as React from 'react';

export type Placement = 
| 'bottom-end'
| 'bottom-start'
| 'bottom'
| 'left-end'
| 'left-start'
| 'left'
| 'right-end'
| 'right-start'
| 'right'
| 'top-end'
| 'top-start'
| 'top';

export function Tooltip<P = any>(config: {
     title: string;
     placement?: Placement;
}) {
    return function (Target: React.ComponentClass<P> | React.ComponentType<P> | React.StatelessComponent<P> | React.SFC<P> | any): React.ComponentClass<P> | React.ComponentType<P> | React.StatelessComponent<P> | React.SFC<P> | any {
        
        return (({children, ...other}: P | any): any => {
            return (
                <ToolTopContainer title={config.title ||''} placement={config.placement || 'top'}>
                    <Target {...other}>{children}</Target>
                </ToolTopContainer>
            );
        }) as any;
    }
}