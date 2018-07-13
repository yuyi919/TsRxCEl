import * as React from 'react';

export interface IAppProps {
    children: any;
}

export class Container extends React.Component<IAppProps, any> {
    public children: any;
    constructor(props: IAppProps) {
        super(props);
    }
    public render() {
        const {children} = this.props;
        return (
            <div>{children}</div>
        );
    }
}
