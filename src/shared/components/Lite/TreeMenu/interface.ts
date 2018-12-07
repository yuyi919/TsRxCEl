import { DataListStore } from './store';
export interface ITreeMenuConfig {
    onItemClick: (index: number, e: TreeMenuStore, parentIndexList: Array<number>, nativeEvent: React.MouseEvent) => void;
    level?: number;
    parentIndexList?: Array<number>;
    selectedTreeList?: Array<number>;
    collapse?: boolean;
}

export interface IMenuItemConfig {
    icon?: any;
    title: string;
    children?: Array<IMenuItemConfig>;
    selected?: boolean;
    collapse?: boolean;
}

export type TreeMenuStore = DataListStore<IMenuItemConfig, ITreeMenuConfig>