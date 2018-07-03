
export type AxisType = 'category' | 'value' | string | null | undefined;

export type AxisData =  Array<string | number | null> | null | undefined;


import { IXAxisOption, IYAxisOption } from './';

export interface ICoordinateSystemOptoin {
    xAxis?: Array<IXAxisOption> | IXAxisOption | undefined;
    yAxis?: Array<IYAxisOption> | IYAxisOption | undefined;
}