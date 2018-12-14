import { SvgIconProps } from '@material-ui/core/SvgIcon';
import * as Icon from '@material-ui/icons';

export const getIcon = (iconName: string): React.ComponentType<SvgIconProps> => {
    return ICON[iconName];
        // (window as any).require('@material-ui/icons/'+iconName);
}
export const ICON = Icon;