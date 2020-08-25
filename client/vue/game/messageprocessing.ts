const EventBus = require('./components/eventbus.js').EventBus;
import * as Messages from '../../../types/messages';

function processMessage(msg: any) {
    if (msg.type === Messages.ServerMessage.PUBLISH_TEXT) {
        EventBus.$emit('write-textlog', msg.body.output);
    }
    if (msg.type === Messages.ServerMessage.CLEAR_TEXT) {
        EventBus.$emit('clear-textlog');
    }
    if (msg.type === Messages.ServerMessage.UPDATE_LOCATION) {
        EventBus.$emit('update-location', msg.body);
    }
}

export default({}) => {
    EventBus.$on('raw-message', processMessage);
}