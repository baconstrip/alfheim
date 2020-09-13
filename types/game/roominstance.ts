import { MutableRoom } from "./room";
import Player from "./player";
import { Instance } from "./worldinstance";

export default class RoomInstance {
    readonly forRoom: MutableRoom;
    readonly fromWorld: Instance;
    players: Set<Player>;

    constructor(room: MutableRoom, world: Instance) {
        this.forRoom = room;
        this.fromWorld = world;
        this.players = new Set();
    }
}