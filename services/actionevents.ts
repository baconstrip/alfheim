import GameObjectInstance from "../types/game/gameobjectinstance";
import Player from "../types/game/player";
import { Instance } from "../types/game/worldinstance";
import { ProcessingStage } from "../types/processingstage";

type ActionEventHandlerArgs = {
    ply: Player,
    obj?: GameObjectInstance,
    inst: Instance,
    stage: ProcessingStage,

    msg?: any,
}

type ActionEventCallback = (a: ActionEventHandlerArgs) => boolean;

type __callbackEntry = {cb: ActionEventCallback, stage: ProcessingStage};
type __eventDict = Map<string, __callbackEntry[] | undefined>;

class __eventBusType { 
    globalListeners: __eventDict = new Map();
    instanceListeners: Map<number, __eventDict> = new Map();

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

    dispatch(e: string, stage: ProcessingStage, args: {ply: Player, obj?: GameObjectInstance, inst: Instance, msg?: any}): boolean {
        const cbArgs = {
            ply: args.ply,
            obj: args.obj,
            inst: args.inst,
            stage: stage,

            msg: args.msg,
        };
        const name = e.toLowerCase();
        console.log("Verb being dispatched")
        const globalCancel = this.globalListeners.get(name)?.filter(x => x.stage == stage).some((x) => {
            return x.cb(cbArgs) && stage == ProcessingStage.PRE;
        }) ?? false;

        if (globalCancel) {
            return true;
        }

        return this.instanceListeners.get(args.inst.id)?.get(name)?.filter(x => x.stage == stage).some((x) => {
            return x.cb(cbArgs) && stage == ProcessingStage.PRE;
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
    export function dispatch(e: string, stage: ProcessingStage, args: {ply: Player, obj?: GameObjectInstance, inst: Instance, msg?: any}): boolean {
        return _x.dispatch(e, stage, args);
    }

    export function ___addInstance(id: number) {
        _x.___addInstance(id);
    }
}