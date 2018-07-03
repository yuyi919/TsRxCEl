import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { AxisData, AxisType } from '.';

export interface IXAxisProps {
    data?: AxisData;
    type?: AxisType;
    option?: IXAxisOption; // base option
}

export interface IXAxisOption {
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
export class XAxis extends React.Component<IXAxisProps, any> {
    public xAxisId: number | undefined;
    @observable 
    public data: AxisData;
    @observable 
    public type: AxisType;
    @observable 
    public baseOption: IXAxisOption | null | undefined;
    public constructor(props: IXAxisProps) {
        super(props);
    }
    public registerId(id: number){
        this.xAxisId = id;
    }
    public componentWillMount() {
        this.setNextProps(this.props);      
    }
    public componentWillReceiveProps(nextProps: IXAxisProps) {
        this.setNextProps(nextProps);
    }
    @action 
    public setNextProps(props: IXAxisProps){
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
    public get option(): IXAxisOption {
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
export const defaultOption: IXAxisOption = {
    type: 'category',
    data: null,
    nameTextStyle: {
        color: '#fff'
    },
    axisLine: {
        symbol: ['none', 'arrow']
    },
    axisLabel: {
        interval: 0
    },
    splitLine: {
        show: false
    },
    boundaryGap: true
}