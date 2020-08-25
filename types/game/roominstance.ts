import Room from "./room";
import Player from "./player";
import { Instance } from "./worldinstance";

export default class RoomInstance {
    readonly forRoom: Room;
    readonly fromWorld: Instance;
    players: Set<Player>;

    constructor(room: Room, world: Instance) {
        this.forRoom = room;
        this.fromWorld = world;
        this.players = new Set();
    }
}