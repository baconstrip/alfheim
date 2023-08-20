import World, { MutableWorld } from "../prototype/world";
import * as Messages from '../../../../common/messages';
import Player from "../../player";
import RoomInstance from "./roominstance";
import GameObjectInstance from "./gameobjectinstance";
import { PathDirection, GetSourceDirection, GetDestinationDirection } from "../../direction";
import { WorldEntityType } from "../worldentitytype";
import Inventory from "../../inventory";
import ZoneInstance from "./zoneinstance";
import _ from "lodash";
import { GameEventBus } from "../../../events/gameevents";
import { GameEvent } from "../../../events/gameevent";
import { ProcessingStage } from "../../../events/processingstage";

export class Instance {
    readonly id: number;
    readonly instName: string;
    readonly forWorld: MutableWorld;
    readonly rooms: Map<number, RoomInstance>;
    // This needs to be reworked to support inifinte items properly.
    readonly objects: Map<number, GameObjectInstance>;
    readonly zones: Map<number, ZoneInstance>;
    readonly moduleData: Map<string, any> = new Map();

    constructor(w: World, instName: string, id: number) {
        this.id = id;
        this.instName = instName;
        this.forWorld = w.toMutable();
        this.rooms = new Map();
        this.objects = new Map();
        this.zones = new Map();

        this.forWorld.rooms.forEach((x) => {
            this.rooms.set(x.id, new RoomInstance(x, this));
        });
        this.forWorld.objects.forEach(x => {
            this.objects.set(x.id, new GameObjectInstance(x, this));
        });
        this.forWorld.zones.forEach(x => {
            this.zones.set(x.id, new ZoneInstance(x, this));
        });

        // Put objects in the place after rooms and objects, so order doesn't 
        // matter.
        this.objects.forEach(x => {
            if (x.forObject.inContainer) {
                this.objects.get(x.forObject.inContainer)?.inventory.addItem(x);
                return;
            }
            if (x.forObject.inRoom) {
                this.rooms.get(x.forObject.inRoom)?.inventory.addItem(x);
                return;
            }
        });

        this.___createRoomGraph();
    }

    /**
     * Looks up a room by its ID, returns undefined if it's not found.
     */
    roomByID(id: number): RoomInstance | undefined {
        return this.rooms.get(id);
    }

    /**
     * Looks up a room by its name, case insensitive. Prefer roomByID 
     */
    roomByName(name: string): RoomInstance | undefined {
        return [...this.rooms.entries()].map((x) => x[1]).find((x) => x.forRoom.name.toLowerCase() == name.toLowerCase());
    }

    /**
     * Looks up an object by its name, case insensitive. Prefer objectByID.
     */
    objectByName(name: string): GameObjectInstance | undefined {
        return [...this.objects.entries()].map((x) => x[1]).find((x) => x.forObject.name.toLowerCase() == name.toLowerCase());
    }

    objectByID(id: number): GameObjectInstance | undefined {
        return this.objects.get(id);
    }

    zoneByName(name: string): ZoneInstance | undefined {
        return [...this.zones.entries()].map((x) => x[1]).find((x) => x.forZone.name.toLowerCase() == name.toLowerCase());
    }
    zoneByID(id: number): ZoneInstance | undefined {
        return this.zones.get(id);
    }

    findObjectHolder(id: number): Inventory | undefined {
        for (let [_, room] of this.rooms) {
            for (let obj of room.inventory.contents) {
                if (obj.forObject.hidden) {
                    continue;
                }

                if (obj.forObject.id == id) {
                    return room.inventory;
                }
                
                for (let innerObj of obj.inventory.contents) {
                    if (innerObj.forObject.hidden) {
                        continue;
                    }
                    if (innerObj.forObject.id == id) {
                        return obj.inventory;
                    }
                }
            }
        }

        for (let ply of this.players()) {
            for (let obj of ply.inventory.contents) {
                if (obj.forObject.id == id) {
                    return ply.inventory;
                }
            }
        }
        return undefined;
    }

    /**
     * Returns a Set containing all players in the instance.
     */
    players(): Set<Player> {
        const filtered = [...this.rooms.entries()].map((x) => { return x[1] } );
        return filtered.reduce((acc, x) => new Set([...acc, ...x.players]), new Set<Player>())
    }

    /**
     * Binds a player to this instance. The player should not be part of any 
     * other instances before calling this.
     * 
     * @param ply The player to add to the instance
     */
    addPlayer(ply: Player) {
        GameEventBus.dispatch(GameEvent.PLAYER_JOIN_INSTANCE, ProcessingStage.PRE, {
            ply: ply,
            inst: this,

            msg: {
                name: this.instName,
            },
        });
        ply.sendMessage(this.forWorld.joinMessage);
        ply.inventory.size = this.forWorld.defaultInventorySize;
        ply.notebook = "";

        ply.___spawnPlayer(this.rooms.get(this.forWorld.defaultRoom));

        this.___updatePlayersLists();
        GameEventBus.dispatch(GameEvent.PLAYER_JOIN_INSTANCE, ProcessingStage.POST, {
            ply: ply,
            inst: this,

            msg: {
                name: this.instName,
            },
        });
    }

