import { AuthUser } from "../../models/User";
import * as Messages from '../messages';
import RoomInstance from "./roominstance";
import { entManager } from "../../loaders/sql";
import Inventory from "./inventory";
import { Instance } from "./worldinstance";
import { GameEventBus } from "../../services/gameevents";
import { GameEvent } from "../gameevent";
import { ProcessingStage } from "../processingstage";

export default class Player {
    authUser!: AuthUser;
    soc!: WebSocket | undefined;
    location!: RoomInstance | undefined;
    // Default size is 2, worlds can change this.
    inventory: Inventory = new Inventory(2);

    /**
     * Sends a raw HTML message to the client to be displayed in the 
     * textwindow.
     * 
     * @param msg Message to send, may contain HTML.
     */
    sendMessage(msg: string, debug?: Object | undefined) {
        this.soc?.send(
            JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.PUBLISH_TEXT, {
                output: msg,
                html: true,
                debug: debug,
            }))
        );
    }

    /**
     * Moves a player to a new room. Must be a room within the same instance, or 
     * an error will be thrown. 
     * @param room 
     */
    move(room: RoomInstance | undefined) {
        if (!this.location) {
            throw new Error('Cannot move a player who isn\'t in an instance');
        }
        if (this.location.fromWorld !== room?.fromWorld) {
            throw new Error('Cannot move a player between instances');
        }

        if (!room) {
            throw new Error('Can\'t move a player to undefined');
        }

        if (GameEventBus.dispatch(GameEvent.PLAYER_MOVE, ProcessingStage.PRE, {
            ply: this,
            inst: this.world(),

            msg: {
                src: this.location,
                dst: room,
                betweenZones: this.location.forRoom.zone !== room.forRoom.zone,
            },
        })) {
            return;
        }

        this.location.players.delete(this);
        this.location = room;
        this.location.players.add(this);
        this.___refreshUI();

        GameEventBus.dispatch(GameEvent.PLAYER_MOVE, ProcessingStage.POST, {
            ply: this,
            inst: this.world(),
        })
    }

    /**
     * Refreshes the view of the player's inventory on the UI
     */
    updateInventory() {
        this.soc?.send(
            JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.SEND_INVENTORY, this.inventory.toClientMessage()))
        );
    }

    /**
     * Internal use only, inserts a player into a room unconditionally.
     * 
     * Use the addplayer and removeplayer methods on Instance instead.
     */
    ___spawnPlayer(room: RoomInstance | undefined) {
        this.location = room;
        room?.players.add(this);
        this.___refreshUI();
    }

    ___refreshUI() {
        this.soc?.send(
            JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.UPDATE_LOCATION, {loc: this.___locationSummary()}))
        );
        this.soc?.send(
            JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.UPDATE_MEDIA, {
                img: this.location?.forRoom.img,
            }))
        );
        this.updateInventory();
        const list = this.world()?.___computePlayerSummary();
        if (list) {
            this.soc?.send(
                    JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.SEND_PLAYERS, list))
            )
        }
    }

    ___locationSummary(): Messages.LocationSummary {
        return {
            world: this.world()?.forWorld.name ?? "",
            room: this.location?.forRoom.name ?? "",
            zone: this.world()?.zoneByID(this.location?.forRoom.zone ?? -1)?.forZone.name ?? "",
        }
    }
    
    ___reset() {
        this.location = undefined;
    }

    ___save() {
        entManager().save(this.authUser).then(x => console.log('Saved user: ' + x.id))
    }

    world(): Instance | undefined {
        return this.location?.fromWorld;
    }
}

