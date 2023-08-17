import { GameEventBus, GameEventHandlerArgs } from "../../server/events/gameevents"
import { GameEvent } from "../../server/events/gameevent"
import { ProcessingStage } from "../../server/events/processingstage"
import hideoutworld from "./hideoutworld";

export function setup() {
    GameEventBus.globalOnEvent(GameEvent.PLAYER_MOVE, ProcessingStage.POST, (a: GameEventHandlerArgs) => {
        console.log("Loaded hideout, " + a.ply?.authUser.displayname);
        return false;
    })
}

export var features = {
    'hideout': module,
}

export function worlds() {return  [hideoutworld];};