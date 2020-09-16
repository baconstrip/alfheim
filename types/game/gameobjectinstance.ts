import { Instance } from "./worldinstance";
import { MutableGameObject } from "./gameobject";
import Inventory from "./inventory";

export default class GameObjectInstance {
    readonly forObject: MutableGameObject;
    readonly fromWorld: Instance;
    // Every object could potentially hold 10,000 other objects.
    readonly inventory: Inventory = new Inventory(10000);

    constructor(obj: MutableGameObject, world: Instance) {
        this.forObject = obj;
        this.fromWorld = world;
    }
}