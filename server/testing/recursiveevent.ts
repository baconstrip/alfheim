import { GameEventBus } from "../services/gameevents"
import { GameEvent } from "../types/gameevent"
import { ProcessingStage } from "../types/processingstage"

export default ({}) => {
    console.log("Recursive event test loaded.");
    GameEventBus.globalOnEvent(GameEvent.PLAYER_MOVE, ProcessingStage.PRE, (a) => {
        console.log("Ran once");
        a.ply?.move(a.ply.location);
        return false;
    });
}