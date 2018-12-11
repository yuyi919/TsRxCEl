import { action, observable } from 'mobx';
import { openTxtFile } from 'src/shared/clientApi';
import * as Compose from 'src/shared/components/Compose';
import { IMenuItemConfig } from 'src/shared/components/Compose';

export interface ISearchList<T> {
    title: string | null;
    content: Array<T>;
    children?: Array<ISearchList<T>>;
    childrenMap?: { [key: string]: ISearchList<T> };
    lastElement: Element | null;
}

export class MainFrameStore {
    @observable public open: boolean = false;
    @observable public drawerWidth: number = 200;
    @observable public content: Array<string> = [];
    @observable public title: string = "";
    @observable public selectedTree: Array<number> = [];
    public listTag: Array<string> = ['h1', 'h2', 'h3', 'h4', 'h5'];
    @observable public menuList: Compose.ITreeMenuStore;

    constructor() {
        this.menuList = new Compose.TreeMenuStore([
            {
                index: 0, title: "menu1", children: [
                    { index: 0, title: "menu1-1" },
                    {
                        index: 1, title: "menu1-2", children: [
                            { index: 0, title: "menu1-2-1" },
                            { index: 1, title: "menu1-2-2" }
                        ]
                    }
                ]
            },
            { index: 1, title: "menu2", children: [
                { index: 0, title: "menu2-1" },
                {
                    index: 1, title: "menu2-2", children: [
                        { index: 0, title: "menu2-2-1" },
                        { index: 1, title: "menu2-2-2" },
                        { index: 2, title: "menu2-2-3" },
                        { index: 3, title: "menu2-2-4" }
                    ]
                }
            ]},
            { index: 2, title: "menu3" }
        ], {onItemClick: this.onItemClick});
    }

    @action public toggle = () => {
        this.open = !this.open;
    }
    @action public onItemClick = (item: IMenuItemConfig, index: number, store: Compose.ITreeMenuStore) => {
        if(item){
            console.log(item.title)
            // this.content = (item as any).content || [];
            // this.title = item.title;
        }
       // console.log(toJS(e),parentIndexList)
        // let current: Compose.IMenuItemConfig[] = this.menuList.data;
        // let currentItem: Compose.IMenuItemConfig | null = null;
        // // console.log("start", toJS(current))
        // for (const i of parentIndexList) {
        //     currentItem = current[i]
        //     // console.log(toJS(currentItem))
        //     if (currentItem) {
        //         current = currentItem.children || []
        //     } else {
        //         break;
        //     }
        // }
        // if (currentItem) {
        //     currentItem.collapse = !currentItem.collapse;
        //     currentItem.selected = true;
        //     this.content = (currentItem as any).content || [];
        //     this.title = currentItem.title;
        // }
        // if(this.selectedTree.length==0){
        //     this.selectedTree = parentIndexList
        // } else {
        //     parentIndexList.forEach((i,index)=>{
        //         this.selectedTree[index] = i
        //     })
        // }
        // this.selectedTree = [...parentIndexList];
        // console.log("end",this.selectedTree, toJS(this.menuList))
    }

    @action public openHandler = () => {
        openTxtFile().subscribe(text => {
            const iconv = require('iconv-lite');
            text = iconv.decode(text, 'gbk')
            const dom = document.createElement("html");
            dom.innerHTML = text
            const rootTitle = dom.querySelectorAll(this.listTag[0])
            console.log(dom)
            if (rootTitle.length > 0) {
                const menu: Array<ISearchList<string>> = []
                rootTitle.forEach((i: Element, index: number) => {
                    menu.push(this.searchTag(i, 0))
                })
                this.menuList = new Compose.TreeMenuStore(menu as any, {onItemClick: this.onItemClick});
            }
        })
        // HttpService.getXml('www.baidu.com/s?word=node爬虫',{}).subscribe(response=>{
        //     console.log(response);
        // });
    }
    public searchTag(current: Element | null, level: number): ISearchList<string> {
        const content: Array<string> = [];
        const children: Array<ISearchList<string>> = [];
        const childrenMap: any = {};
        let title: string | null = null;
        while (current) {
            if (title == null) {
                title = current.textContent || ""
            } else {
                const tagName = current.tagName.toLowerCase();
                const currentIndex = this.listTag.indexOf(tagName);
                if (currentIndex > level) {
                    // 检索到 级别低于当前级别的标签，插入下一级的标签检索
                    const searchList = this.searchTag(current, level + 1);
                    if (searchList.title) { // 如果完成了检索
                        children.push(searchList);
                        childrenMap[searchList.title] = searchList;
                        content.push(searchList.title);
                        // 录入检索结果
                        current = searchList.lastElement
                        // 以该级别检索最后检索到的标签作为下一个标签继续检索
                        continue;
                    }
                }
                if (currentIndex <= level && currentIndex != -1) {
                    // console.log(`${tagName} level较高`)
                    // 检索到 级别高于当前级别的标签，则该标签检索完毕
                    break;
                } else if (current && current.textContent && current.textContent.trim() !== "") {
                    // 如果该标签有内容则填入
                    content.push(current.innerHTML)
                }
            }
            // 以下一个标签继续检索
            current = current.nextElementSibling
        }
        return { title, content, children: children.length > 0 ? children : undefined, childrenMap, lastElement: current }
    }
}
export default new MainFrameStore();