import World from "./world";
import Player from "./player";
import RoomInstance from "./roominstance";

export class Instance {
    readonly instName: string;
    readonly forWorld: World;
    readonly rooms: Map<number, RoomInstance>;

    constructor(w: World, instName: string) {
        this.instName = instName;
        this.forWorld = w;
        this.rooms = new Map();

        this.forWorld.rooms.forEach((x) => {
            this.rooms.set(x.id, new RoomInstance(x, this));
        });
    }

    /**
     * Looks up a room by its ID, returns undefined if it's not found.
     * @param id 
     */
    roomByID(id: number): RoomInstance | undefined {
        return this.rooms.get(id);
    }

    /**
     * Looks up a room by its name, case sensitive. Prefer roomByID 
     * @param name 
     */
    roomByName(name: string): RoomInstance | undefined {
        return [...this.rooms.entries()].map((x) => x[1]).find((x) => x.forRoom.name == name)
    }

    /**
     * Returns a Set containing all players in the instance.
     */
    players(): Set<Player> {
        const filtered = [...this.rooms.entries()].map((x) => { return x[1] } );
        return filtered.reduce((acc, x) => new Set([...acc, ...x.players]), new Set<Player>())
    }

    /**
     * Binds a player to this instance. The player should not be part of any 
     * other instances before calling this.
     * 
     * @param ply The player to add to the instance
     */
    addPlayer(ply: Player) {
        ply.sendMessage(this.forWorld.joinMessage);
        ply.___spawnPlayer(this.rooms.get(this.forWorld.defaultRoom));
    }

    removePlayer(ply: Player) {
        ply.sendMessage("Leaving this world...");
        ply.location?.players.delete(ply);
    }

    /**
     * Broadcasts a message to all players in the instance. Accepts HTML.
     * @param msg 
     */
    Broadcast(msg: string) {
        this.players().forEach(ply => ply.sendMessage(msg));
    }
}