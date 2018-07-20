import 'reflect-metadata';
import { EventEmitter } from '../EventEmitter';

export type ObserValue<T> = EventEmitter<T> | T;
export const keyName: string = 'keysList';

export function getMember(target: any, keyList: string[], receiver?: any) {
    const result = {};
    keyList.forEach((key: string) => {
        result[key] = Reflect.get(target, key, receiver)
    })
    return result;
}

export const addParamsName = (target: any, propertyName: string) => {
    const keysList: string[] = Reflect.getMetadata(keyName, target) || [];
    keysList.push(propertyName);
    Reflect.defineMetadata(keyName, keysList, target);
    return keysList;
}