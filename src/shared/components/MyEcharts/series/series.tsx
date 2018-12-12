import * as React from 'react';
import { merge, Observable, of } from 'rxjs';
import { map, share, takeUntil } from 'rxjs/operators';
import { EventEmitter } from 'src/shared/utils/EventEmitter';
import { onChanges, onDestroy, onInit, rxcDestroy, RxcInnerComponentProps, RxComponent } from 'src/shared/utils/RxComponent';
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
  inject: ['chartsInstance', 'optionsTree'],
  render: (props: any) => {
    return <div />;
  }
})
export class Series extends React.Component<ISeriesProps, ISeriesState> {
  public static getDerivedStateFromProps(nextProps: ISeriesProps, prevState: ISeriesState) {
    const { name, type, data, option } = nextProps;
    return { ...prevState, name, type, data, baseOption: option };
  }
  public seriesId: number | null;
  public setOption: EventEmitter<ISeriesOption>;
  public state: ISeriesState = {};
  public baseOption: ISeriesOption;
  public name: string; // seriesName
  public type: string; // seriesType to lookup Echarts
  public data: Array<any>;
  constructor(props: ISeriesProps) {
    super(props);
    this.seriesId = null;
    this.setOption = new EventEmitter<ISeriesOption>();
    this.registerTreeOption = this.registerTreeOption.bind(this);
  }
  /**
   * get option
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
    console.log(destroy)
    destroy!.subscribe(e => {
      console.log('destroy', e);
    });
    console.log('mount', this);
  }
  public componentDidMount(@rxcDestroy() destroy?: Observable<any>) {
    const subject: Observable<ISeriesOption> = merge(
      of(this.option), // 初始流
      this.setOption // 更新流
    ).pipe(
      takeUntil(destroy!),
      map((option: ISeriesOption) => option),
      share()
    )
    this.registerTreeOption(subject);
    subject.subscribe(() => console.log(this, 'series' + this.name))
  }

  @onChanges('')
  public onChanges(lastProps: ISeriesProps) {
    this.setOption.emit(this.option);
  }

  public render() {
    return null;
  }
  @onDestroy('')
  public rxUnmount(destroy: any): void {
    console.log(this, 'unmount', destroy);
    this.registerTreeOption(null);
  }
}