import { ActionRequest } from './Action';
import { keyName } from './interface';

export const addParamsName = (target: any, propertyName: string) => {
    const keysList: string[] = Reflect.getMetadata(keyName, target) || [];
    keysList.push(propertyName);
    Reflect.defineMetadata(keyName, keysList, target);
    return keysList;
}

export class Member<T> {
    public name: string;
    private value: T | null = null;
    constructor(target: any, name: string, value?: T) {
        addParamsName(target, name);
        this.name = name;
        this.value = value || null;
    }
    public setValue(request: ActionRequest<T> | T | null){
        if (request instanceof ActionRequest) {
            const { value, actionName } = request;
            console.warn(`通过[${actionName}]更新了[${this.name}], 上个值为${this.value}, 当前值为${value}`)
            this.value = value;
        } else if (this.value == null) {
            console.warn(`初始化[${this.name}], 当前值为${request}`)
            this.value = request;
        } else {
            console.error('你不能通过[初始化]或[action]以外的方式赋值：' + JSON.stringify(request))
        }
    }
    public getValue(){
        return this.value;
    }
}