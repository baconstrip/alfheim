export enum ClientMessage {
    // Start at 1 so enum is truthy
    TEXT_INPUT = 1,
}

export enum ServerMessage {
    // Start at 1000 to provide namespace separation.
    PUBLISH_TEXT = 1000,
    CLEAR_TEXT,
    UPDATE_LOCATION,
    UPDATE_MEDIA,
    SEND_INVENTORY,
    SEND_PLAYERS,
}

// ------ Base Message Type ------- //

/**
 * Msg describes all messages that clients and servers can exchange.
 * 
 * Contains the type information for the message and allows for errors to be
 * attached.
 */
export class Msg {
    type!: ClientMessage | ServerMessage;
    body!: Object;
    error!: string;
}

// -------- Client Messages ------- //

export class TextInput {
    input!: string;
}

// -------- Server Messages ------- //

export class PublishText {
    output!: string;
    // Whether the client should treat the text as preformatted or HTML. 
    debug!: Object;
    html: boolean = false;
}

export class ClearText {}

export class LocationSummary {
    world!: string;
    room!: string;
    zone!: string;
}

export class UpdateLocation {
    loc!: LocationSummary;
}

export class UpdateMedia {
    // Only one of the following will be set
    /**
     * A URL that specifies an image to display in the media area.
     */
    img!: string;
}

export enum InventoryType {
    PLAYER = 1,
    OBJECT = 2,
}

export class InventoryObject {
    name!: string;
    description!: string;
}

export class SendInventory {
    type!: InventoryType;
    size!: number;
    items!: InventoryObject[];
}

export class PlayerSummary {
    dname!: string;
    loc!: LocationSummary;
}

export class SendPlayers {
    players!: PlayerSummary[];
}

// ---------- Utilities ---------- //

export function BuildMessage(t: ClientMessage |  ServerMessage, body: Object, error?: string): Msg{
    let msg = new Msg();
    msg.type = t;
    if (error) {
        msg.error = error;
    } else {
        msg.body = body;
    }

    return msg;
}