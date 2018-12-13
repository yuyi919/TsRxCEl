import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { AxisData, AxisType } from './interface';

export interface IYAxisProps {
    data?: AxisData;
    type?: AxisType;
    option?: IYAxisOption; // base option
}

export interface IYAxisOption {
    type?: AxisType;
    data?: AxisData;
    nameTextStyle?: any;
    axisLine?: any;
    axisLabel?: any;
    splitLine?: any;
    boundaryGap?: boolean;
}

@inject('chartsInstance', 'optionsTree')
@observer
export class YAxis extends React.Component<IYAxisProps, any> {
    public xAxisId: number | undefined;
    @observable 
    public data: AxisData;
    @observable 
    public type: AxisType;
    @observable
    public baseOption: IYAxisOption | null | undefined;
    public constructor(props: IYAxisProps) {
        super(props);
    }
    public registerId(id: number){
        this.xAxisId = id;
    }
    public componentWillMount() {
        this.setNextProps(this.props);      
    }
    public componentWillReceiveProps(nextProps: IYAxisProps) {
        this.setNextProps(nextProps);
    }
    @action 
    public setNextProps(props: IYAxisProps){
        const { data, type, option } = props;
        this.data = data;
        this.type = type;
        this.baseOption = option;
    }
    @action 
    public componentWillUnmount() {
        this.data = null;
        this.type = null;
        this.baseOption = null;
    }
    @computed 
    public get option(): IYAxisOption {
        return {
            ...defaultOption,
            ...this.baseOption,
            type: this.type,
            data: this.data
        }
    }
    public render() {
        return null;
    }
}
const defaultOption: IYAxisOption = {
    type: 'value',
    splitLine: {
        show: true
    },
    axisLabel: {
        formatter: undefined
    },
    axisLine: {
        symbol: ['none', 'arrow'],
        lineStyle: {
            color: '#fff'
        }
    },
    data: null
}