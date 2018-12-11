import { IDataListItem } from "src/shared/logic";
import { ITreeMenuStore } from "../TreeMenuStore";

export interface IOItemProps {
    store: ITreeMenuStore;
    item?: IMenuItemConfig;
    index: number;
    [key: string]: any;
}

/**
 * @property icon: any 图标
 * @property title: string 标题
 * @property children: List<this> 子项
 * @property selected: boolean 是否被选中
 * @property collapse: boolean 是否展开中
 */
export interface IMenuItemConfig extends IDataListItem {
    /**
     * 图标
     */
    icon?: any;
    /**
     * 标题
     */
    title: string;
    /**
     * 子项
     */
    children?: Array<this>;
    /**
     * 是否展开中
     */
    collapse?: boolean;
}