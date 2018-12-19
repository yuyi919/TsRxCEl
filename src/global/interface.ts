import '.'

interface IPrototype extends Object {
    [key: string]: any;
}
interface IClassConstructor extends Function {
    [key: string]: any;
}
declare global {
    export namespace Type {
        type Function = (...args: any[]) => void | any;
        type Prototype = IPrototype;
        type ClassConstructor = IClassConstructor;
    }
}