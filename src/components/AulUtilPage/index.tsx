// import Divider from '@material-ui/core/Divider';
// import List from '@material-ui/core/List';
// import { Container } from './container';
// import HttpService from 'src/shared/clientApi/http';
import { TextField } from '@material-ui/core';
import * as React from 'react';

export interface IAulUtilProps {
    children?: React.ReactNode | React.ReactNodeArray;
}

export interface IAulUtilState {
    [key: string]: any;
}

export default class AulUtilPage extends React.Component<IAulUtilProps, IAulUtilState> {
    constructor(props: IAulUtilProps) {
        super(props);
        this.state = {
            show: true,
            value: null,
            focus: false,
        }
    }
    public componentDidMount() {
        console.log("load")
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
        // const { value, focus } = this.state;
        return (
            <>
                <TextField 
                    id="standard-name"
                    label="路径1"
                    placeholder="请选择"
                    // className={classes.textField}
                    // value={this.state.name}
                    // onChange={this.handleChange('name')}
                    margin="normal"
                />
                <TextField 
                    id="standard-name"
                    label="路径2"
                    placeholder="请选择"
                    // className={classes.textField}
                    // value={this.state.name}
                    // onChange={this.handleChange('name')}
                    margin="normal"
                />
            </>
        );
    }
}