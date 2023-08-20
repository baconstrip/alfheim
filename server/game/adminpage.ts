import Player from "./player";
import * as Messages from '../../common/messages';
import { ListPlayers } from "../services/players";
import { ListInstances } from "../services/instancemanager";

export function updateAdminUI(ply: Player) {
    const allPlayers = ListPlayers();

    var summaries: Messages.PlayerSummary[] = [];
    allPlayers.forEach((p) => {
        summaries.push({
            dname: p.authUser.displayname,
            loc: p.___locationSummary(),
        });
    });

    var instances = ListInstances().map(x => (x.instName + " (instance of) " + x.forWorld.name));

    ply.soc?.send(
        JSON.stringify(Messages.BuildMessage(Messages.ServerMessage.ADMIN_INFO, {
            allPlayers: summaries,
            instances: instances,
        }))
    );
}