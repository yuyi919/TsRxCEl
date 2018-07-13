import * as React from 'react';
import { LiteButton } from '../shared/components';
import * as Lite from '../shared/components/Lite';
import HttpService from '../shared/utils/Net/http';
import { Container } from './container';
export interface IIndexProps {
    children?: React.ReactNode | React.ReactNodeArray;
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
            focus: false
        }
    }
    public onClick = () => {
        this.setState({ show: !this.state.show });
        HttpService.getXml('www.baidu.com/s?word=node爬虫',{}).subscribe(response=>{
            console.log(response);
        });
    }
    public onChange = (e: any) => {
        this.setState({ value: e.target.value });
    }
    public onFocus = () => this.setState({ focus: true })
    public onBlur = () => this.setState({ focus: false })
    public render() {
        const { children } = this.props;
        const { value, focus } = this.state;
        return (
            <>
                <Lite.TopBar title='test' />
                {children}
                <input value={value || (focus ? "" : "default")} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} />
                <Container>
                    <div>
                        <LiteButton type='contained' routerLink='/' onClick={this.onClick}> {this.state.show ? 'block' : 'none'}} </LiteButton>
                    </div>
                </Container>
            </>
        );
    }
}
