export type List<T> = (func: Cons<T>) => List<T>
export type Cons<T> = (left: List<T> | T, right: List<T> | T) => List<T>;
export type LParam<T> = List<T> | T;

export class LispScript<T> {
    /**
     * 返回列表函数, 使left,right一直保存在内存中
     * @param left 
     * @param right 
     */
    public cons(left: LParam<T>, right: LParam<T>): List<T> {
        return (f: Cons<T>) => f(left, right)
    }
    /**
     * 实例化高阶函数f，取left值
     * @param listL 
     */
    public car(list: LParam<T>): LParam<T> {
        return (list instanceof Function) ? list(
            (left: List<T>, right) => left
        ) : list;
    }
    /**
     * 实例化高阶函数f，取right值
     * @param listR 
     */
    public cdr(list: LParam<T>): LParam<T> {
        return (list instanceof Function) ? list(
            (left, right: List<T>) => right
        ) : list;
    }
}

console.time('a')
const { cons, car, cdr } = new LispScript<number>();
const l = cons(1, cons(2, 3));
const a = car(l);// 1
console.log(a);
const b = car(cdr(l));// 2 
console.timeEnd('a')
console.log(b,cdr(l));
