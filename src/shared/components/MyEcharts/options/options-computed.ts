import { combineLatest, merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, share, switchMap, takeUntil } from 'rxjs/operators';
import { EventEmitter } from '../../../utils';

export class OptionsObservableList<T> {
    public name: string | null;
    public obsList: Array<Observable<T> | null> | null;
    public onChanged: EventEmitter<Array<Observable<T> | null>>;
    public onDispose: EventEmitter<any>;
    constructor(name: string, obsList?: Array<Observable<T> | null>) {
        this.name = name;
        this.obsList = obsList || [];
        this.onDispose = new EventEmitter<any>();
        this.onChanged = new EventEmitter<any>();
    }

    /**
     * 添加、更新、注销obs清单中的某一项
     * @param index 更新用id，null表示添加
     * @param item option流，为Null时即注销
     */
    public setObsItem(index: number | null, item: Observable<T> | null): number | null{
        if(this.obsList){
            if (index != null) { 
                if(item !== this.obsList[index]){
                    this.obsList[index] = item;
                    this.change(this.obsList);
                }
                return index;
            } else {
                this.obsList.push(item);
                this.change(this.obsList);
                return this.obsList.length - 1;
            }
        } else {
            return null;
        }
    }

    /**
     * 
     * @param obsList changed obsList 
     */
    public change(obsList: Array<Observable<T> | null>): void {
        this.onChanged.emit(obsList);
    }
    /**
     * 获取最终obs
     */
    public getComputedObs(): Observable<{[key:string]: Array<T>}> {
        return merge(
            of(this.obsList),
            this.onChanged
        ).pipe(
            takeUntil(this.onDispose),
            map((obsList: Array<Observable<T> | null>) =>
                obsList.filter((obs: Observable<T> | null) => obs) as Array<Observable<T>>
            ),
            switchMap((obsList: Array<Observable<T>>) => {
                return merge(
                    of(null), // 确保一定能发送一个值
                    combineLatest(...obsList).pipe(takeUntil(this.onDispose))
                ).pipe(
                    distinctUntilChanged(),
                    takeUntil(this.onDispose),
                    map((list: Array<T>) => ({ [this.name || '$']: list }))
                )
            }),
            share()
        );
    }
    /**
     * 销毁
     */
    public dispose() {
        this.name = null;
        this.obsList = null;
        this.onDispose.emit(true);
        this.onDispose.dispose();
        this.onChanged.dispose();
    }
} 