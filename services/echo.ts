import * as Messages from '../types/messages';
import { EventBus } from './eventbus';
import { AlfEvent } from '../types/events';
import { Player } from '../types/player';
import { LookupPlayerId } from './players';

export default async ({}) => {
    EventBus.onEvent(AlfEvent.MESSAGE_IN, ({ply, message}: {ply: Player, message: Messages.Msg}) => {
        console.log(" got : " + JSON.stringify(ply.authUser) + " " + JSON.stringify(message));
        if (message.type == Messages.ClientMessage.TEXT_INPUT) {
            console.log("testing: + " + ply.soc.protocol);
            
            LookupPlayerId(ply.authUser.id)?.soc.send(
                JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.PUBLISH_TEXT, {
                    output: '> <i>' + (message.body as any).input + '</i><br>',
                    html: true,
                }))
            );
        }
    });
};