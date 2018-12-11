export interface IDataListStoreBase<T> {
    list: Array<T>;
    setDataList(dataList: Array<T>): this;
    getDataList(): Array<T>;
    setDataItem(index: number, nextData: T, forceUpdate: boolean): this;
    getDataItem(index: number, transform: (index: number, item: T, store?: IDataListStoreBase<T>) => T): T | null;
}

export interface IDataListStore<T, C = any> extends IDataListStoreBase<T> {
    setConfig(config: C): this;
    getConfig(): C;
    select(index: number): this;
    isCurrentIndex(index: number): boolean;
}


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