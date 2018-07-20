export function getMember(target: any, keyList: string[], receiver?: any) {
    const result = {};
    keyList.forEach((key: string) => {
        result[key] = Reflect.get(target, key, receiver)
    })
    return result;
}