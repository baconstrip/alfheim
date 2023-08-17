import { EventBus } from './eventbus';
import * as Messages from '../../common/messages';

let msgTypeMap = new Map([
    [Messages.ServerMessage.CLEAR_TEXT, 'clear-textlog'],
    [Messages.ServerMessage.UPDATE_LOCATION, 'update-location'],
    [Messages.ServerMessage.UPDATE_MEDIA, 'update-media'],
    [Messages.ServerMessage.SEND_INVENTORY, 'send-inventory'],
    [Messages.ServerMessage.SEND_PLAYERS, 'send-players'],
    [Messages.ServerMessage.CREATE_DIALOG, 'create-dialog'],
    [Messages.ServerMessage.UPDATE_DIALOG, 'update-dialog'],
    [Messages.ServerMessage.REMOVE_DIALOG, 'remove-dialog'],
    [Messages.ServerMessage.READ_DIALOG, 'read-dialog'],
    [Messages.ServerMessage.WRITE_NOTEBOOK, 'write-notebook'],
    [Messages.ServerMessage.UPDATE_METADATA, 'update-metadata'],
]);

function processMessage(msg: any) {
    if (msg.type === Messages.ServerMessage.PUBLISH_TEXT) {
        EventBus.$emit('write-textlog', msg.body.output);
        const debugMessage = (msg.body as Messages.PublishText).debug; 
        if (debugMessage){
            console.log(debugMessage);
        }
        return;
    }

    let eventName = msgTypeMap.get(msg.type);
    if (eventName) {
        EventBus.$emit(eventName, msg.body);
    } else {
        console.error(`Unknown event type from server: ${msg.type}`)
    }
}

export default({}) => {
    EventBus.$on('raw-message', processMessage);
}
