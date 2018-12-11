import { action, computed, observable, toJS } from 'mobx';
import { ImmerUtil } from 'src/shared/utils/ImmerUtil';
import { IDataListStoreBase } from './interface';

/**
 * 数据列表通用store
 * @type T 数据类
 * @type P 列表配置类
 */
export abstract class ADataListStore<T extends object> implements IDataListStoreBase<T> {
    @observable protected data: Array<T>;
    /**
     * 获取数据
     */
    @computed public get list() {
        return toJS(this.data)
    }

    /**
     * @param defaultData 初始数据
     * @param config 初始配置
     */
    public constructor(defaultData?: Array<T>) {
        this.setDataList(defaultData || [])
        // console.log('createstore', toJS(this))
    }

    /**
     * 设置数据列表
     * @param dataList 
     */
    @action public setDataList(dataList: Array<T>) {
        this.data = dataList
        // this.data = ImmerUtil.MapUpdate<T[]>(this.data, dataList);
        return this;
    }

    /**
     * 返回数据列表
     */
    public getDataList(): Array<T>{
        return this.data;
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
        this.data[index] = ImmerUtil.MapUpdate<T>(this.data[index], nextData);
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

}