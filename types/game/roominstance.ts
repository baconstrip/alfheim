import { MutableRoom } from "./room";
import Player from "./player";
import { Instance } from "./worldinstance";
import { Direction } from "./direction";

export default class RoomInstance {
    readonly forRoom: MutableRoom;
    readonly fromWorld: Instance;
    players: Set<Player> = new Set();
    paths: Map<Direction, RoomInstance> = new Map();

    constructor(room: MutableRoom, world: Instance) {
        this.forRoom = room;
        this.fromWorld = world;
    }
}