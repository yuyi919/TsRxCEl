import * as React from 'react';
import * as rx from 'rxjs';
import { Observable } from 'rxjs';
import { map, share, takeUntil } from 'rxjs/operators';
import { EventEmitter, onDestroy, onInit, rxcDestroy, RxcInnerComponentProps, RxComponent } from '../../../utils';
import { Options } from '../options';

/**
 * Base Series Option
 */
export interface ISeriesOptionBasic<D> {
  name?: string;
  type?: string;
  data?: Array<D>;
  [key: string]: any;
}

/**
 * Sample Series Option
 */
export interface ISeriesOption extends ISeriesOptionBasic<any> {
};

/**
 * Base Series Props
 */
export interface ISeriesPropsBasic extends RxcInnerComponentProps {
  name?: string;
  type?: string;
  data?: Array<any>;
  option?: any; // baseOption
  [key: string]: any;
  // injectorProps
  chartsInstance?: any;
  optionsTree?: Options;
}

/**
 * Simple Series Props
 */
export interface ISeriesProps extends ISeriesPropsBasic {
  option: ISeriesOption; // baseOption
};

export interface ISeriesState {
  name?: string | undefined; // seriesName
  type?: string | undefined; // seriesType to lookup Echarts
  data?: Array<any> | undefined;
  baseOption?: ISeriesOption | undefined;
}

@RxComponent({
  name: 'Series',
  observer: true,
  inject: ['chartsInstance', 'optionsTree']
})
export class Series extends React.Component<ISeriesProps, ISeriesState> {
  public static getDerivedStateFromProps(nextProps: ISeriesProps, prevState: ISeriesState) {
    const { name, type, data, option } = nextProps;
    return { ...prevState, name, type, data, baseOption: option };
  }
  public seriesId: number | null;
  public setOption: EventEmitter<ISeriesOption>;
  public state: ISeriesState = {};
  public baseOption: ISeriesOption | undefined;
  public name: string | undefined; // seriesName
  public type: string | undefined; // seriesType to lookup Echarts
  public data: Array<any> | undefined;
  constructor(props: ISeriesProps) {
    super(props);
    this.seriesId = null;
    this.setOption = new EventEmitter<ISeriesOption>();
    this.registerTreeOption = this.registerTreeOption.bind(this);
  }
  /**
   * base option
   */
  
  get option(): ISeriesOption {
    return {
      ...this.state.baseOption,
      type: (this.state.type),
      data: (this.state.data),
      name: (this.state.name)
    };
  }
  /**
   * 在OptionTree里注册或注销自己
   * @param setOption option流, null即注销
   */
  public registerTreeOption(setOption: Observable<ISeriesOption> | null) {
    const { optionsTree } = this.props;
    if (optionsTree) {
      this.seriesId = optionsTree.seriesList.setObsItem(this.seriesId, setOption);
    }
  }
  @onInit() 
  public shallow(@rxcDestroy() destroy?: Observable<any>) {
    destroy!.subscribe(e=>{
      console.log('destroy',e);
    });
    console.log('mount',this);
  }
  public componentDidMount(@rxcDestroy() destroy?: Observable<any>) {
    const subject: rx.Observable<ISeriesOption> = rx.merge(
      rx.of(this.option), // 初始流
      this.setOption // 更新流
    ).pipe(
      takeUntil(destroy!),
      map((option: ISeriesOption) => option),
      share()
    )
    this.registerTreeOption(subject);
    subject.subscribe(console.log.bind(this, 'series' + this.name))
  }
  public componentDidUpdate(lastProps: ISeriesProps) {
    this.setOption.emit(this.option);
  }
  public render() {
    return null;
  }
  @onDestroy('') 
  public rxUnmount(): void {
    console.log(this,'unmount');
    this.registerTreeOption(null);
    this.name = undefined;
    this.type = undefined;
    this.data = undefined;
    this.baseOption = undefined;
  }
}