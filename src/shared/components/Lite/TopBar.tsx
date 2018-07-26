import { IconButton, PropTypes, Toolbar, Typography } from '@material-ui/core';
import AppBar, { AppBarProps } from '@material-ui/core/AppBar'
import * as React from 'react';

interface ITopBarProps extends AppBarProps {
    title?: string | React.ReactNode | any;
    icon?: React.ReactNode | any;
    color?: PropTypes.Color;
    children?: React.ReactNode | React.ReactNodeArray;
}

export const TopBar: React.SFC<ITopBarProps> = ({ position = 'static', color = 'default', icon, title, children, ...other }: ITopBarProps) => {
    const styles = {
        grow: {
            flexGrow: 1,
        },
        menuButton: {
            marginLeft: -12,
            marginRight: 20,
        },
    };
    return (
        <AppBar color={color} position={position} style={styles.grow} {...other}>
            <Toolbar>
                {icon && <IconButton color="inherit" style={styles.menuButton}>{icon}</IconButton>}
                <Typography variant='title' style={styles.grow}>{title}</Typography>
                {children}
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;