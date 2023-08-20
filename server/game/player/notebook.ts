import * as Messages from '../../../common/messages';
import { InternalEventBus } from '../../events/internalevents';
import { InternalEvent } from '../../events/internalevent';
import Player from '../player';
import validator from 'validator';

export default async ({}) => {
    InternalEventBus.onEvent(InternalEvent.MESSAGE_IN, ({ ply, message }: { ply: Player, message: Messages.Msg }) => {
        if (message.type != Messages.ClientMessage.UPDATE_NOTEBOOK) {
            return;
        }

        let notebookContents = message.body as Messages.UpdateNotebook;
        if (!notebookContents.contents) {
            return;
        }

        if (!validator.isLength(notebookContents.contents, {max: 1024})) {
            return;
        }

        // Escape it for fun
        let escaped = validator.escape(notebookContents.contents);

        ply.notebook = escaped;

        console.log("updating player noteboook");
    });
}