// import produce from 'immer';
// import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

export interface IFactoryListProps<T = object> {
    /**
     * 数据列表
     */
    data?: Array<T>;
    /**
     * 列表项构建函数
     * @param item 数据项
     * @param index 数据索引
     * @returns JSX
     */
    itemFactory: (item: T, index: number) => JSX.Element;
}
export interface IFactoryListState<T = object> {
    data: Array<T>;
}

/**
 * 有就遍历无就返回Null
 */
@observer
export class OFactoryList<T> extends React.Component<IFactoryListProps<T>, IFactoryListState<T>> {
    public render() {
        const { itemFactory, data = [] } = this.props;
        const list = data.length > 0 ? data.map(itemFactory) : null
        console.log("update")
        return <React.Fragment>{list}</React.Fragment>
    }
}
// export class AutoList<T> extends React.Component<IAutoListProps<T>, IAutoListState<T>>{
//     public static getDerivedStateFromProps(nextProps: IAutoListProps, prevState: IAutoListState) {
//         if (nextProps.data instanceof Array) {
//             const nextState = produce(prevState, (state: IAutoListState) => {
//                 if (nextProps.data) {
//                     for (let i = 0; i < nextProps.data.length; i++) {
//                         const currentItem = state.data[i];
//                         const nextItem = nextProps.data[i];
//                         if (currentItem) {
//                             for (const keyName in nextItem) {
//                                 if (keyName) {
//                                     currentItem[keyName] = nextItem[keyName]
//                                 }
//                             }
//                             console.log(toJS(currentItem))
//                         } else {
//                             state.data[i] = nextItem
//                         }
//                     }
//                 }
//             });
//             console.log(nextState == prevState, nextState)
//             return nextState;
//         }

//         return prevState
//     }
//     public state: IAutoListState<T> = { data: [] };
//     public shouldComponentUpdate(nextProps: IAutoListProps<T>, nextState: IAutoListState<T>) {
//         // if (nextState.data != this.state.data) {
//         //     console.log("updateList", toJS(nextState.data))
//         // }
//         return nextState.data != this.state.data
//     }
//     public render() {
//         const { itemFactory } = this.props;
//         const { data = [] } = this.state;
//         // /console.log('rerender', toJS(this.props.data), this.state.list)
//         const list = data.length > 0 ? data.map(itemFactory) : null
//         console.log('rerender', toJS(toJS(data)))
//         return <React.Fragment>{list}</React.Fragment>
//     }
// }
