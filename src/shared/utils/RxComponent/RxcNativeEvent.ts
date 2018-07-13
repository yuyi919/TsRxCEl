import { RxcEventType } from './interface';
import { IRxcEvent } from './RxComponentBasic';
/**
 * 
 */
export class RxcNativeEvent {
    public e: any;
    public args: Array<any>;
    constructor(event: IRxcEvent){
        const { args, ...e } = event;
        this.e = {...e, typeStr: RxcEventType[event.type]};
        this.args = args;
    }
    public getInstance(){
        return this.e.instance;
    }
}
