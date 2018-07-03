import * as React from 'react';
import { ISeriesOptionBasic, ISeriesPropsBasic, Series } from '.';
import { mergeOption } from '../common/util';




export interface ILineOption extends ISeriesOptionBasic<any> {

}
export interface ILineProps extends ISeriesPropsBasic {
  app?: string;
  /**
   * addition Option
   */
  option?: ILineOption;
  /**
   * allow to merge
   */
  optionMerge?: boolean;
}
export class Line extends React.PureComponent<ILineProps, any> {
  public static defaultProps = {
    optionMerge: true
  }
  /**
   * get Merge option or Instead option
   * @param option 自定义option
   * @param merge 合并or替换
   */
  public static getOption(option: ILineOption | undefined, merge?: boolean): ILineOption {
    console.log('*************', merge, mergeOption(LineDefaultOption, option));
    return {
      option: merge
            ?mergeOption(LineDefaultOption, option)
            :(option || LineDefaultOption)
    };
  };
  public static getDerivedStateFromProps(nextProps: ILineProps, prevState: any) {
    const { option, optionMerge } = nextProps;
    return Line.getOption(option, optionMerge)
  }
  public state: any = {
    option: null
  }

  
  constructor(props: ILineProps) {
    super(props);
  }
  public componentDidUpdate (prevProps: ILineProps) {
    console.log(Line.getOption(this.props.option));
  }
  
  
  public render() {
    const { option, type,...other } = this.props;
    return <Series type='line' option={this.state.option} {...other}/>;
  }
}

export const LineDefaultOption: ILineOption = {
  type: 'line',
  name: '',
  radius: '100%',
  smooth: true,
  symbol: 'emptyCircle',
  symbolSize: 8,
  hoverAnimation: true,
  showSymbol: true,
  legendHoverLink: true,
  itemStyle: {
      borderColor: 'red',
  },
  label: {
      show: false,
      color:'#fff',
      rotate: 0
  },
  lineStyle: {
      width: 3,
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowBlur: 10,
      shadowOffsetY: 10
  },
  progressive:1
}