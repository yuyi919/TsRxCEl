import 'reflect-metadata';
import { distinctUntilChanged } from 'rxjs/operators';
import { EventEmitter } from '../EventEmitter';


export function create<T>(sub: (input: T) => T, type?: any): (...args: any[]) => void {
    return function eventEmitter(target: any, propertyName: string) {
        const emitter: EventEmitter<T> = new EventEmitter<T>(sub);
        const memberType = Reflect.getMetadata('design:type', target, 'name');
        console.log(propertyName, memberType, target.constructor);
        const log: EventEmitter<any> = new EventEmitter<any>();
        log.pipe(
            distinctUntilChanged()
        ).subscribe(console.log); 

        console.log(Reflect.getMetadataKeys(target));
        Reflect.defineProperty(target, propertyName, {
            configurable: true,
            enumerable: true,
            get: (): EventEmitter<T> => {
                log.emit({ type: 'get', emitter });
                return emitter;
            },
            set: (value: T): void => {
                log.emit({ type: 'set', value });
                emitter.emit(value);
            }
        })
        console.log(Reflect.getOwnPropertyDescriptor(target, propertyName));
    }
}