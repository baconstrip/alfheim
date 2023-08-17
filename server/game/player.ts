import { AuthUser } from "../models/User";
import * as Messages from '../../common/messages';
import RoomInstance from "./roominstance";
import { entManager } from "../loaders/sql";
import Inventory from "./inventory";
import { Instance } from "./worldinstance";
import { GameEventBus } from "../events/gameevents";
import { GameEvent } from "../events/gameevent";
import { ProcessingStage } from "../events/processingstage";
import { resolve as assetResolve } from "../loaders/assetresolver";
import { Dialog } from "../../common/dialog";
import { UpdateDiscordUser, ___updateDiscordPlayerAndRooms } from "../services/discord";

export default class Player {
    authUser!: AuthUser;
    soc!: WebSocket | undefined;
    location!: RoomInstance | undefined;
    // Default size is 2, worlds can change this.
    inventory: Inventory = new Inventory(2);

    moduleData: Map<string, any> = new Map();
    notebook: string = "";

    alive: boolean = true;

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
     * Shows a dialog object to a player. Will replace the dialog the player is
     * currently seeing, if one is being displayed.
     * 
     * DO NOT CALL THIS! Call DialogManager.createDialog() instead.
     * @param dialog dialog to display
     * @returns true if the dialog was shown to the player.
     */
    createDialog(dialog: Dialog, name: string): boolean {
        if (GameEventBus.dispatch(GameEvent.DIALOG_SHOWN, ProcessingStage.PRE, {
            ply: this,
            msg: name,
        })) {
            return false;
        }


        this.soc?.send(
            JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.CREATE_DIALOG, {
                name: name,
                dialog: dialog,
            }))
        );

        GameEventBus.dispatch(GameEvent.DIALOG_SHOWN, ProcessingStage.POST, {
            ply: this,
            msg: name,
        });

        return true;
    }

    /**
     * Clears a dialog from the player identified by name, if it is displayed.
     */
    clearDialog(name: string) {
        this.soc?.send(
            JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.REMOVE_DIALOG, {name: name}))
        );
    }

    /**
     * Moves a player to a new room. Must be a room within the same instance, or 
     * an error will be thrown. 
     * 
     * @returns true if the player was moved, false if not.
     */
    move(room: RoomInstance | undefined): boolean {
        if (!this.location) {
            throw new Error('Cannot move a player who isn\'t in an instance');
        }
        if (this.location.fromWorld !== room?.fromWorld) {
            throw new Error('Cannot move a player between instances');
        }

        if (!room) {
            throw new Error('Can\'t move a player to undefined');
        }

        const msg = {
                src: this.location,
                dst: room,
                betweenZones: this.location.forRoom.zone !== room.forRoom.zone,
        };


        if (GameEventBus.dispatch(GameEvent.PLAYER_MOVE, ProcessingStage.PRE, {
            ply: this,
            inst: this.world(),
            msg: msg,
        })) {
            return false;
        }

        this.location.players.delete(this);
        this.location = room;
        this.location.players.add(this);
        this.___refreshUI();

        UpdateDiscordUser(this).catch(x => console.log(`Failed to move Discord user: ${x}`));

        GameEventBus.dispatch(GameEvent.PLAYER_MOVE, ProcessingStage.POST, {
            ply: this,
            inst: this.world(),
            msg: msg,
        })
        return true;
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
        ___updateDiscordPlayerAndRooms(this).catch(x => console.log(`Failed to move Discord user: ${x}`));
    }

    ___refreshUI() {
        this.soc?.send(
            JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.UPDATE_LOCATION, {loc: this.___locationSummary()}))
        );
        this.soc?.send(
            JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.UPDATE_MEDIA, {
                img: assetResolve(this.location?.forRoom.img ?? "error", this.location?.fromWorld.forWorld.___assetModule),
            }))
        );
        this.updateInventory();
        const list = this.world()?.___computePlayerSummary();
        if (list) {
            this.soc?.send(
                    JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.SEND_PLAYERS, list))
            )
        }

        this.soc?.send(
            JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.WRITE_NOTEBOOK, {
                contents: this.notebook,
            }))
        );
        
        this.soc?.send(
            JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.UPDATE_METADATA, {
                username: this.authUser.displayname,
                alive: this.alive,
            }))
        );
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

    /**
     * Turns the player into a ghost,
     * 
     * Cause is a string that provides a rough description of why they died,
     * optional.
     * 
     * @returns whether or not they were actually killed. If the player is 
     * already dead, returns true.
     */
    kill(cause?: string): boolean {
        if (!this.alive) {
            return true;
        }

        if (GameEventBus.dispatch(GameEvent.PLAYER_DEATH, ProcessingStage.PRE, {
            ply: this,
            inst: this.world(),

            msg: {
                cause: cause,
            },
        })) {
            return false;
        }

        this.alive = false;

        this.___refreshUI();

        GameEventBus.dispatch(GameEvent.PLAYER_DEATH, ProcessingStage.POST, {
            ply: this,
            inst: this.world(),
            msg: {
                cause: cause,
            },
        })
        return true;
    }

    /**
     * Revies the player in question. Takes an optional string that describes
     * the reason the player is being resurrected. 
     * 
     * @returns true if the player was successfully resurrected, or if they are
     * already alive.
     */
    resurrect(cause?: string): boolean {
        if (this.alive) {
            return true;
        }

        if (GameEventBus.dispatch(GameEvent.PLAYER_REVIVE, ProcessingStage.PRE, {
            ply: this,
            inst: this.world(),

            msg: {
                cause: cause,
            },
        })) {
            return false;
        }

        this.alive = true;
        this.___refreshUI();

        GameEventBus.dispatch(GameEvent.PLAYER_REVIVE, ProcessingStage.POST, {
            ply: this,
            inst: this.world(),
            msg: {
                cause: cause,
            },
        })
        return true;
    }
}

