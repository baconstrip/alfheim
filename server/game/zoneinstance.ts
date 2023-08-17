import { Instance } from "./worldinstance";
import Inventory from "./inventory";
import { MutableZone } from "./zone";

export default class ZoneInstance {
    readonly forZone: MutableZone;
    readonly fromWorld: Instance;

    constructor(zone: MutableZone, world: Instance) {
        this.forZone = zone;
        this.fromWorld = world;
    }
}