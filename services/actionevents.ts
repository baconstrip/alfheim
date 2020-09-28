import GameObjectInstance from "../types/game/gameobjectinstance";
import Player from "../types/game/player";
import { Instance } from "../types/game/worldinstance";
import { ProcessingStage } from "../types/processingstage";

type ActionEventArgs = {
    ply: Player,
    obj?: GameObjectInstance,
    inst: Instance,
    msg?: any,
}

function ___deriveKey(arg: ActionEventArgs, e: string): string {
    return `${e}-${arg.ply.authUser.username}-${arg.obj?.forObject.name}-${arg.inst.id}`;
}

type ActionEventHandlerArgs = {
    stage: ProcessingStage,
    action: string,
} & ActionEventArgs;

type ActionEventCallback = (a: ActionEventHandlerArgs) => boolean;

type __callbackEntry = {cb: ActionEventCallback, stage: ProcessingStage};
type __eventDict = Map<string, __callbackEntry[] | undefined>;

class __eventBusType { 
    globalListeners: __eventDict = new Map();
    instanceListeners: Map<number, __eventDict> = new Map();

    recursionGuard: Set<string> = new Set();

    constructor() {
    }

    globalOnEvent(e: string, stage: ProcessingStage, cb: ActionEventCallback): Function {
        const name = e.toLowerCase();
        const entry = {cb: cb, stage: stage};
        if (!this.globalListeners.get(name)) {
            this.globalListeners.set(name, new Array());
        }
        this.globalListeners.get(e)?.push(entry);

        return () => {
            this.globalListeners.set(e,
                this.globalListeners.get(e)?.filter((x) => {
                return x != entry;
            }));
        }
    }

    instanceOnEvent(e: string, inst: Instance | number, stage: ProcessingStage, cb: ActionEventCallback): Function {
        const name = e.toLowerCase();
        const entry = {cb: cb, stage: stage};
        const instanceID = (typeof inst == "number") ? inst : (inst as Instance).id;

        if (!this.instanceListeners.get(instanceID)) {
            this.instanceListeners.set(instanceID, new Map());
        }

        if (!this.instanceListeners.get(instanceID)?.get(name)) {
            this.instanceListeners.get(instanceID)?.set(name, new Array());
        }

        this.instanceListeners.get(instanceID)?.get(name)?.push(entry);

        return () => {
            this.instanceListeners.get(instanceID)?.set(name,
                    this.instanceListeners.get(instanceID)?.get(name)?.filter((x) => {
                        return x != entry;
                    })
                );
        };
    }

    dispatch(e: string, stage: ProcessingStage, args: ActionEventArgs): boolean {
        // If we already are in an event handler for this event, return.
        const key = ___deriveKey(args, e);
        if (this.recursionGuard.has(key)) {
            console.log("WARNING: event called recursively!");
            console.log(`\t${key}`);
            return false;
        }
        this.recursionGuard.add(key);
        const outcome = this.dispatch(e, stage, args);
        this.recursionGuard.delete(key);
        return outcome;
    }

    __swallowException(cb: ActionEventCallback, arg: ActionEventHandlerArgs): boolean {
        let cancel = false;
        try {
            cancel = cb(arg);
        } catch (e) {
            // Trim the internal portion of the stack trace, as it's likely 
            // not intersting.
            const stack = e.stack as string;
            let idx = stack.indexOf("at __eventBusType");
            if (idx == -1) {
                idx = stack.length;
            }
            const trimmedStack = stack.substr(0, idx);
            console.log(`Error in processing event handler, event with key ${___deriveKey(arg, arg.action)}: ${e}\n\n${trimmedStack}`);
        }

        return cancel;
    }

    dispatchInternal(e: string, stage: ProcessingStage, args: ActionEventArgs): boolean {
        const cbArgs = {
            ply: args.ply,
            obj: args.obj,
            inst: args.inst,
            stage: stage,

            msg: args.msg,
            action: e,            
        };
        const name = e.toLowerCase();

        const globalCancel = this.globalListeners.get(name)?.filter(x => x.stage == stage).some((x) => {
            return this.__swallowException(x.cb, cbArgs) && stage == ProcessingStage.PRE;
        }) ?? false;

        if (globalCancel) {
            return true;
        }

        return this.instanceListeners.get(args.inst.id)?.get(name)?.filter(x => x.stage == stage).some((x) => {
            return this.__swallowException(x.cb, cbArgs) && stage == ProcessingStage.PRE;
        }) ?? false;
    }

    ___addInstance(id: number) {
        this.instanceListeners.set(id, new Map());
    }
}

export namespace ActionEventBus {
    const _x = new __eventBusType();
    /** 
     * Adds a listener for event e
     * 
     * Listeners accept two arguments, the first being arguments to the event
     * and the second is event type, if required.
     * 
     * @returns a callback that will remove the listener when called.
     */
    export function globalOnEvent(e: string, stage: ProcessingStage, cb: ActionEventCallback): Function {
        return _x.globalOnEvent(e, stage, cb);
    }

    export function instanceOnEvent(e: string, inst: Instance | number, stage: ProcessingStage, cb: ActionEventCallback): Function {
        return _x.instanceOnEvent(e, inst, stage, cb);
    }

    /**
     * Invokes event handlers for an event synchronously. 
     * 
     * This should only be used by core server components, addon modules should
     * avoid invoking this.
     * 
     * This function will return true if it should be cancelled. Return can be
     * ignored for POST handler.
     */
    export function dispatch(e: string, stage: ProcessingStage, args: ActionEventArgs): boolean {
        return _x.dispatch(e, stage, args);
    }

    export function ___addInstance(id: number) {
        _x.___addInstance(id);
    }
}