const EventBus = require('./components/eventbus.js').EventBus;
import * as Messages from '../../../types/messages';

function processMessage(msg: any) {
    if (msg.type === Messages.ServerMessage.PUBLISH_TEXT) {
        EventBus.$emit('write-textlog', msg.body.output);
        const debugMessage = (msg.body as Messages.PublishText).debug; 
        if (debugMessage){
            console.log(debugMessage);
        }
    }
    if (msg.type === Messages.ServerMessage.CLEAR_TEXT) {
        EventBus.$emit('clear-textlog');
    }
    if (msg.type === Messages.ServerMessage.UPDATE_LOCATION) {
        EventBus.$emit('update-location', msg.body);
    }
    if (msg.type === Messages.ServerMessage.UPDATE_MEDIA) {
        EventBus.$emit('update-media', msg.body);
    }
    if (msg.type === Messages.ServerMessage.SEND_INVENTORY) {
        EventBus.$emit('send-inventory', msg.body);
    }
    if (msg.type === Messages.ServerMessage.SEND_PLAYERS) {
        EventBus.$emit('send-players', msg.body);
    }
}

export default({}) => {
    EventBus.$on('raw-message', processMessage);
}
