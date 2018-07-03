import * as deepmerge from 'deepmerge';
import { ObjectMap } from 'echarts-for-react';
import { inject, observer, Provider } from 'mobx-react';
import * as React from 'react';
import * as rx from 'rxjs';
import { Observable } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { OptionsObservableList } from '.';
import { Echarts, ISeriesOption } from '..';
import { EventEmitter } from '../../../utils';
import { ICoordinateSystemOptoin, IXAxisOption, IYAxisOption } from '../coordinateSystem';

export interface IOptionsTree {
    title?: ObjectMap;
    xAxis?: Array<ObjectMap> | ObjectMap;
    yAxis?: Array<ObjectMap> | ObjectMap;
    series?: Array<ISeriesOption> | ISeriesOption;
}
export interface IOptionsProps {
    options?: IOptionsTree; // base Options
    optionContainer?: Echarts; // toSetOption
    children?: React.ReactNode | React.ReactNodeArray;
}

@inject('chartsInstance', 'optionContainer')
@observer
export class Options extends React.Component<IOptionsProps, any> {
    public onUnmount: EventEmitter<boolean> = new EventEmitter<boolean>();
    public seriesList: OptionsObservableList<ISeriesOption> = new OptionsObservableList<ISeriesOption>('series');
    public xAxisList: OptionsObservableList<IXAxisOption> = new OptionsObservableList<IXAxisOption>('xAxis');
    public yAxisList: OptionsObservableList<IYAxisOption> = new OptionsObservableList<IYAxisOption>('yAxis');
    public coordinateSystem: ICoordinateSystemOptoin = {
        xAxis: {
            data: ['A', 'B', 'C', 'D', 'E']
        },
        yAxis: {},
    };
    constructor(props: IOptionsProps) {
        super(props);
        this.onUnmount.subscribe((real: boolean)=>{
            this.seriesList.dispose();
            this.xAxisList.dispose();
            this.yAxisList.dispose();
        })
        this.getOptionsTreeObs().subscribe((options: IOptionsTree) => {
            console.log('options',options);
            if(this.props.optionContainer){
                this.props.optionContainer.setOption({...options,...this.coordinateSystem});
            }
        });
    }
    public componentWillReact(msg: any) {
        console.log('option');
    }
    public getOptionsTreeObs(): Observable<IOptionsTree> {
        return rx.combineLatest(
            this.seriesList.getComputedObs(),
            this.xAxisList.getComputedObs(),
            this.yAxisList.getComputedObs()
        ).pipe(
            takeUntil(this.onUnmount),
            map((optionList: Array<{[key:string]:any}>) => {
                return (deepmerge as any).default.all(optionList);
            }),
            filter((options: any) => {
                return Object.keys(options).map((key:string)=>options[key]).some((i:any)=>i!=null);
            }),
            switchMap((list: any)=>rx.of(list))
        )
    };
    public componentDidUpdate() {
        // console.log(JSON.parse(JSON.stringify(this.optionsTree)));
    }
    public render() {
        return (
            <Provider optionsTree={this}>
                <>{this.props.children}</>
            </Provider>
        )
    }
    public componentWillUnmount() {
        this.onUnmount.emit(true);
        this.onUnmount.dispose();
    }
}