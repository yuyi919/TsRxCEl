import * as H from 'history';
import * as React from 'react';
import { match, RouteComponentProps, RouteProps } from 'react-router';
import { Route } from "react-router-dom";

export interface IPageRouteProps<P> {
    computedMatch?: match<P>;
    localtion?: H.Location;
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
export function PageRoute<P = {}, PP = {}>({path,exact,children}: IPageRouteConfig) {
    return function getRoute(Target: React.ComponentType<RouteComponentProps<P>> | React.ComponentType<PP | any>) {
        let routes: any = Target;
        if(children && (children instanceof Array)){
            routes = (props: RouteComponentProps<P>): React.ReactNode => {
                return (
                    <>
                        <Target {...props} />
                    {
                        children.map((Children: any)=>{
                            console.log(Children)
                            return <Children key='path'/>;
                        })
                    }</>
                )
            }
        }
        return (
            function(props: IPageRouteProps<P>){
                console.log("*************************",props);
                return <Route exact={ exact || true } path={ path } component={routes} />;
            }
        ) as any;
    }
}
export const Test = PageRoute({path:''})(function(){return<div />})