    removePlayer(ply: Player) {
        GameEventBus.dispatch(GameEvent.PLAYER_LEAVE_INSTANCE, ProcessingStage.PRE, {
            ply: ply,
            inst: this,

            msg: {
                name: this.instName,
            },
        });
        ply.sendMessage("Leaving this world...");
        // When a player leaves the world, drop their inventory in the room
        // they were in.
        ply.inventory.contents.forEach(x => {
            if (!ply.location) {
                return;
            }
            ply.inventory.transferTo(ply.location.inventory, x);
        })
        ply.location?.players.delete(ply);

        this.___updatePlayersLists();
        GameEventBus.dispatch(GameEvent.PLAYER_LEAVE_INSTANCE, ProcessingStage.POST, {
            ply: ply,
            inst: this,

            msg: {
                name: this.instName,
            },
        });
    }

    /**
     * Creates thes SendPlayers object that contains a summary of all players
     * in the instance.
     */
    ___computePlayerSummary(): Messages.SendPlayers {
        return {players: _.map([...this.players()], (ply) => {
            return {dname: ply.authUser.displayname, loc: ply.___locationSummary()};
        })} as Messages.SendPlayers;
    }

    /**
     * Sends updates to all players containing the player list.
     */
    ___updatePlayersLists() {
        const list = this.___computePlayerSummary();
        this.players().forEach((ply) => {
            ply.soc?.send(
                JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.SEND_PLAYERS, list))
            );
        });
    }

    /**
     * Broadcasts a message to all players in the instance. Accepts HTML.
     * @param msg 
     */
    Broadcast(msg: string) {
        this.players().forEach(ply => ply.sendMessage(msg));
    }

    /**
     * Generates a map of strings that correspond to things in this world with
     * a reference to what they refer to, and what type of entity they are.
     */
    WorldLexicon(): Map<string, {v: Object, t: WorldEntityType}> {
        let lexi: Map<string, {v: Object, t: WorldEntityType}> = new Map();
        lexi.set(this.forWorld.name, {v: this, t: WorldEntityType.WORLD});
        this.rooms.forEach(x => lexi.set(x.forRoom.name, {v: x, t: WorldEntityType.ROOM}));
        this.zones.forEach(x => lexi.set(x.forZone.name, {v: x, t: WorldEntityType.ZONE}));
        this.objects.forEach(x => lexi.set(x.forObject.name, {v: x, t: WorldEntityType.OBJECT}));
        this.players().forEach(x => lexi.set(x.authUser.displayname, {v: x, t:WorldEntityType.PLAYER}));
        return lexi;
    }

    ___createRoomGraph() {
        this.forWorld.paths.forEach(x => {
            this.AddPath(x.source, x.dest, x.direction);
        })
    }

    /**
     * AddPath dynamically adds a path to this World.
     */
    AddPath(a: number, b: number, direction: PathDirection) {
        const source = this.roomByID(a);
        const dest = this.roomByID(b);
        if (!source || !dest) {
            throw new Error('Bad definition creating Path');
        }
        source?.paths.set(GetSourceDirection(direction), dest);
        dest?.paths.set(GetDestinationDirection(direction), source);
    }

    /**
     * For an object with a given ID, returns true if a player can reach it.
     * This means they're in the same room with it, and they can see it.
     */
    PlayerCanReachObject(id: number, ply: Player): boolean {
        // First, check if the item is in their inventory
        if (ply.inventory.contents.some(x => x.forObject.id == id)) {
            return true;
        }

        // Next, check if it's out on the floor in the room with them, 
        // and that the object isn't hidden.
        if (ply.location?.inventory.contents.some(x => (x.forObject.id == id) && !x.forObject.hidden)) {
            return true;
        }

        let found = false;
        // Next, check all unlocked containers in the room, that 
        // aren't themselves hidden and are open.
        ply.location?.inventory.contents.filter(x => !x.forObject.hidden && x.open).forEach(x => {
            found = x.inventory.contents.filter(x => !x.forObject.hidden).some(x => x.forObject.id == id);
        });
        if (found) {
            return true;
        }

        return false;
    }

    /**
     * PlayerCanSeeObject is similar to PlayerCanReachObject, but also returns
     * true if the player is in a room with another player holding the object.
     */
    PlayerCanSeeObject(id: number, ply: Player): boolean {
        if (this.PlayerCanReachObject(id, ply)) {
            return true;
        }

        let seen = false;
        ply.location?.players.forEach(x => {
            if (x.inventory.contents.filter(x => !x.forObject.hidden).some(x => x.forObject.id == id)) {
                seen = true;
                return;
            }
        });
        return seen;
    }
}