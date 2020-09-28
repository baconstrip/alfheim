import { GameEventBus, GameEventHandlerArgs } from "../../services/gameevents"
import { GameEvent } from "../../types/gameevent"
import { ProcessingStage } from "../../types/processingstage"

export function setup() {
    GameEventBus.globalOnEvent(GameEvent.PLAYER_MOVE, ProcessingStage.POST, (a: GameEventHandlerArgs) => {
        console.log("Loaded test module, " + a.ply?.authUser.displayname);
        return false;
    })
}

export var features = {
    'test': module
}