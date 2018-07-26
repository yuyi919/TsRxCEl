// import Divider from '@material-ui/core/Divider';
// import List from '@material-ui/core/List';
// import { Container } from './container';
// import HttpService from 'src/shared/clientApi/http';
import { toJS } from 'mobx';
import { Provider } from 'mobx-react';
import * as React from 'react';
import Store, { MainFrame, MainFrameStore } from 'src/shared/components/Layout';

export interface IIndexProps {
    children?: React.ReactNode | React.ReactNodeArray;
    store?: MainFrameStore;
}

export interface IIndexState {
    [key: string]: any;
}

export default class IndexPage extends React.Component<IIndexProps, IIndexState> {
    constructor(props: IIndexProps) {
        super(props);
        this.state = {
            show: true,
            value: null,
            focus: false,
        }
    }
    public componentDidMount() {
        console.log(toJS(Store))
    }
    public onClick = () => {
        this.setState({ show: !this.state.show });
        // HttpService.getXml('www.baidu.com/s?word=node爬虫',{}).subscribe(response=>{
        //     console.log(response);
        // });
    }
    public onChange = (e: any) => {
        this.setState({ value: e.target.value });
    }

    public onFocus = () => this.setState({ focus: true })
    public onBlur = () => this.setState({ focus: false })

    public render() {
        const { children } = this.props;
        // const { value, focus } = this.state;
        return (
            <Provider store={Store}>
                <MainFrame>{children}</MainFrame>
                {/* <input value={value || (focus ? "" : "default")} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} />
                <Container>
                    <div>
                        <LiteButton type='contained' routerLink='/' onClick={this.onClick}> {this.state.show ? 'block' : 'none'} </LiteButton>
                    </div>
                </Container> */}
            </Provider>
        );
    }
}