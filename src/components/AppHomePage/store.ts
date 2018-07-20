import * as Rx from 'src/shared/utils/RxDecorator';
export class Store {
    @Rx.observable() public arr: number[] = [0];
    @Rx.observable() public arr2: any = {count:[1]};
    public member: any = Reflect.getMetadata('observable', this, 'arr');
    public length: number = 0;
    constructor(){
        console.log(this.member);
    }
    @Rx.action('add') public arrAdd(num: any){
        this.arr.push(this.arr.length);
        this.arr2.count.push(this.arr2.count.length);
        // console.log(this.size)
    }
    @Rx.computed() 
    public get size(): number {
        // this.arr = [];
        // this.arr.push(0);
        // // this.arr2.count.push(0);
        // this.length++;
        return this.arr2.count.length+this.arr.length;
    }
    @Rx.computed() 
    public get is(): boolean {
        // this.arr = [];
        // this.arr.push(0);
        // // this.arr2.count.push(0);
        // this.length++;
        return this.size%4==0;
    }
}