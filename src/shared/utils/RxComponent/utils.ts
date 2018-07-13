export type ApplyFunction = (render: any, handler: ProxyHandler<any>, args: Array<any>) => any;
export const setProxy = (target: any, keyName: string, method: ApplyFunction): void => {
    const t = Reflect.get(target, keyName) || (() => undefined);
    Reflect.set(target, keyName, new Proxy(t, {
        apply: method
    }));
}