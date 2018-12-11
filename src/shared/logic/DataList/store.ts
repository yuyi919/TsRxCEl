import reduce from 'immer';
import { action, computed, observable, toJS } from 'mobx';
import { EventEmitter } from 'src/shared/utils';

export interface IDataListConfig<T> {
    /**
     * 翻译器
     */
    transform?: (index: number, item: T | null, store?: IDataListStore<T, IDataListConfig<T>>) => T;
}

export interface IDataListItem {
    /**
     * 关键字索引
     */
    dataKey?: string;
    /**
     * 索引
     */
    index: number;
    /**
     * 是否选中
     */
    selected?: boolean;
}
/**
 * 数据列表通用store
 * @type T 数据类
 * @type P 列表配置类
 */
export class DataListStore<T extends IDataListItem, C extends IDataListConfig<T>> implements IDataListStore<T, C> {
    @observable public data: Array<T>;
    @observable public config: C;
    protected toSelect: EventEmitter<number>;

    @observable private pSelectedIndex: number = -1;
    public get selectedIndex(): number {
        return this.pSelectedIndex;
    }
    public set selectedIndex(value: number) {
        // console.warn(value);
        this.pSelectedIndex = value;
    }
    /**
     * 获取数据
     */
    @computed public get list() {
        return toJS(this.data)
    }

    /**
     * 当前选中
     */
    @computed public get currentItem(): T | null {
        const item: T | null = this.getDataItem(this.selectedIndex);
        const { transform = null } = this.config || {};
        return (transform instanceof Function) ? transform(this.selectedIndex, item, this) : item;
    }

    /**
     * @param defaultData 初始数据
     * @param config 初始配置
     */
    public constructor(defaultData?: Array<T>, config?: C) {
        this.setDataList(defaultData || [])
        if (config) {
            this.config = config
        }
        this.toSelect = new EventEmitter<number>();
        // console.log('createstore', toJS(this))
    }
    /**
     * 设置配置
     * @param config 
     */
    @action public setConfig(config: C) {
        this.config = reduce(this.config as any, (c: C) => {
            for (const key in config) {
                if (c) {
                    c[key] = config[key];
                }
            }
        })
        return this;
    }
    /**
     * 设置数据列
     * @param dataList 
     */
    @action public setDataList(dataList: Array<T>) {
        this.data = dataList
        return this;
    }
    /**
     * 
     * @param index 数据索引
     * @param nextData 更新用数据
     * @param forceUpdate 是否强制更新
     */
    @action public setDataItem(index: number, nextData: T, forceUpdate?: boolean) {
        if (forceUpdate) {
            this.data[index] = nextData;
            return this;
        }
        this.data[index] = reduce(this.data[index] as any, (i: T) => {
            for (const key in nextData) {
                if (i) {
                    i[key] = nextData[key];
                }
            }
        })
        return this;
    }
    /**
     * 获取数据
     * @param index 数据索引
     * @param transform 翻译器
     */
    @action public getDataItem(index: number): T | null {
        return this.data[index] || null;
    }

    /**
     * 选中指定索引的数据 会判断是否变更
     * @param index 数据索引
     */
    @action public select(index: number) {
        // console.log(this.selectedIndex, "=>", index)
        if (index == -1 || index == undefined){
            this.clearSelected();
        } else if (index != this.selectedIndex){
            if (this.selectedIndex > -1 && this.currentItem != null) {
                this.currentItem.selected = false;
            }
            this.data[index].selected = true;
            this.selectedIndex = index;
            this.toSelect.emit(index);
        }
        return this;
    }

    /**
     * 清除列表选中状态
     */
    @action public clearSelected() {
        if (this.selectedIndex > -1 && this.currentItem != null) {
            this.currentItem.selected = false;
        } else {
            this.data.forEach(i => i.selected = false);
        }
        this.selectedIndex = -1;
        return this;
    }

    public onSelectChanged(sub: (index: number) => void): this {
        this.toSelect.subscribe(sub)
        return this;
    }

    /**
     * 是否是选中数据的索引
     * @param index 数据索引
     */
    public isCurrent(index: number) {
        return this.selectedIndex == index
    }

    /**
     * 
     * @param index 数据索引
     * @param filter 滤镜 
     */
    public isItemSome(index: number, filter: (config: T) => boolean): boolean {
        if (this.data[index]) {
            return filter(this.data[index])
        }
        return false;
    }
}

export interface IDataListStore<T, C> {
    setConfig(config: C): this;
    setDataList(dataList: Array<T>): this;
    setDataItem(index: number, nextData: T, forceUpdate: boolean): this;
    getDataItem(index: number, transform: (index: number, item: T, store?: IDataListStore<T, C>) => T): T | null;
    select(index: number): this;
    isCurrent(index: number): boolean;
    isItemSome(index: number, filter: (config: T) => boolean): boolean;
}