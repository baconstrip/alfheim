import { Button, Container, Dialog, DialogElement, Text, TextBox } from "../types/dialog";
import { EventBus } from './eventbus';

export function HTMLForDialog(dialog: Dialog): string {
    if (!dialog.contents) {
        throw new Error("Dialog was empty");
    }
    return "";
}

function inferDialogType(e: DialogElement): typeof DialogElement {
    switch (e.___elementType) {
    case "text":
        return Text;
    case "container":
        return Container;
    case "button":
        return Button;
    case "textbox":
        return TextBox;
    default:
        throw new Error(`Could not compute dialaog type for: ${e.indentifier}`);
    }
}

function HTMLRenderFuncFor(e: DialogElement): (x: any) => string  {
    switch (inferDialogType(e)) {
        case Text:
            return HTMLForText;
        case Container:
        case Button:
            return HTMLForButton;
        default:
            throw new Error(`Could not compute render type for: ${e.indentifier}`);
    }
}

function checkIdentifier(e: DialogElement) {
    if (!e.indentifier) {
        throw new Error("Identifier empty");
    }
}

function HTMLForContainer(container: Container) {
    checkIdentifier(container);
    
}

function HTMLForText(text: Text): string {
    checkIdentifier(text);
    return `<div id="${text.indentifier}">${text.body}</div>`
}

function HTMLForButton(button: Button): string {
    checkIdentifier(button);
    return `<dialogbutton v-label='${button.label}' v-identifier='${button.indentifier}'></dialogbutton>`;
}