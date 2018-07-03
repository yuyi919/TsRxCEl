import * as deepmerge from 'deepmerge';

export const mergeOption: any = (oldOption: any, nextOption: any) => {
    if(oldOption && nextOption){
        return (deepmerge as any).default(oldOption,nextOption);
    } else {
        return Object.assign(oldOption,nextOption);
    }
}
export const merge: any = (pre: any, next: any) => {
    return (deepmerge as any).default(pre, next);
}