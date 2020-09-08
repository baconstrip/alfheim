import { EventBus } from "./eventbus"
import { AlfEvent } from "../types/events"
import Player from "../types/game/player"
import { Instance } from "../types/game/worldinstance";

// Singleton manager.
class InstanceManager {
    instances: Map<string, Instance>;
    defaultWorld: Instance;
    constructor(defaultWorld: Instance) {
        this.instances = new Map();
        this.defaultWorld = defaultWorld;
        this.instances.set('default', defaultWorld);
    }
}
var inst: InstanceManager;

export default async (defaultWorld: Instance) => {
    inst = new InstanceManager(defaultWorld);
    // Default world binding adds a player to a world as soon as they join.
    EventBus.onEvent(AlfEvent.POST_PLAYER_JOIN_LIVE, (ply: Player) => {
        // If the player is returning, skip adding to default world.
        if (___findPlayer(ply.authUser.id)) {
            console.log('Player returning: ' + ply.authUser.id);
            ply.___refreshUI();
            ply.sendMessage("Welcome back, we hope you enjoyed your hiatus");
            ply.sendMessage(ply.location?.fromWorld.forWorld.joinMessage ?? '');
            return;
        }
        console.log('Adding player to default world: ' + ply.authUser.id);
        inst.defaultWorld.addPlayer(ply);
    });

    EventBus.onEvent(AlfEvent.PLAYER_CLEANUP, (id: number) => {
        console.log('removing player from instances: ' + id);
        let ply = ___findPlayer(id);
        if (ply) {
            ply.location?.fromWorld.removePlayer(ply);
            ply.location = undefined;
        }
    });
}

function ___findPlayer(id: number): Player | undefined {
    for (let instance of inst.instances) {
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