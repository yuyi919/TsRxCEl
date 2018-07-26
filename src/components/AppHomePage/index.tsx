import Button from "@material-ui/core/Button";
import * as React from "react";
import { interval } from "rxjs";
import { map } from "rxjs/operators";
import { FileDialog } from 'src/main/dialog';
import { ClientEventEmitter } from 'src/shared/clientApi';
import { LiteButton } from 'src/shared/components/Lite';
import { EventEmitter } from 'src/shared/utils';
import { RxcIf, RxcSwitch } from 'src/shared/utils/RxcLibrary';
import * as Rx from 'src/shared/utils/RxDecorator';
import { Store } from './store';
import * as styles from "./styles.scss";

export const Test = () => {
  return function (target: Type.ClassConstructor ) {
    return new Proxy(target, {
      construct(innerTarget: Type.ClassConstructor, argArray: any[], newTarget?: Type.ClassConstructor){
        console.log('Proxy----------------------');
        return Reflect.construct(innerTarget, argArray, newTarget);
      }
    }) as any;
  }
}

const store = new Store();
@Test()
class AppHomePage extends React.Component {
  public $show = interval(100000).pipe(map(num=>num%2!=0));
  public file: FileDialog = new FileDialog(true);
  public emit: ClientEventEmitter<any, any> = new ClientEventEmitter<any, any>('go');
  @Rx.create<number>((input: number) => {
    console.log(input)
    return input;
  })
  public onChanged: EventEmitter<string> | any;
  public state = {
    num: 0
  }
  public onClick2 = (e: any) => {
    this.emit.get('test').subscribe(console.warn);
    console.log(store);
    // this.file.openFile('test');
    // store.arrAdd(e);
    // store.arr = [];
    // setTimeout(()=>{
    //   console.log(store.is);
    // },1000);

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
            <RxcIf is={this.state.num%2==1}><li><LiteButton type='contained' color='primary' routerLink="/counter">Counter</LiteButton></li></RxcIf>
            <RxcIf is={2>0}><li><LiteButton type='contained' color='secondary' routerLink="/echartsTest">Echarts</LiteButton></li></RxcIf>
          </RxcSwitch></ol>
        </div>
      </>
    );
  }
}

export { AppHomePage };

