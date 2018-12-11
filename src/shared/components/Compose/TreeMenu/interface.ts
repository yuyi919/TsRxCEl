import { IDataListConfig } from 'src/shared/logic';
import { IMenuItemConfig, ITreeMenuStore } from '.';

export interface ITreeMenuConfig<T = IMenuItemConfig> extends IDataListConfig<IMenuItemConfig>{
    /**
     * @param index
     * @param store
     * @param currentIndexList 包含当前索引在内的完整索引
     * @param nativeEvent
     */
    onItemClick: (item: T | null, index: number, store: ITreeMenuStore) => void;
    /**
     * 
     */
    rootRouteList?: Array<number>;
    /**
     * 是否折叠
     */
    collapse?: boolean;
}

/**
 * 
 */
export interface ITreeMenuContainerProps { 
    /**
     * 父级列表中的索引
     */
    index?: number;
    /**
     * 父级列表Store
     */
    store: ITreeMenuStore;
};