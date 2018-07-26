import * as Rx from 'src/shared/utils/RxDecorator';
export class Store {
    @Rx.observable<Store>() public arr: number[] = [0];
    @Rx.observable<Store>() public arr2: any = {count:[1]};
    public length: number = 0;
    @Rx.action<Store>('add') public arrAdd(num: any){
        this.arr.push(this.arr.length);
        this.arr2.count.push(this.arr2.count.length);
        // console.log(this.size)
    }
    @Rx.computed<Store>() 
    public get size(): number {
        // this.arr = [];
        // this.arr.push(0);
        // // this.arr2.count.push(0);
        // this.length++;
        return this.arr2.count.length+this.arr.length;
    }
    @Rx.computed<Store>() 
    public get is(): boolean {
        // this.arr = [];
        // this.arr.push(0);
        // // this.arr2.count.push(0);
        // this.length++;
        return this.size%4==0;
    }
}