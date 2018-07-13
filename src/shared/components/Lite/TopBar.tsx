import { AppBar, IconButton, PropTypes, Toolbar, Typography } from '@material-ui/core';
import * as React from 'react';

interface ITopBarProps {
    title?: string | React.ReactNode | any;
    icon?: React.ReactNode | any;
    color?: PropTypes.Color;
    children?: React.ReactNode | React.ReactNodeArray;
}

export const TopBar: React.SFC<ITopBarProps> = ({color = 'default',icon,title,children}: ITopBarProps) => {
    return (
        <AppBar color={color} position='static'>
            <Toolbar>
                {icon && <IconButton color="inherit">{icon}</IconButton>}
                <Typography variant='title'>{title}</Typography>
                {children}
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;