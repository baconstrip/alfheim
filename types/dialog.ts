export class Dialog {
    contents!: DialogElement;
}

export class DialogElement {
    /* Identifies the element so the server can manipulate it */
    indentifier!: string;

    ___elementType = "element";
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

export class TextBox extends DialogElement {
    inputType!: "textbox" | "textarea";
    /* If liveUpdate is set, every time the field is changed, a message will be sent to the server */
    liveUpdate!: boolean;

    ___elementType = "textbox"
}