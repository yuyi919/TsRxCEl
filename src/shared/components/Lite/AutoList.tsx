import produce from 'immer';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

export interface IAutoListProps<T = object> {
    data?: Array<T>;
    itemFactory: (item: T, index: number) => any;
}
export interface IAutoListState<T = object> {
    data: Array<T>;
}
export class AutoList<T> extends React.Component<IAutoListProps<T>, IAutoListState<T>>{
    public static getDerivedStateFromProps(nextProps: IAutoListProps, prevState: IAutoListState) {
        if (nextProps.data instanceof Array) {
            const nextState = produce(prevState, (state: IAutoListState) => {
                if (nextProps.data) {
                    for (let i = 0; i < nextProps.data.length; i++) {
                        const currentItem = state.data[i];
                        const nextItem = nextProps.data[i];
                        if (currentItem) {
                            for (const keyName in nextItem) {
                                if (keyName) {
                                    currentItem[keyName] = nextItem[keyName]
                                }
                            }
                            console.log(toJS(currentItem))
                        } else {
                            state.data[i] = nextItem
                        }
                    }
                }
            });
            console.log(nextState == prevState, nextState)
            return nextState;
        }

        return prevState
    }
    public state: IAutoListState<T> = { data: [] };
    public shouldComponentUpdate(nextProps: IAutoListProps<T>, nextState: IAutoListState<T>) {
        // if (nextState.data != this.state.data) {
        //     console.log("updateList", toJS(nextState.data))
        // }
        return nextState.data != this.state.data
    }
    public render() {
        const { itemFactory } = this.props;
        const { data = [] } = this.state;
        // /console.log('rerender', toJS(this.props.data), this.state.list)
        const list = data.length > 0 ? data.map(itemFactory) : null
        console.log('rerender', toJS(toJS(data)))
        return <React.Fragment>{list}</React.Fragment>
    }
}


export const OAutoList = observer(({ itemFactory, data = [] }: IAutoListProps) => {
    const list = data.length > 0 ? data.map(itemFactory) : null
    return <React.Fragment>{list}</React.Fragment>
})


export default AutoList;