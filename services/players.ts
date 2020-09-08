import Player from "../types/game/player";
import { EventBus } from "./eventbus";
import { AlfEvent } from "../types/events";
import { AuthUser } from "../models/User";

// Singleton manager.
class PlyManager {
    players: Map<string, Player>;
    playersById: Map<number, Player>;
    constructor() {
        this.players = new Map();
        this.playersById = new Map();
    }
}
var ___inst: PlyManager;

export default async ({ }) => {
    ___inst = new PlyManager();
    console.log('created players')

    EventBus.onEvent(AlfEvent.PLAYER_LOGIN, (u: AuthUser) => {
        const ply = new Player();
        ply.authUser = u;
        ___inst.players.set(u.username, ply);
        ___inst.playersById.set(u.id, ply);
    });

    EventBus.onEvent(AlfEvent.PLAYER_JOIN_LIVE, (info: any) => {
        const id = info.id;
        const ply = ___inst.playersById.get(id);
        if (!ply) {
            return;
        }
        console.log('Assigning player soc')
        ply.soc = info.soc;
    });

    EventBus.onEvent(AlfEvent.PLAYER_DISCONNECT_LIVE, (ply: Player) => {
        ply.soc = undefined;
    })

    EventBus.onEvent(AlfEvent.PLAYER_CLEANUP, (id: number) => {
        const ply = ___inst.playersById.get(id);
        const name = ply?.authUser.username;
        // TODO: Add event priority so this can be handled properly
        //ply?.___reset();
    })
}

export function LookupPlayer(name: string): Player | undefined {
    return ___inst.players.get(name);
}

export function LookupPlayerId(id: number): Player | undefined {
    return ___inst.playersById.get(id);
}

/**
 * Broadcast is used to message all players connected, regardless of instance.
 *  
 * @param msg An HTML encoded message to send to players
 */
export function Broadcast(msg: string) {
    ___inst.players.forEach((x) => x.sendMessage(msg));
}