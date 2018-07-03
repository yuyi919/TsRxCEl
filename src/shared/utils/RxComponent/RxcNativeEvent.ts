import { IRxcEvent } from './RxComponentBasic';
/**
 * 
 */
export class RxcNativeEvent {
    public e: any;
    public args: Array<any>;
    constructor(event: IRxcEvent){
        const { args, ...e } = event;
        this.e = e;
        this.args = args;
    }
    public getInstance(){
        return this.e.instance;
    }
}
