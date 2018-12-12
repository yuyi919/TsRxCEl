import { Theme, withStyles } from '@material-ui/core/styles';
import { styles as itemStyle} from './Item/styles';
export const styles = (theme: Theme) => {
    return {
        root: {
            width: '100%',
            maxWidth: 500,
            backgroundColor: theme.palette.background.paper,
        },
        ...itemStyle(theme)
    };
};
const withStyle = withStyles(styles);
export default withStyle;