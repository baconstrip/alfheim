import { runningDev } from '../lib/util';
import { InternalEvent } from './internalevent';
import { $enum } from 'ts-enum-util';

type __eventDict = Map<InternalEvent, Function[] | undefined>;

class __eventBusType { 
    listeners: __eventDict = new Map();

    constructor() {
        $enum(InternalEvent).map(v => {
            this.listeners.set(v, new Array());
        });
    }

    onEvent(e: InternalEvent, cb: Function): Function {
        this.listeners.get(e)?.push(cb);

        return () => {
            this.listeners.set(e,
                this.listeners.get(e)?.filter((x) => {
                return x != cb;
            }));
        }
    }

    dispatch(e: InternalEvent, args: any) {
        if (e != InternalEvent.RAW_MESSAGE_IN) {
            if (runningDev()) {
                console.log('Dispatching internal event ' + InternalEvent[e]);
            }
        }
        this.listeners.get(e)?.forEach((x) => {
            x(args, e);
        });
    }
}

export namespace InternalEventBus {
    const _x = new __eventBusType();
    /** 
     * Adds a listener for event e
     * 
     * Listeners accept two arguments, the first being arguments to the event
     * and the second is event type, if required.
     * 
     * Generally event listeners should only be added for integral server
     * behaviour, things like adding a player when they join, or input to the 
     * message proccessing pipeline. Addon modules should generally avoid using
     * the internal events, instead preferring to use the game events or action
     * events.
     * 
     * @returns a callback that will remove the listener when called.
     */
    export function onEvent(e: InternalEvent, cb: Function): Function {
        return _x.onEvent(e, cb);
    }

    /**
     * Invokes event handlers for an event synchronously. 
     * 
     * This should only be used by core server components, addon modules should
     * avoid invoking this.
     * 
     * @param e 
     * @param args 
     */
    export function dispatch(e: InternalEvent, args?: any) {
        return _x.dispatch(e, args);
    }
}