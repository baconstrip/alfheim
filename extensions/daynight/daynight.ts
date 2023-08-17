import { GameEventBus, GameEventHandlerArgs } from "../../server/events/gameevents"
import { GameEvent } from "../../server/events/gameevent"
import { ProcessingStage } from "../../server/events/processingstage"

export function setup() {
    GameEventBus.globalOnEvent(GameEvent.PLAYER_MOVE, ProcessingStage.POST, (a: GameEventHandlerArgs) => {
        console.log("Loaded daynight, " + a.ply?.authUser.displayname);
        return false;
    })
}

export var features = {
    'daynight': module,
}