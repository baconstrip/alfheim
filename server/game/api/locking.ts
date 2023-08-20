import { Instance } from "./instance/worldinstance";
import Player from "../player";
import RoomInstance from "./instance/roominstance";
import GameObjectInstance from "./instance/gameobjectinstance";

/**
 * A lock function determines whether a player can open a container or pass a
 * path. It returns true or false, false means that the subject remains locked,
 * the player's action will not succeed.
 * 
 * Called with the player, the instance they're in, the room they're in, and 
 * potentially the object they're trying to open.
 * 
 * Locking functions that return false are expected to interact with the
 * player, explaining that they were unable to perform the action they 
 * attempted.
 */
export type Lock = ({ply, inst, room, obj}: {ply: Player, inst: Instance, room: RoomInstance, obj?: GameObjectInstance}) => boolean;
