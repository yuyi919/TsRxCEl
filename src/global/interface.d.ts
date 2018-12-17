declare namespace Interface {
    export interface IPrototype extends Object {
        [key: string]: any;
    }
    export interface IClassConstructor extends Function {
        [key: string]: any;
    }
}
declare namespace Type {
    export type Function = (...args: any[]) => void | any;
    export type Prototype = Interface.IPrototype;
    export type ClassConstructor = Interface.IClassConstructor;
}
// export declare type Function = (...args: any[]) => any;