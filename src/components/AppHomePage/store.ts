import { Observable } from 'rxjs';
import * as Rx from 'src/shared/utils/RxDecorator';
export class Store {
    @Rx.observable() public arr: any[] = [];
    @Rx.observable() public arr2: any = {count:[]};
    @Rx.observable() public test: Observable<string> = new Observable<string>();
    @Rx.action() public arrAdd(num: any){
        console.log(this,this.arr)
        this.arr.push(num);
        this.arr2.count.push(num);
    }
}