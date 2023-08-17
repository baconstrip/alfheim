import { DialogManager } from "../../server/services/dialogmanager";
import { GameEventBus, GameEventHandlerArgs } from "../../server/events/gameevents"
import { ModuleData } from "../../server/services/moduledata";
import { Button, Container, Dialog, DialogEvent, Text, TextBox } from "../../common/dialog";
import Player from "../../server/game/player";
import { GameEvent } from "../../server/events/gameevent"
import { ProcessingStage } from "../../server/events/processingstage"

export function setup(data: ModuleData) {
    console.log("setting up test");
    GameEventBus.globalOnEvent(GameEvent.PLAYER_MOVE, ProcessingStage.POST, (a: GameEventHandlerArgs) => {
        const count = data.getForPlayer(a.ply!, "movecount") ?? 0;
        data.setOnPlayer(a.ply!, "movecount",  count + 1)
        console.log(`Player has moved: ${count + 1}`)

        if (a.ply?.location?.forRoom.name === "Pub") {
            let contents = new Container();
            contents.indentifier = "hellocontainer";
            contents.elements = new Array();
            let message = new Text();
            message.body = "Hello!";
            message.indentifier = "hellotext";
            let button = new Button();
            button.addEventListener(DialogEvent.CLICK, (ply: Player) => {
                ply.sendMessage("Don't click on me!");
            });
            button.indentifier = "hellobutton";
            button.label = "Clicccc";
            button.color = "primary";
            let textbox = new TextBox();
            textbox.indentifier = "texty";
            textbox.inputType = "textbox";
            contents.elements.push(message);
            contents.elements.push(button);
            contents.elements.push(textbox);
            let dialog = DialogManager.createDialog(contents, data, a.ply, "testdialog");
            dialog.dialog.addCloseListener((ply: Player) => {
                ply.sendMessage("closed the dialog")
            });

            let reqText = textbox.getRequestFunc();
            button.addEventListener(DialogEvent.CLICK, (ply: Player) => {
                if (!reqText) {
                    return;
                }
                let test = reqText((contents: string) => {
                    ply.sendMessage(`I think you said ${contents}`);
                });
            });
        }
        return false;
    })
}

export var features = {
    'test': module
}