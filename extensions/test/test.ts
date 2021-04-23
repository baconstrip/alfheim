import { GameEventBus, GameEventHandlerArgs } from "../../services/gameevents"
import { ModuleData } from "../../services/moduledata";
import { Button, Container, Dialog, Text, TextBox } from "../../types/dialog";
import { GameEvent } from "../../types/gameevent"
import { ProcessingStage } from "../../types/processingstage"

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
            button.indentifier = "hellobutton";
            button.label = "Clicccc";
            button.color = "primary";
            let textbox = new TextBox();
            textbox.indentifier = "texty";
            textbox.inputType = "textbox";
            contents.elements.push(message);
            contents.elements.push(button);
            contents.elements.push(textbox);
            let dialog = new Dialog();
            dialog.contents = contents;
            
            a.ply?.createDialog(dialog);
        }
        return false;
    })
}

export var features = {
    'test': module
}