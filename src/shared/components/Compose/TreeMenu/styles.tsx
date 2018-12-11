import { Theme } from '@material-ui/core/styles';
export const styles = (theme: Theme) => {
    return {
        root: {
            width: '100%',
            maxWidth: 500,
            backgroundColor: theme.palette.background.paper,
        },
        nested1: {
            paddingLeft: theme.spacing.unit * 2,
            fontSize: 20
        },
        nested2: {
            paddingLeft: theme.spacing.unit * 2.5,
            fontSize: 15
        },
        nested3: {
            paddingLeft: theme.spacing.unit * 3,
            fontSize: 12
        },
        nested4: {
            paddingLeft: theme.spacing.unit * 3.5,
            fontSize: 10
        },
    };
};