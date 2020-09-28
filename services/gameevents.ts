import { GameEvent } from '../types/gameevent';
import { $enum } from 'ts-enum-util';
import { stableHash } from '../lib/util';
import { Instance } from '../types/game/worldinstance';
import { ProcessingStage } from '../types/processingstage';
import Player from '../types/game/player';
import GameObjectInstance from '../types/game/gameobjectinstance';
import players from './players';

type GameEventArgs = {
    ply?: Player, 
    obj?: GameObjectInstance, 
    inst?: Instance, 
    msg?: any
}

function ___deriveKey(arg: GameEventArgs, e: GameEvent): string {
    return `${e}-${arg.ply?.authUser.username}-${arg.obj?.forObject.name}-${arg.inst?.id}`;
}

export type GameEventHandlerArgs = {
    stage: ProcessingStage,
    event: GameEvent,
} & GameEventArgs;

type GameEventCallback = (a: GameEventHandlerArgs) => boolean;

type __callbackEntry = {cb: GameEventCallback, stage: ProcessingStage};
type __eventDict = Map<GameEvent, __callbackEntry[] | undefined>;

class __eventBusType { 
    globalListeners: __eventDict = new Map();
    instanceListeners: Map<number, __eventDict> = new Map();

    recursionGuard: Set<string> = new Set();

    constructor() {
        $enum(GameEvent).map(v => {
            this.globalListeners.set(v, new Array());
        });
    }

    globalOnEvent(e: GameEvent, stage: ProcessingStage, cb: GameEventCallback): Function {
        const entry = {cb: cb, stage: stage};
        if (!this.globalListeners.get(e)) {
            this.globalListeners.set(e, new Array());
        }

        this.globalListeners.get(e)?.push(entry);

        return () => {
            this.globalListeners.set(e,
                this.globalListeners.get(e)?.filter((x) => {
                    return x != entry;
            }));
        }
    }
    
    instanceOnEvent(e: GameEvent, inst: Instance | number, stage: ProcessingStage, cb: GameEventCallback): Function {
        const entry = {cb: cb, stage: stage};
        const instanceID = (typeof inst == "number") ? inst : (inst as Instance).id;

        if (!this.instanceListeners.get(instanceID)) {
            this.instanceListeners.set(instanceID, new Map());
        }

        if (!this.instanceListeners.get(instanceID)?.get(e)) {
            this.instanceListeners.get(instanceID)?.set(e, new Array());
        }

        this.instanceListeners.get(instanceID)?.get(e)?.push(entry);

        return () => {
            this.instanceListeners.get(instanceID)?.set(e,
                    this.instanceListeners.get(instanceID)?.get(e)?.filter((x) => {
                        return x != entry;
                    })
                );
        };
    }

    dispatch(e: GameEvent, stage: ProcessingStage, args: GameEventArgs): boolean {
        const key = ___deriveKey(args, e);
        if (this.recursionGuard.has(key)) {
            console.log("WARNING: event called recursively!");
            console.log(`\t${key}`);
            return false;
        }
        this.recursionGuard.add(key);
        const outcome = this.dispatchInternal(e, stage, args);
        this.recursionGuard.delete(key); 
        return outcome;
    }

    __swallowException(cb: GameEventCallback, arg: GameEventHandlerArgs): boolean {
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
            console.log(`Error in processing event handler, event with key ${___deriveKey(arg, arg.event)}: ${e}\n\n${trimmedStack}`);
        }

        return cancel;
    }

    dispatchInternal(e: GameEvent, stage: ProcessingStage, args: GameEventArgs): boolean {
        const cbArgs = {
            ply: args.ply,
            obj: args.obj,
            inst: args.inst,
            stage: stage,

            msg: args.msg,
        } as GameEventHandlerArgs;

        // Try multiple sources for the instance, leave undefined if none 
        // apply.
        const inst = args.inst ?? args.ply?.world() ?? args.obj?.fromWorld ?? undefined;

        // Process event handlers unless one of them returns true to cancel.
        const globalCancel = this.globalListeners.get(e)?.filter(x => x.stage == stage).some((x) => {
            return this.__swallowException(x.cb, cbArgs) && stage == ProcessingStage.PRE;
        }) ?? false;

        if (!inst) {
            return globalCancel;
        }

        if (globalCancel) {
            return true;
        }

        return this.instanceListeners.get(inst.id)?.get(e)?.filter(x => x.stage == stage).some((x) => {
            return this.__swallowException(x.cb, cbArgs) && stage == ProcessingStage.PRE;
        }) ?? false;
    }

    // registerGlobalEvent(module: string, e: number) {
    //     const eventID = stableHash(module, e);
    //     this.globalListeners.set(eventID as GameEvent, new Array());
    // }

    ___addInstance(id: number) {
        this.instanceListeners.set(id, new Map());
    }
}

export namespace GameEventBus {
    const _x = new __eventBusType();
    /** 
     * Adds a listener for GameEvent e
     * 
     * Listeners accept two arguments, the first being arguments to the event
     * and the second is event type, if required.
     * 
     * @returns a callback that will remove the listener when called.
     */
    export function globalOnEvent(e: GameEvent, stage: ProcessingStage, cb: GameEventCallback): Function {
        return _x.globalOnEvent(e, stage, cb);
    }

    export function instanceOnEvent(e: GameEvent, inst: Instance | number, stage: ProcessingStage, cb: GameEventCallback): Function {
        return _x.instanceOnEvent(e, inst, stage, cb);
    }

    /**
     * Invokes event handlers for an event synchronously. 
     * 
     * This should only be used by core server components for core gameplay, 
     * addon modules should only invoke this for their custom events. 
     * 
     * This function will return true if it should be cancelled. Return can be
     * ignored for POST handler.
     */
    export function dispatch(e: GameEvent, stage: ProcessingStage, args: GameEventArgs): boolean {
        return _x.dispatch(e, stage, args);
    }

    /**
     * Adds a new event type to the game. Modules are free to declare their own
     * event types, and use them here.
     * 
     * @argument module the canonical name of the module, used to prevent 
     * overlap. 
     */
    // export function registerGlobalEvent(module:string, e: number) {
    //     _x.registerGlobalEvent(module, e);
    // }

    export function ___addInstance(id: number) {
        _x.___addInstance(id);
    }
}