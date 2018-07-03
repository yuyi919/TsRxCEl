import { withTheme } from '@material-ui/core';
import Button, { ButtonProps } from "@material-ui/core/Button";
import * as Svg from '@material-ui/core/SvgIcon';
import * as Icon from '@material-ui/icons';
import * as React from 'react';
import { Link } from 'react-router-dom';
export { Icon };

export interface ILiteButtonProps extends ButtonProps {
    type: 'text' | 'flat' | 'outlined' | 'contained' | 'raised' | 'fab' | 'extendedFab';
    routerLink?: string;
    text?: string;
    icon?: React.ComponentType<Svg.SvgIconProps>;
    leftIcon?: React.ComponentType<Svg.SvgIconProps>;
    rightIcon?: React.ComponentType<Svg.SvgIconProps>;
}

/**
 * @param routerLink 导航链接
 * @param type 按钮类型 
 * @param color 颜色样式
 * @param size 尺寸
 * @param fullWidth If true, the button will take up the full width of its container.
 */
export const LiteButton: React.ComponentClass<ILiteButtonProps> = withTheme()(({
    icon,leftIcon,rightIcon,text,
    type = 'contained', color = 'default',
    routerLink, children, 
    component,...other
}: ILiteButtonProps) => {
    const LiteLink = (props: any)=> <Link to={routerLink} {...props} />
    return (
        <Button variant={type} component={LiteLink} color={color} {...other}>
            {icon || leftIcon}
            {text}
            {children || ''}
            {rightIcon}
        </Button>
    );
});

export default LiteButton;
