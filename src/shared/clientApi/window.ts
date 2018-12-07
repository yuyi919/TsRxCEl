import { Observable } from "rxjs";
import { ClientEventEmitter } from "./ClientEventEmitter";

const service: ClientEventEmitter<boolean, boolean> = new ClientEventEmitter<boolean, boolean>("windowReload");

export const windowReload = (isForce?: boolean): Observable<boolean> => {
    return service.get(isForce || false);
}
