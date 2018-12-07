import { Observable } from "rxjs";
import { ClientEventEmitter } from "./ClientEventEmitter";

const service: ClientEventEmitter<boolean, boolean> = new ClientEventEmitter<boolean, boolean>("windowReload");
const service2: ClientEventEmitter<boolean, boolean> = new ClientEventEmitter<boolean, boolean>("windowReCreate");

export const windowReload = (isForce?: boolean): Observable<boolean> => {
    return service.get(isForce || false);
}

export const windowReCreate = (isForce?: boolean): Observable<boolean> => {
    return service2.get(isForce || false);
}
