import { action, computed, observable, toJS } from 'mobx';

export class DataListStore<T, P = {}> {
    @observable public data: Array<T>;
    @observable public selectedIndex: number;
    @observable public selectedList: Array<boolean>;
    @observable public collapseIndex: number | null;
    @observable public config: P;
    public childrenStore: Array<DataListStore<T,P>> = [];
    public constructor(defaultData?: Array<T>, config?: P) {
        this.setData(defaultData || [])
        if (config) {
            this.config = config
        }
        // console.log('createstore', toJS(this))
    }
    @action public setConfig(config: P) {
        for (const key in config) {
            if (this.config) {
                this.config[key] = config[key];
            }
        }
    }
    @action public setData(data: Array<T>) {
        this.data = data
        this.selectedList = new Array(data.length).fill(false);
    }
    @action public setItemByIndex(index: number, nextData: T, forceUpdate?: boolean) {
        if (forceUpdate) {
            this.data[index] = nextData;
            return;
        }
        for (const key in nextData) {
            if (this.data[index]) {
                this.data[index][key] = nextData[key];
            }
        }
    }
    @action public collapse(index: number) {
        this.collapseIndex = (this.collapseIndex==index)?null:index;
    }
    @action public select(index: number) {
        this.selectedIndex = index;
    }
    @computed public get list() {
        return toJS(this.data)
    }
    @action public getItem(index: number, transform?: (index: number, config: T, store: DataListStore<T, P>) => T) {
        const config: T = this.data[index]
        return transform ? transform(index, config, this) : config;
    }
    public isCurrent(index: number) {
        return this.selectedIndex == index
    }
    public isCollapse(index: number): boolean {
        return this.collapseIndex == index;
    }
    public hasChildren(index: number, filter: (config: T) => boolean): boolean {
        if (this.data[index]) {
            return filter(this.data[index])
        }
        return false;
    }
}