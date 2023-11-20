import * as Messages from '../../common/messages';
import { CallbackFunc, Container, Dialog, DialogElement, InputElement } from "../../common/dialog";
import Player from "../game/player";
import { InternalEvent } from "../events/internalevent";
import { ClientMessage } from "../../common/messages";
import { InternalEventBus } from "../events/internalevents";
import { ModuleData } from "./moduledata";
import { GameEventBus } from '../events/gameevents';
import { GameEvent } from '../events/gameevent';
import { ProcessingStage } from '../events/processingstage';

class ___dialogKey  {
    plugin: string;
    name: string;
    player: number;

    constructor (plugin: string, name: string, player: number) {
        this.plugin = plugin;
        this.name = name;
        this.player = player;
    }

    string(): string {
        return this.plugin + this.name + String(this.player);
    }
}

type ___annotatedDialog = {
    key: ___dialogKey,
    dialog: WrappedDialog,
}

class WrappedDialog  {
    dialog: Dialog;
    closeFunc: () => void;

    constructor(dialog: Dialog, player: Player, key: string) {
        this.dialog = dialog;

        this.closeFunc = () => {
            player.___clearDialog(key);
        };
    }
    /**
     * Closes the dialog on the client
     */
    close() {
        this.closeFunc(); 
    }
}


// Singleton manager.
class ___dialogManagerType {
    dialogs: Map<string, ___annotatedDialog> = new Map();

    outstandingRequests: Map<string, (contents: string) => void> = new Map();

    constructor() {
        // Handle interaction events from the dialog.
        InternalEventBus.onEvent(InternalEvent.MESSAGE_IN, ({ ply, message }: { ply: Player, message: Messages.Msg }) => {
            if (message.type != ClientMessage.DIALOG_INTERACT) {
                return; 
            }
            let body = (message.body as Messages.DialogInteract);

            if (!this.dialogs.has(body.dialogName)) {
                console.log(`Got event for unassociated dialog: ${body}, ignoring.`);
                return;
            }
            this.processEvent(ply, body, (this.dialogs.get(body.dialogName) as ___annotatedDialog).dialog);
        });

        // Handle closing the dialog.
        InternalEventBus.onEvent(InternalEvent.MESSAGE_IN, ({ ply, message }: { ply: Player, message: Messages.Msg }) => {
            if (message.type != ClientMessage.CLOSE_DIALOG) {
                return;
            }

            let body = (message.body as Messages.CloseDialog);

            if (!this.dialogs.has(body.name)) {
                console.log(`Got event for unassociated dialog: ${body}, ignoring.`);
                return;
            }

            this.dialogs.get(body.name)?.dialog.dialog.closeListeners.forEach(l => {
               l(ply); 
            });

            GameEventBus.dispatch(GameEvent.DIALOG_CLOSE, ProcessingStage.PRE, {
                ply: ply,
                msg: body.name,
            });
            GameEventBus.dispatch(GameEvent.DIALOG_CLOSE, ProcessingStage.POST, {
                ply: ply,
                msg: body.name,
            });
        });

        // Handle returned read requests.
        InternalEventBus.onEvent(InternalEvent.MESSAGE_IN, ({ ply, message }: { ply: Player, message: Messages.Msg }) => {
            if (message.type != ClientMessage.DIALOG_CONTENTS) {
                return;
            }

            let body = (message.body as Messages.DialogContents);

            let callback = this.outstandingRequests.get(this.___makeCallbackKey(body.dialog, body.name));
            if (!callback) {
                console.log(`Client set dialog contents that we weren't waiting for: ${JSON.stringify(body)}`);
                return;
            }

            callback(body.contents);
        });
    }

    processEvent(ply: Player, msg: Messages.DialogInteract, dialog: WrappedDialog) {
        let elem = this.findElement(dialog.dialog.contents, msg.element);
        if (!elem) {
            console.log(`Couldn't locate element manipulated in dialog: ${msg.element}, aborting processing.`);
            return
        }

        console.log(`Processing event for: ${JSON.stringify(msg)}`);

        elem.listeners.forEach((x) => {
            x.forEach((listener) => listener(ply));
        });
        GameEventBus.dispatch(GameEvent.DIALOG_INTERACT, ProcessingStage.PRE, {
            ply: ply,
            msg: msg,
        });
        GameEventBus.dispatch(GameEvent.DIALOG_INTERACT, ProcessingStage.POST, {
            ply: ply,
            msg: msg,
        });
    }

    findElement(elem:DialogElement, id: string): DialogElement | null {
        if (elem.indentifier == id) {
            return elem;
        }

        if (elem instanceof Container) {
            let outerThis = this;
            let found: DialogElement | null = null;
            (elem as Container).elements.forEach((x) => {
                let res = outerThis.findElement(x, id);
                if (res) {
                    found = res;
                }
            })
            if (found) {
                return found;
            }
        }
        return null;
    }

    createDialog(contents: DialogElement, module: ModuleData, player: Player, name: string): WrappedDialog {
        let dialog = new Dialog();
        dialog.contents = contents;
        let key = new ___dialogKey(module.identifier(), name, player.authUser.id);

        let wrapped = new WrappedDialog(dialog, player, key.string());

        this.dialogs.set(key.string(), {
            key: key,
            dialog: wrapped,
        });
        player.___createDialog(dialog, key.string());

        this.connectInputs(contents, player, key.string());

        return wrapped;
    }


    connectInputs(contents: DialogElement, player: Player, key: string) {
        if (contents instanceof Container) {
            let outerThis = this;
            (contents as Container).elements.forEach(element => {
                outerThis.connectInputs(element, player, key);
            })
        }

        if (contents instanceof InputElement) {
            let capture = this;
            let input = (contents as InputElement);
            input.reqFunc = (callback: CallbackFunc) => {
                capture.readInputs(key,player, contents.indentifier, callback);
            }
        }
    }

    readInputs(key: string, player: Player, name: string, callback: (content: string) => void) {
        this.outstandingRequests.set(this.___makeCallbackKey(key, name), callback); 

        player.soc?.send(JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.READ_DIALOG, {
            name: key,
            component: name,
        })));
    }
    ___makeCallbackKey(dialog: string, element: string): string {
        return dialog+element;
    }
}
var ___inst: ___dialogManagerType;

export default async() => {
    ___inst = new ___dialogManagerType();
}

export namespace DialogManager {
    /**
     * Creates a dialog for the given player. This is the entry point for 
     * creating a Dialog window.
     * 
     * @param contents the root DialogElement to show the player.
     * @param module a reference to the ModuleData of the creating plugin.
     * @param player player to create the dialog on.
     * @param name a unqiue name for the dialog to distinguish it from others.
     * @returns a WrappedDialog that contains helpers for interacting with the
     * dialog while it's open.
     */
    export function createDialog(contents: DialogElement, module: ModuleData, player: Player, name: string): WrappedDialog {
        return ___inst.createDialog(contents, module, player, name);
    }
}
