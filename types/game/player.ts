import { AuthUser } from "../../models/User";
import * as Messages from '../messages';
import RoomInstance from "./roominstance";
import { entManager } from "../../loaders/sql";

export default class Player {
    authUser!: AuthUser;
    soc!: WebSocket | undefined;
    location!: RoomInstance | undefined;

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

        this.location.players.delete(this);
        this.location = room;
        this.location.players.add(this);
        this.___refreshUI();
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
            JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.UPDATE_LOCATION, {
                world: this.location?.fromWorld.forWorld.name,
                room: this.location?.forRoom.name,
            }))
        );
        this.soc?.send(
            JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.UPDATE_MEDIA, {
                img: this.location?.forRoom.img,
            }))
        );
    }
    
    ___reset() {
        this.location = undefined;
    }

    ___save() {
        entManager().save(this.authUser).then(x => console.log('Saved user: ' + x.id))
    }
}

