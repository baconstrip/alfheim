import { InternalEvent } from "../../../events/internalevent";
import { InternalEventBus } from "../../../events/internalevents";
import Player from "../../player";
import * as Messages from '../../../../common/messages';
import { AlfheimConfig } from '../../../services/configuration';

var __config : AlfheimConfig;

export function isAdminPass(input: string): boolean {
    if (!__config) {
        return false;
    }

    return __config.adminPassword == input;
}

export default async ( config: AlfheimConfig ) => {
    __config = config;
    InternalEventBus.onEvent(InternalEvent.MESSAGE_IN, ({ ply, message }: { ply: Player, message: Messages.Msg }) => {
        if (message.type == Messages.ClientMessage.TEXT_INPUT) {
            const body = ((message.body as any).input as string).trim();
            if (isAdminPass(body)) {
                if (ply.authUser.admin) {
                    ply.sendMessage("You're already an admin, what are you doing?");
                    return;
                }
                ply.authUser.admin = true;
                ply.___save();
                ply.___refreshUI();
                ply.sendMessage("Congratulations, you're now an admin!");
            }
        }
    });
};