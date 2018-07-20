export class ActionRequest<T> {
    public value: T;
    public actionName: string;
    constructor(value: T, actionName: string) {
        this.value = value;
        this.actionName = actionName;
    }
}