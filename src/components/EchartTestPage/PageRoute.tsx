import * as H from 'history';
import * as React from 'react';
import { match, RouteComponentProps, RouteProps } from 'react-router';
import { Route } from "react-router-dom";

export interface IPageRouteProps<P> {
    computedMatch?: match<P>;
    localtion?: H.Location;
    children?: React.ReactNode | React.ReactNodeArray;
}

export type GetRoutes = React.StatelessComponent<RouteProps>;

export interface IPageRouteConfig {
    path: string;
    exact?: boolean;
    children?: Array<any>;
}
/**
 * 需要一个泛型参数<P>，为路由传递进组件的参数结构
 * @param config 结构参照IPageRouteConfig
 */
export function PageRoute<P = {}, PP = {}>(config: IPageRouteConfig) {
    return (Target: React.ComponentType<RouteComponentProps<P>> | React.ComponentType<PP | any>) => {
        return (
            ({children,...other}: IPageRouteProps<P>) => {
                console.log("*************************",children,other);
                const routes = (props: RouteComponentProps<P>): React.ReactNode => {
                    return (
                        <Target {...props} >{
                            React.Children.toArray(children).map((child: any)=>React.cloneElement(child,{}))
                        }</Target>
                    )
                }
                return <Route exact={ config.exact || true } path={ config.path } render={routes} />;
            }
        ) as any;
    }
}
