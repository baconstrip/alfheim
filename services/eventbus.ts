import { AlfEvent } from '../types/events';
import { $enum } from 'ts-enum-util';
import * as Messages from '../types/messages';

type _EventDict = Map<AlfEvent, Function[] | undefined>;

class EventBusType { 
    listeners!: _EventDict;

    constructor() {
        this.listeners = new Map();
        
        $enum(AlfEvent).map(v => {
            this.listeners.set(v, new Array());
        });
    }

    onEvent(e: AlfEvent, cb: Function): Function {
        this.listeners.get(e)?.push(cb);

        return () => {
            this.listeners.set(e,
                this.listeners.get(e)?.filter((x) => {
                return x == cb;
            }));
        }
    }

    dispatch(e: AlfEvent, args: any) {

        console.log('dispatching event ' + e);
        this.listeners.get(e)?.forEach((x) => {
            x(args, e);
        });
    }
}

// export default new _EventBusType();
export namespace EventBus {
    const _x = new EventBusType();
    /** 
     * Adds a listener for event e
     * 
     * Listeners accept two arguments, the first being arguments to the event
     * and the second is event type, if required.
     * @returns a callback that will remove the listener when called.
     */
    export function onEvent(e: AlfEvent, cb: Function): Function {
        return _x.onEvent(e, cb);
    }

    export function dispatch(e: AlfEvent, args?: any) {
        return _x.dispatch(e, args);
    }
}