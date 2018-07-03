/**
 * RxComponent事件类型枚举
 */
export enum RxcEventType {
    Custom,
    DidMount,
    DidUpdate,
    WillUnmount,
    InnerMount,
    InnerUnmount
} 
/**
 * RxComponent事件类型数组
 */
export const rxcEventTypes: Array<RxcEventType> = [
    RxcEventType.DidMount,
    RxcEventType.DidUpdate,
    RxcEventType.WillUnmount,
    RxcEventType.InnerMount,
    RxcEventType.InnerUnmount
];
export default rxcEventTypes;

/** RxcEvent集合类型
 */
export type RxcEventGroup = Map<RxcEventType, any>;