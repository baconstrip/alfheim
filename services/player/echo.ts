import * as Messages from '../../types/messages';
import { EventBus } from '../eventbus';
import { AlfEvent } from '../../types/events';
import Player from '../../types/game/player';

export default async ({ }) => {
    EventBus.onEvent(AlfEvent.MESSAGE_IN, ({ ply, message }: { ply: Player, message: Messages.Msg }) => {
        if (message.type == Messages.ClientMessage.TEXT_INPUT) {
            const body = (message.body as any).input as string;
            if (body.toLowerCase().trim().startsWith('echo')) {
                const reply = body.trim().substring(5);
                ply.sendMessage('> <i>' + reply + '</i>');
            }
        }
    });
};