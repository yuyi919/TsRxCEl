import { action, computed, observable } from 'mobx';
import { DataListStore, IDataListStore } from 'src/shared/logic/DataList';
import { IMenuItemConfig, ITreeMenuConfig } from '.';

export interface IItemClickEvent {
    index: number;
    nativeEvent: React.MouseEvent;
}

export class TreeMenuStore extends DataListStore<IMenuItemConfig, ITreeMenuConfig> implements ITreeMenuStore {

    @observable
    public collapseIndex: number | null;
    public root: TreeMenuStore;
    public level: number;
    public lastEvent: React.MouseEvent;
    public childrenStore: Array<TreeMenuStore> = [];

    @computed public get currentSelectedStore() {
        return this.getChildrenStore(this.selectedIndex);
    }
    @computed public get currentTreeIndex(): Array<number> {
        const { rootRouteList = [] } = this.config;
        return [...rootRouteList, this.selectedIndex];
    };

    constructor(defaultData: Array<IMenuItemConfig>, config: ITreeMenuConfig, level: number = 0, root?: TreeMenuStore) {
        super(defaultData, config);
        this.level = level;
        this.root = root || this;
        // console.log('createStore', defaultData.length, config ? config.level : null)
        // 当选中状态发生变化
        this.onSelectChanged((selectedIndex: number) => {
            if (this.config) {
                this.config.onItemClick(this.currentItem, selectedIndex, this);
            }
        });
    }

    @action
    public onItemClick({ index, nativeEvent }: IItemClickEvent) {
        const { rootRouteList = [] } = this.config;
        const nextTreeIndex = [...rootRouteList, index];
        if (this.root != null) {
            console.log("确认选中，开始传递", nextTreeIndex)
            this.root.selectedByTree(nextTreeIndex);
        }
        this.lastEvent = nativeEvent;
        const currentItem = this.getDataItem(index)
        // console.log(toJS(parentIndexList), toJS(this))

        // this.select(index);
        // console.log("选中" + index, this.selectedIndex, this.currentTreeIndex)
        // 折叠与选中无关
        if (currentItem) {
            if (currentItem.children) {
                this.collapse(index)
            }
        }
    }

    @action
    public collapse(index: number): this {
        console.log(index, this.collapseIndex)
        this.collapseIndex = (this.collapseIndex == index) ? null : index;
        console.log(this.collapseIndex)
        return this;
    }

    public isCollapse(index: number): boolean {
        return this.collapseIndex == index;
    }

    public getChildrenStore = (index: number): TreeMenuStore => {
        // 不存在则新建一个store
        if (!this.childrenStore[index]) {
            const { rootRouteList = [], ...other } = this.config;
            const item = this.getDataItem(index);
            if (item != null) {
                const children = item.children;
                if (children && children.length > 0) {
                    const nextConfig: ITreeMenuConfig = {
                        ...other,
                        rootRouteList: [...rootRouteList, index]
                    }
                    this.childrenStore[index] = new TreeMenuStore(children, nextConfig, this.level + 1, this.root);
                }
            }
        }
        return this.childrenStore[index];
    }

    public clearAllSelected() {
        for (const store of this.childrenStore) {
            // 递归清理全部子store
            if (store) {
                store.clearAllSelected();
            }
        }
        // 最后再清理自身
        this.clearSelected();
    }

    // 向下传递
    public selectedByTree(currentTreeIndex: Array<number>) {
        const stepIndex = currentTreeIndex[this.level];
        // 如果在选中树的范围
        if (stepIndex != undefined) {
            // 清理不同分支
            if (!this.isCurrentIndex(stepIndex) && this.currentSelectedStore != null) {
                // console.log(`第${this.level}级, 清理 ${this.currentItem!.title} 已选中的子项`)
                this.currentSelectedStore.clearAllSelected();
            }

            this.select(stepIndex);
            // console.log(`第${this.level}级, 选中：${this.currentItem!.title}`)
            if (this.currentSelectedStore != null) {
                this.currentSelectedStore.selectedByTree(currentTreeIndex);
            }
        }
    }
}
export interface ITreeMenuStore extends IDataListStore<IMenuItemConfig, ITreeMenuConfig> {
    level: number;
    root: ITreeMenuStore;
    childrenStore: ITreeMenuStore[];
    collapse(index: number): this;
    isCollapse(index: number): boolean;
    getChildrenStore(index: number): TreeMenuStore;
    onItemClick({ index, nativeEvent }: IItemClickEvent): void;
}