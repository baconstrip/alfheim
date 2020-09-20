import { Instance } from "./worldinstance";
import { MutableGameObject } from "./gameobject";
import Inventory from "./inventory";

export default class GameObjectInstance {
    readonly forObject: MutableGameObject;
    readonly fromWorld: Instance;
    // Every object could potentially hold 10,000 other objects.
    readonly inventory: Inventory = new Inventory(10000);

    /**
     * Whether or not this container is open. Has no meaning if this is not
     * a container.
     */
    open: boolean = false;

    constructor(obj: MutableGameObject, world: Instance) {
        this.forObject = obj;
        this.fromWorld = world;
    }
}