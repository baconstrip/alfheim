import { InternalEventBus } from "./internalevents"
import { InternalEvent } from "../types/internalevent"
import Player from "../types/game/player"
import { Instance } from "../types/game/worldinstance";
import World from "../types/game/world";
import { GameEventBus } from "./gameevents";
import { ActionEventBus } from "./actionevents";

// Singleton manager.
class InstanceManager {
    instances: Map<string, Instance> = new Map();
    defaultInstance: Instance;
    // TODO: make this monotomic across restarts
    highestIndex: number = 2;

    constructor(defaultInstance: Instance) {
        this.defaultInstance = defaultInstance;
        this.instances.set('default', defaultInstance);
    }
}
var ___inst: InstanceManager;

export default async (defaultWorld: Instance) => {
    ___inst = new InstanceManager(defaultWorld);
    // Default world binding adds a player to a world as soon as they join.
    InternalEventBus.onEvent(InternalEvent.POST_PLAYER_JOIN_LIVE, (ply: Player) => {
        // If the player is returning, skip adding to default world.
        if (___findPlayer(ply.authUser.id)) {
            console.log('Player returning: ' + ply.authUser.id);
            ply.___refreshUI();
            ply.sendMessage("Welcome back, we hope you enjoyed your hiatus");
            ply.sendMessage(ply.world()?.forWorld.joinMessage ?? '');
            return;
        }
        console.log('Adding player to default world: ' + ply.authUser.id);
        ___inst.defaultInstance.addPlayer(ply);
    });

    InternalEventBus.onEvent(InternalEvent.PLAYER_CLEANUP, (id: number) => {
        console.log('removing player from instances: ' + id);
        let ply = ___findPlayer(id);
        if (ply) {
            ply.world()?.removePlayer(ply);
            ply.location = undefined;
        }
    });
}

export function FindInstance(name: string): Instance | undefined {
    return ___inst.instances.get(name.toLowerCase());
}

export function FindInstanceByID(id: number): Instance | undefined {
    const found = [...___inst.instances].find(x => {
        return x[1].id == id;
    });
    return found ? found[1] : undefined;
}
 

export function CreateInstance(w: World, name: string): Instance {
    if (___inst.instances.get(name.toLowerCase())) {
        throw new Error("Duplicate instance name");
    }
    const newInst = new Instance(w, name, ___inst.highestIndex);
    ___inst.highestIndex++;
    ___inst.instances.set(name.toLowerCase(), newInst);

    GameEventBus.___addInstance(newInst.id);
    ActionEventBus.___addInstance(newInst.id);
    return newInst;
}

export function DefaultInstance(): Instance {
    return ___inst.defaultInstance;
}

function ___findPlayer(id: number): Player | undefined {
    for (let instance of ___inst.instances) {
        for (let room of instance[1].rooms) {
            for (let ply of room[1].players) {
                if (ply.authUser.id === id) {
                    return ply
                }
            }
        }
    }
    return undefined;
}
