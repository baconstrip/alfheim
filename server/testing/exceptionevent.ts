import { GameEventBus } from "../events/gameevents"
import { GameEvent } from "../events/gameevent"
import { ProcessingStage } from "../events/processingstage"

export default ({}) => {
    console.log("Recursive event test loaded.");
    GameEventBus.globalOnEvent(GameEvent.PLAYER_MOVE, ProcessingStage.PRE, (a) => {
        throw new Error("Test exception");
    });
}