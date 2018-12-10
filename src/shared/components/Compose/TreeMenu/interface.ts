import { DataListStore } from 'src/shared/logic/DataList';
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

export class TreeMenuStore extends DataListStore<IMenuItemConfig, ITreeMenuConfig>{
    constructor(defaultData?: Array<IMenuItemConfig>, config?: ITreeMenuConfig) {
      super(defaultData, config);
    }
}