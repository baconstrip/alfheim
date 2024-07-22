import { MutableRoom } from "../prototype/room";
import Player from "../../player";
import { Instance } from "./worldinstance";
import { Direction } from "../../../../common/direction";
import Inventory from "../../inventory";

export default class RoomInstance {
    readonly forRoom: MutableRoom;
    readonly fromWorld: Instance;
    players: Set<Player> = new Set();
    paths: Map<Direction, RoomInstance> = new Map();
    moduleData: Map<string, any> = new Map();

    // Every room could potentially hold 10,000 objects.
    readonly inventory: Inventory = new Inventory(10000);

    constructor(room: MutableRoom, world: Instance) {
        this.forRoom = room;
        this.fromWorld = world;
    }
}