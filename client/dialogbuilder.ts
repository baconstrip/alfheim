import { Button, Container, Dialog, DialogElement, Text, TextBox } from "../types/dialog";
import { EventBus } from './eventbus';

export function HTMLForDialog(dialog: Dialog): string {
    if (dialog.___iden !== "DIALOG") {
        console.log(`message was not a dialog: ${dialog}`);
    }
    if (!dialog.contents) {
        console.log('dialog was empty');
    }

    try {
        return HTMLFor(dialog.contents);
    } catch (e) {
        console.log(`Error parsing dialog: ${dialog}: ${e}`);
    }
    
    return `<div class="alert alert-danger" role="alert">
                Bad dialog, this is an error in the server application.
            </div> `;
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

function HTMLFor(e: DialogElement): string {
    return HTMLRenderFuncFor(e)(e);
}

function HTMLRenderFuncFor(e: DialogElement): (x: any) => string  {
    switch (inferDialogType(e)) {
        case Text:
            return HTMLForText;
        case Container:
            return HTMLForContainer;
        case Button:
            return HTMLForButton;
        case TextBox:
            return HTMLForTextBox;
        default:
            throw new Error(`Could not compute render type for: ${e.indentifier}`);
    }
}

function checkIdentifier(e: DialogElement) {
    if (!e.indentifier) {
        throw new Error("Identifier empty");
    }
}

function HTMLForContainer(container: Container): string {
    checkIdentifier(container);

    let innerBlock = "";
    container.elements.forEach(element => {
        innerBlock += "<div class='p-2'>" + HTMLFor(element) + "</div>";
    });
    
    return `<div class="d-flex flex-column" id="${container.indentifier}">${innerBlock}</div>`;
}

function HTMLForText(text: Text): string {
    checkIdentifier(text);
    return `<div id="${text.indentifier}">${text.body}</div>`
}

function HTMLForButton(button: Button): string {
    checkIdentifier(button);
    return `<button class="btn btn-large btn-${button.color}" id='${button.indentifier}'>${button.label}</button>`;
}

function HTMLForTextBox(box: TextBox): string {
    checkIdentifier(box);
    if (box.inputType == "textbox") {
        return `<input type="textbox" id=${box.indentifier}></input>`;
    } else if (box.inputType == "textarea") {
        return `<textarea id="${box.indentifier}></textarea>`;
    } else {
        throw new Error(`Invalid textbox type: ${box.inputType}`);
    }
}