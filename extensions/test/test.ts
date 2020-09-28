import { GameEventBus, GameEventHandlerArgs } from "../../services/gameevents"
import { ModuleData } from "../../services/moduledata";
import { GameEvent } from "../../types/gameevent"
import { ProcessingStage } from "../../types/processingstage"

export function setup(data: ModuleData) {
    console.log("setting up test");
    GameEventBus.globalOnEvent(GameEvent.PLAYER_MOVE, ProcessingStage.POST, (a: GameEventHandlerArgs) => {
        const count = data.getForPlayer(a.ply!, "movecount") ?? 0;
        data.setOnPlayer(a.ply!, "movecount",  count + 1)
        console.log(`Player has moved: ${count + 1}`)
        return false;
    })
}

export var features = {
    'test': module
}