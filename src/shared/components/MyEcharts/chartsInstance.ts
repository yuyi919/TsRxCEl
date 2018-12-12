import { ECharts } from 'echarts';
import { action, observable } from 'mobx';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventEmitter } from '../../utils/EventEmitter';

export class ChartsInstance {
    @observable 
    public chartsInstance: ECharts | undefined;
    @observable
    public isTimeLine: boolean | undefined;
    public chartsDestroy: EventEmitter<any> = new EventEmitter<any>();
    public constructor(event: any) {
        this.setInstance(event);
        fromEvent(window,'resize').pipe(
            takeUntil(this.chartsDestroy)
        )
    }
    @action 
    public setInstance(chartsInstance: any) {
        this.chartsInstance = chartsInstance;
    }
    @action 
    public destroy() {
        this.isTimeLine = undefined;
        this.chartsInstance = undefined;
        this.chartsDestroy.emit(null);
        this.chartsDestroy.dispose();
    }
    public resize(){
        if(this.chartsInstance){
            this.chartsInstance.resize();
        }
    }
    public dispose(){
        if(this.chartsInstance){
            this.chartsInstance.dispose();
            this.chartsInstance = undefined;
        }
    }
}