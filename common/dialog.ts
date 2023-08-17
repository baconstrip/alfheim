import Player from "../server/game/player";

export class Dialog {
    closeListeners: DialogEventListener[] = [];
    contents!: DialogElement;

    ___iden = "DIALOG";

    addCloseListener(l: DialogEventListener) {
        this.closeListeners.push(l);
    }
}

type DialogEventListener = (player: Player) => void;

export class DialogElement {
    /* Identifies the element so the server can manipulate it */
    indentifier!: string;
    listeners: Map<DialogEvent, Array<DialogEventListener>> = new Map();

    addEventListener(event: DialogEvent, func: DialogEventListener) {
        if (this.listeners.get(event)) {
            this.listeners.get(event)?.push(func);
        } else {
            this.listeners.set(event, [func]);
        }
    }

    ___elementType = "element";
}

type InputRequestFunc = (callback: CallbackFunc) => void;
export type CallbackFunc = (contents: string) => void;

export class InputElement extends DialogElement {
    reqFunc?: InputRequestFunc;

    /**
     * This function is only valid after createDialog() is called for the
     * containing dialog.
     * 
     * @returns a function that can be called with a callback to request the 
     * contents of the field.
     */
    getRequestFunc(): InputRequestFunc | undefined {
        return this.reqFunc; 
    }
}

export class Container extends DialogElement {
    elements!: DialogElement[];

    ___elementType = "container";
}

export class Button extends DialogElement {
    label!: string;
    /* Must be one of Bootstrap's color specifiers */
    color!: string;
    
    ___elementType = "button";
}

export class Text extends DialogElement {
    /* Raw HTML displayed to the client in the dialog */
    body!: string;

    ___elementType = "text";
}

export class TextBox extends InputElement {
    inputType!: "textbox" | "textarea";
    /* If liveUpdate is set, every time the field is changed, a message will be sent to the server */
    liveUpdate!: boolean;

    ___elementType = "textbox"
}

export enum DialogEvent {
    // Prevent overlap with other event namespaces
    CLICK = 2300,
}
