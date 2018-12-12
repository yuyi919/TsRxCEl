// @ts-check
import { inject, IReactComponent, observer } from 'mobx-react';
import * as React from 'react';

/**
 * 
 * @param <P>
 * @param <I> 
 * @param propNames
 */
export function OFactoryCreater<P, I>(...propNames: string[]): (component: IReactComponent<P>) => IReactComponent<I> {
    return (component: IReactComponent<P>): IReactComponent<I> => {
        const InnerComponent = observer(component);
        const OutComponent = (props: P) => {
            for (const propName of propNames) {
                if (props[propName] == undefined) {
                    return null;
                }
            }
            return <InnerComponent {...props} />;
        };
        return inject(...propNames)(observer(OutComponent)) as IReactComponent<I & P>;
    };
}