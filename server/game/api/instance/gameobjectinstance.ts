import { Instance } from "./worldinstance";
import { MutableGameObject } from "../prototype/gameobject";
import Inventory from "../../inventory";

export default class GameObjectInstance {
    readonly forObject: MutableGameObject;
    readonly fromWorld: Instance;
    // Every object could potentially hold 10,000 other objects.
    readonly inventory: Inventory = new Inventory(10000);
    readonly moduleData: Map<string, any> = new Map();

    /**
     * Whether or not this container is open. Has no meaning if this is not
     * a container.
     */
    open: boolean = false;

    /**
     * Whether this container is currently locked. A container that is locked
     * cannot be opened by players. If a module modifies this, a player will be
     * able to open the object, even if they cannot pass the lock() check.
     */
    locked: boolean;

    constructor(obj: MutableGameObject, world: Instance) {
        this.forObject = obj;
        this.fromWorld = world;
        this.locked = obj.startsLocked;
    }
}