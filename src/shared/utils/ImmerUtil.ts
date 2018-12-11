import reduce from 'immer';

export interface IObjectMap<T> {
    [key: string]: T;
}
export namespace ImmerUtil {
    /**
     * 
     * @param target 目标object
     * @param updater 更新源object
     */
    export function MapUpdate<T extends object>(target: T, updater: T){
        return reduce(target as any, (inTarget: T) => {
            for (const key in updater) {
                if (inTarget != null) {
                    inTarget[key] = updater[key];
                }
            }
        })
    }
}