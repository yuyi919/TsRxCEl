import * as H from 'history';
import * as React from 'react';
import { match } from 'react-router';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Echarts, Line, Options } from '../../shared/components/MyEcharts';
import { EventEmitter } from '../../shared/utils/EventEmitter';
import { PageRoute } from './PageRoute';


export interface IPageRouteProps<P> {
    history?: H.History;
    location?: H.Location;
    match?: match<P>;
}

export interface IEchartsPageParam {
    data: number[];
}
@PageRoute<IEchartsPageParam>({
    path: '/echartsTest/:data',
    exact: true
})
export class EchartsTestPage extends React.PureComponent<IPageRouteProps<IEchartsPageParam>, any> {
    
    public onComponentUnmount: EventEmitter<boolean> = new EventEmitter<boolean>();
    public state: any = {
        data: [1]
    };

    constructor(props: IPageRouteProps<IEchartsPageParam>) {
        super(props);
    }
    public componentDidMount () {
        console.log('EchartsTestPage！', this.props)
        interval(10000).pipe(
            takeUntil(this.onComponentUnmount)
        ).subscribe(this.updateData)
    }
    public updateData = (num: number): void => {
        this.setState({ data: [...this.state.data, num] });
    }
    // getSnapshotBeforeUpdate(prevProps: any, prevState: any) {
    //     return null;
    // }
    public render() {
        return (
            <Echarts show={true}>
                <Options>
                    <Line name='测试线图' data={this.state.data} />
                </Options>
            </Echarts>
        );
    }
    public componentWillUnmount() {
        this.onComponentUnmount.emit(true);
    }
}