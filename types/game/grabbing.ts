import { Instance } from "./worldinstance";
import Player from "./player";
import RoomInstance from "./roominstance";
import GameObjectInstance from "./gameobjectinstance";

/**
 * A Grab function is a function that gets called when an object is grabbed.
 * 
 * It is not expected to return anything.
 */
export type Grab = ({ ply, inst, room, obj }: { ply: Player, inst: Instance, room: RoomInstance, obj?: GameObjectInstance }) => void;
