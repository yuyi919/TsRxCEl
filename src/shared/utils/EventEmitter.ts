import { Observable, Observer, Subscription } from 'rxjs';
import { share } from 'rxjs/operators';

export type NextEvent<T> = (value: T) => void;
export type ErrorEvent<T> = (error: any) => void;
export type CompletedEvent<T> = () => void;

export class EventEmitter<T> extends Observable<T> {
    private observer: Observer<T> | null | undefined;
    private sub: Subscription | null;
    private lastValue: T | null;
    constructor(next?: NextEvent<T>, error?: ErrorEvent<T>, completed?: CompletedEvent<T>) {
        super();
        this.source = new Observable(
            (observer: Observer<T>) => {
                this.observer = observer; 
            }
        ).pipe(share());
        if(next){
            this.sub = this.source.subscribe(next,error,completed);
        }
    }
    /**
     * 发射值
     * @param value
     */
    public emit(value: T) {
        if(this.observer){
            this.observer.next(value);
            this.lastValue = value;
        }
    }
    /**
     * 发射单一值
     * @param value
     */
    public once(value: T){
        this.emit(value);
        this.dispose();
        this.lastValue = value;
    }
    public error(error: any){
        if(this.observer){
            this.observer.error(error);
        }
    }
    /**
     * 注销
     */
    public dispose() {
        if(this.sub && !this.sub.closed){
            this.sub.unsubscribe();
            this.sub = null;
        }
        if(this.observer && !this.observer.closed){
            this.observer.complete();
            this.observer = null;
        }
        if(this.source){
            this.source = null!;
        }
    }
    /**
     * 设置条件注销
     * @param emit 条件obs，发射任意值即注销
     */
    public takeUntil(emit: Observable<any>) {
        emit.subscribe(this.dispose);
        return this;
    }

    public getLastValue(){
        return this.lastValue;
    }
}