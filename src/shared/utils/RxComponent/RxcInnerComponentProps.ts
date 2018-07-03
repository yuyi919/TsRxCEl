import { Observable } from 'rxjs';
import { RxcNativeEvent } from './RxcNativeEvent';
/**
 * 传入RxComponentEvent的属性(Props)接口
 */
export abstract class RxcInnerComponentProps {
    public onInit?: Observable<RxcNativeEvent>;
    public onNextProps?: Observable<RxcNativeEvent>;
    public onChanges?: Observable<RxcNativeEvent>;
    public onDestroy?: Observable<RxcNativeEvent>;
}