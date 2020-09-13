import { Instance } from "./worldinstance";
import { MutableGameObject } from "./gameobject";

export default class GameObjectInstance {
    readonly forObject: MutableGameObject;
    readonly fromWorld: Instance;

    constructor(obj: MutableGameObject, world: Instance) {
        this.forObject = obj;
        this.fromWorld = world;
    }
}