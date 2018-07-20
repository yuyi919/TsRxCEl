import 'reflect-metadata';
import { EventEmitter } from '../EventEmitter';
import { Member } from './Member';

export type ObserValue<T> = EventEmitter<T> | T;
export const keyName: string = 'keysList';
export const keyMapName: string = 'keysMap';

export function getTargetMember(target: any, keyList: string[], receiver?: any) {
    const result = {};
    keyList.forEach((key: string) => {
        result[key] = Reflect.get(target, key, receiver)
    })
    return result;
}

export const addParamsName = (target: any, member: Member<any>) => {
    // console.log(member);
    let keyCount = 0;
    const keySet: Set<string> = new Set<string>(Reflect.getMetadata(keyName, target) || []);
    keyCount = keySet.size;
    keySet.add(member.propertyName);
    if (keySet.size == keyCount) {
        throw new Error('不能设置同名member => ' + member.name);
    }
    Reflect.defineMetadata(keyName, Array.from(keySet), target);

    const keysMap: Map<string, Member<any>> = Reflect.getMetadata(keyMapName, target) || new Map<string, Member<any>>();
    keyCount = keysMap.size;
    keysMap.set(member.name || member.propertyName, member);
    if (keysMap.size == keyCount) {
        throw new Error('不能设置同名member => ' + member.name || member.propertyName);
    }
    Reflect.defineMetadata(keyMapName, keysMap, target);
    return keySet;
}

export function getMemberNames(target: any): string[] {
    return Reflect.getMetadata(keyName, target) || [];
}
export function getMembers(target: any): Map<string, Member<any>> {
    return Reflect.getMetadata(keyMapName, target) || new Map<string, Member<any>>();
}