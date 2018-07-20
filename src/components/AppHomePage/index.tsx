import Button from "@material-ui/core/Button";
import * as React from "react";
import { interval } from "rxjs";
import { map } from "rxjs/operators";
import { LiteButton } from 'src/shared/components/Lite';
import { EventEmitter } from 'src/shared/utils';
import { RxcIf, RxcSwitch } from 'src/shared/utils/RxcLibrary';
import * as Rx from 'src/shared/utils/RxDecorator';
import { Store } from './store';
import * as styles from "./styles.scss";

const store = new Store();
class AppHomePage extends React.Component {
  public $show = interval(100000).pipe(map(num=>num%2!=0));
  @Rx.create<number>((input: number) => {
    console.log(input)
    return input;
  })
  public onChanged: EventEmitter<string> | any;
  public state = {
    num: 0
  }
  public onClick2 = (e: any) => {
    store.arrAdd(e);
    store.arr = [];
  }
  public onClick = (e: any) => {
    this.setState({num: this.state.num+1});
    this.onChanged = 0;
    console.log('===============================', this.onChanged);
  }
  public render() {
    console.log(this.state.num);
    return (
      <>
        <Button variant='contained' onClick={this.onClick2}>Player</Button>
        <div className={styles.container} onClick={this.onClick}>
          <RxcIf is={this.$show}>1</RxcIf>
          <ol><RxcSwitch>
            <RxcIf is={this.state.num%2==0}><li><LiteButton type='contained' color='primary' routerLink="/counter">Counter</LiteButton></li></RxcIf>
            <RxcIf is={2>0}><li><LiteButton type='contained' color='secondary' routerLink="/echartsTest/test">Echarts</LiteButton></li></RxcIf>
          </RxcSwitch></ol>
        </div>
      </>
    );
  }
}

export { AppHomePage };

