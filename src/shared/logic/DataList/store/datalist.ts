import { action, computed, observable } from 'mobx';
import { EventEmitter } from 'src/shared/utils';
import { ImmerUtil } from 'src/shared/utils/ImmerUtil';
import { ADataListStore } from './abstract';
import { IDataListConfig, IDataListItem, IDataListStore } from './interface';

/**
 * 数据列表通用store
 * @type T 数据类
 * @type P 列表配置类
 */
export class DataListStore<T extends IDataListItem, C extends IDataListConfig<T>> extends ADataListStore<T> implements IDataListStore<T, C> {
    /**
     * 选择变更事件
     */
    protected selectChanged: EventEmitter<number>;
    @observable
    protected config: C;

    @observable
    private pSelectedIndex: number = -1;
    public get selectedIndex(): number { return this.pSelectedIndex; }
    public set selectedIndex(value: number) { this.pSelectedIndex = value; }

    /**
     * 当前选中
     */
    @computed public get currentItem(): T | null {
        const item: T | null = this.getDataItem(this.pSelectedIndex);
        const { transform = null } = this.config || {};
        return (transform instanceof Function) ? transform(this.pSelectedIndex, item, this) : item;
    }

    /**
     * @param defaultData 初始数据
     * @param config 初始配置
     */
    public constructor(defaultData?: Array<T>, config?: C) {
        super(defaultData);
        if (config) {
            this.config = config
        }
        this.selectChanged = new EventEmitter<number>();
        // console.log('createstore', toJS(this))
    }

    /**
     * 设置配置
     * @param config 
     */
    @action public setConfig(config: C) {
        this.config = ImmerUtil.MapUpdate<C>(this.config, config);
        return this;
    }

    /**
     * 返回配置
     */
    public getConfig(): C {
        return this.config;
    }

    /**
     * 选中指定索引的数据，小于0或undefined时自动清空 判断并发送是否变更事件
     * @param index 数据索引
     */
    @action public select(index: number) {
        // console.log(this.pSelectedIndex, "=>", index)
        if (index == -1 || index == undefined) {
            this.clearSelected();
        } else if (index != this.pSelectedIndex) {
            if (this.currentItem != null) {
                this.currentItem.selected = false;
            }
            this.data[index].selected = true;
            this.pSelectedIndex = index;
            this.selectChanged.emit(index);
        }
        return this;
    }

    /**
     * 清除列表选中状态
     */
    @action public clearSelected() {
        if (this.pSelectedIndex > -1 && this.currentItem != null) {
            this.currentItem.selected = false;
        } else {
            this.data.forEach(i => i.selected = false);
        }
        this.pSelectedIndex = -1;
        return this;
    }

    /**
     * 订阅选择变更事件
     */
    public onSelectChanged(sub: (index: number) => void): this {
        this.selectChanged.subscribe(sub)
        return this;
    }

    /**
     * 是否是选中数据的索引
     * @param index 数据索引
     */
    public isCurrentItem(item?: T): boolean {
        return item != undefined && (this.currentItem == item);
    }

    /**
     * 是否是选中数据的索引
     * @param index 数据索引
     */
    public isCurrentIndex(index: number): boolean {
        return this.getDataItem(index)!.selected == true
    }

}
