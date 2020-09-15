import World, { MutableWorld } from "./world";
import Player from "./player";
import RoomInstance from "./roominstance";
import GameObjectInstance from "./gameobjectinstance";
import { PathDirection, GetSourceDirection, GetDestinationDirection } from "./direction";

export class Instance {
    readonly instName: string;
    readonly forWorld: MutableWorld;
    readonly rooms: Map<number, RoomInstance>;
    // This needs to be reworked to support inifinte items properly.
    readonly objects: Map<number, GameObjectInstance>;

    constructor(w: World, instName: string) {
        this.instName = instName;
        this.forWorld = w.toMutable();
        this.rooms = new Map();
        this.objects = new Map();

        this.forWorld.rooms.forEach((x) => {
            this.rooms.set(x.id, new RoomInstance(x, this));
        });
        this.forWorld.objects.forEach(x => {
            this.objects.set(x.id, new GameObjectInstance(x, this))
        });

        this.___createRoomGraph();
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

    /**
     * Generates a map of strings that correspond to things in this world with
     * a reference to what they refer to. 
     */
    WorldLexicon(): Map<string, Object> {
        let lexi: Map<string, Object> = new Map();
        lexi.set(this.forWorld.name, this);
        lexi.set(this.forWorld.name, this);
        this.rooms.forEach(x => lexi.set(x.forRoom.name, x));
        this.objects.forEach(x => lexi.set(x.forObject.name, x));
        return lexi;
    }

    ___createRoomGraph() {
        this.forWorld.paths.forEach(x => {
            this.AddPath(x.source, x.dest, x.direction);
        })
    }

    /**
     * AddPath dynamically adds a path to this World.
     */
    AddPath(a: number, b: number, direction: PathDirection) {
        const source = this.roomByID(a);
        const dest = this.roomByID(b);
        if (!source || !dest) {
            throw new Error('Bad definition creating Path');
        }
        source?.paths.set(GetSourceDirection(direction), dest);
        dest?.paths.set(GetDestinationDirection(direction), source);
    }
}