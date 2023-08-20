import md5 from "md5";
import GameObjectInstance from "../game/api/instance/gameobjectinstance";
import Player from "../game/player";
import RoomInstance from "../game/api/instance/roominstance";
import { Instance } from "../game/api/instance/worldinstance";
import { FindInstanceByID } from "./instancemanager";
import { LookupPlayerID } from "./players";

export class ModuleData {
    private name: string;
    
    constructor(name: string) {
        this.name = md5(name);
    }

    private key(k: string): string {
        return this.name + `-${k}`;
    }

    /**
     * identifier returns an identifier other parts of the program can use
     * for this module.
     * @returns an id
     */
    identifier(): string {
        return this.name;
    }

    /**
     * Attaches data to a player for this module. 
     * @argument ply a number representing the player id, or a Player object
     * @argument key a string that keys this specific information
     * 
     * @returns Error if the player cannot be found, otherwise undefined.
     */
    setOnPlayer(ply: number | Player, key: string, val: any): Error | undefined {
        let foundPly: Player | undefined = undefined;
        if (typeof(ply) === "number") {
            foundPly = LookupPlayerID(ply);
        }
        if (ply instanceof Player) {
            foundPly = ply;
        }

        if (!foundPly) {
            return Error("Failed to find Player.");
        }

        foundPly.moduleData.set(this.key(key), val);
        return undefined;
    }

    /**
     * Attaches data to a object for this module. 
     * @argument identifier a number and Instance reference for this Object, 
     * or a GameObjectInstance.
     * @argument key a string that keys this specific information
     * 
     * @returns Error if the object cannot be found, otherwise undefined.
     */
    setOnObject(identifier: {id: number, inst: Instance} | GameObjectInstance, key: string, val: any): Error | undefined {
        let foundObj: GameObjectInstance | undefined = undefined;
        if (typeof(identifier) === "object") {
            foundObj = ((identifier as any).inst as Instance).objectByID((identifier as any).id);
        }
        if (identifier instanceof GameObjectInstance) {
            foundObj = identifier;
        }

        if (!foundObj) {
            return Error("Failed to find Object.");
        }

        foundObj.moduleData.set(this.key(key), val);
        return undefined;
    }

    /**
     * Attaches data to a room for this module. 
     * @argument identifier a number and Instance reference for this Room, or a
     * RoomInstance.
     * @argument key a string that keys this specific information
     * 
     * @returns Error if the room cannot be found, otherwise undefined.
     */
    setOnRoom(identifier: {id: number, inst: Instance} | RoomInstance, key: string, val: any): Error | undefined {
        let foundRoom: RoomInstance | undefined = undefined;
        if (typeof(identifier) === "object") {
            foundRoom = ((identifier as any).inst as Instance).roomByID((identifier as any).id);
        }
        if (identifier instanceof RoomInstance) {
            foundRoom = identifier;
        }

        if (!foundRoom) {
            return Error("Failed to find Room.");
        }

        foundRoom.moduleData.set(this.key(key), val);
        return undefined;
    }

    /**
     * Attaches data to an Instance for this module. 
     * @argument inst a number representing an Instance id or an Instance
     * object.
     * @argument key a string that keys this specific information
     * 
     * @returns Error if the room cannot be found, otherwise undefined.
     */
    setOnInstance(inst: number | Instance, key: string, val: any): Error | undefined {
        let foundInst: Instance | undefined = undefined;
        if (typeof(inst) === "number") {
            foundInst = FindInstanceByID(inst);
        }
        if (inst instanceof Instance) {
            foundInst = inst;
        }

        if (!foundInst) {
            return Error("Failed to find Instance.");
        }

        foundInst.moduleData.set(this.key(key), val);
        return undefined;
    }


    /**
     * Retrieves information this module set on a Player.
     * @argument ply a number representing the player id, or a Player object
     * @argument key a string that keys this specific information
     * 
     * @returns the information, if found, undefined if not found, error if
     * player not found.
     */
    getForPlayer(ply: number |  Player, key: string): any | Error {
        let foundPly: Player | undefined = undefined;
        if (typeof(ply) === "number") {
            foundPly = LookupPlayerID(ply);
        }
        if (ply instanceof Player) {
            foundPly = ply;
        }

        if (!foundPly) {
            return Error("Failed to find Player.");
        }

        return foundPly.moduleData.get(this.key(key));
    }

    /**
     * Retrieves information this module set on an Object.
     * @argument identifier a number and Instance reference for this Object, 
     * or a GameObjectInstance.
     * @argument key a string that keys this specific information
     * 
     * @returns the information, if found, undefined if not found, error if
     * player not found.
     */
    getForObject(identifier: {id: number, inst: Instance} | GameObjectInstance, key: string): any | Error {
        let foundObj: GameObjectInstance | undefined = undefined;
        if (typeof(identifier) === "object") {
            foundObj = ((identifier as any).inst as Instance).objectByID((identifier as any).id);
        }
        if (identifier instanceof GameObjectInstance) {
            foundObj = identifier;
        }

        if (!foundObj) {
            return Error("Failed to find Object.");
        }

        return foundObj.moduleData.get(this.key(key));
    }

    /**
     * Retrieves information this module set on a Room.
     * @argument identifier a number and Instance reference for this Room, or a
     * RoomInstance.
     * @argument key a string that keys this specific information
     * 
     * @returns the information, if found, undefined if not found, error if
     * player not found.
     */
    getForRoom(identifier: {id: number, inst: Instance} | RoomInstance, key: string): any | Error {
        let foundRoom: RoomInstance | undefined = undefined;
        if (typeof(identifier) === "object") {
            foundRoom = ((identifier as any).inst as Instance).roomByID((identifier as any).id);
        }
        if (identifier instanceof RoomInstance) {
            foundRoom = identifier;
        }

        if (!foundRoom) {
            return Error("Failed to find Room.");
        }

        return foundRoom.moduleData.get(this.key(key));
    }

    /**
     * Retrieves information this module set on a Instance.
     * @argument inst a number representing an Instance id or an Instance
     * object.
     * @argument key a string that keys this specific information
     * 
     * @returns the information, if found, undefined if not found, error if
     * player not found.
     */
    getForInstance(inst: number | Instance, key: string): any | Error {
        let foundInst: Instance | undefined = undefined;
        if (typeof(inst) === "number") {
            foundInst = FindInstanceByID(inst);
        }
        if (inst instanceof Instance) {
            foundInst = inst;
        }

        if (!foundInst) {
            return Error("Failed to find Instance.");
        }

        return foundInst.moduleData.get(this.key(key));
    }
}