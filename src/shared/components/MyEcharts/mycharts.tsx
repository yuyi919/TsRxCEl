import ReactEcharts, { ObjectMap } from 'echarts-for-react';
import { action, computed, observable, toJS } from 'mobx';
import { Provider } from 'mobx-react';
import * as React from 'react';
import * as rx from 'rxjs';
import { IOptionsTree } from '.';
import { onDestroy, RxComponent } from '../../utils';
import { ChartsInstance } from './chartsInstance';

export interface IMyEchartsProps {
    className?: string;
    dataSet?: Array<ObjectMap> | rx.Observable<Array<ObjectMap>>;
    option?: IOptionsTree;
    theme?: string;
    onUpdate?: any;
    svg?: boolean;
    children: React.ReactNode | React.ReactNodeArray;
    style?: ObjectMap;
    show?: boolean;
}

@RxComponent({
    name: 'Echarts',
    observer: true,
    style: (props: any) => `
        display: ${props.show ? "block" : "none"};
    `,
    portal: document.getElementById('screen'),
})
export class Echarts extends React.Component<IMyEchartsProps, any> {
    @observable
    public chartsInstance: ChartsInstance | null;
    @observable
    public option: ObjectMap | null;

    constructor(props: IMyEchartsProps) {
        super(props);
        this.state = {};
        this.setOption = this.setOption.bind(this);
        this.onChartsInit = this.onChartsInit.bind(this);
    }

    @action
    public setOption(option: ObjectMap) {
        this.option = option;
    }

    @computed
    public get chartsOption(): any {
        return this.option ? toJS(this.option) : null;
    }

    @action
    @onDestroy('')
    public exit(e: any) {
        console.log('onUnmount', this, (this as any).$isRxComponent);
        this.option = null;
        if (this.chartsInstance) {
            this.chartsInstance.destroy();
            this.chartsInstance = null;
        }
    }

    public componentWillReact(msg: any) {
        // console.log(this.chartsOption,this,(this as any).$isRxComponent);
    }

    @action
    public onChartsInit(event: any): void {
        this.chartsInstance = new ChartsInstance(event);
        console.log(this.chartsInstance, this);
    }

    public render() {
        const { style, theme = 'dark', svg = false, children, className } = this.props;
        console.log(this.chartsOption)
        return (
            <React.Fragment>
                {this.chartsOption && <ReactEcharts className={className} key='renderer' onChartReady={this.onChartsInit}
                    style={style} option={this.chartsOption}
                    theme={theme}
                    opts={{ renderer: svg ? "svg" : "canvas" }}
                />}
                <Provider key='provider' chartsInstance={this.chartsInstance} optionContainer={this}>
                    <>{children}</>
                </Provider>
            </React.Fragment>
        );
    }
}