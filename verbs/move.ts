import { LanguagePart, registerGlobalVerb } from "../services/player/inputparsing";
import nlp from 'compromise';
import { DirectionFromWord } from "../types/game/direction";
import RoomInstance from "../types/game/roominstance";
import Player from "../types/game/player";

export default ({}) =>{
    const verbMove = new LanguagePart({
        semanticName: "move",
        synonyms: ['go', 'head'],
        languageInstructions: [
            (doc: nlp.Document, world: nlp.World) => {
                // Attempt to correct some quirks with movement
                world.postProcess(doc => {
                    doc.match('(move|head|go) (to|in|toward|at)')
                        .tag('Verb Preposition')
                        .match('(to|in|toward|at)')
                        .unTag('#Conjunction');
                });
            }
        ],
        handler: a => {
            if (!a.probableSubject) {
                a.ply.sendMessage("Where did you want to go? I don't quite get it.");
                return;
            }

            a.ply.sendMessage('Attempting to move.');
            const roomName = a.probableSubject.rootTerm?.match("#Room");

            if (a.probableSubject.rootTerm?.match("#Direction").wordCount() ?? 0 > 0) {
                const direction = DirectionFromWord(a.probableSubject.rootTerm.text());
                if (!direction) {
                    a.ply.sendMessage("I can't figure out which way you want to go.");
                    return;
                }
                const dest = a.ply.location?.paths.get(direction);
                a.ply.sendMessage(`direction from word: ${direction}`);

                if (!dest) {
                    a.ply.sendMessage("There's nothing over in that direction.")
                    return;
                }

                movePlayer(dest, a.ply);
                return;
            }  

            // If we guess they mentioned a room
            if (roomName.wordCount() ?? 0 > 0) {
                let room = a.ply.world()?.roomByName(roomName.text());

                if (!room) {
                    a.ply.sendMessage("I couldn't find that room in the world.");
                    return;
                } 

                // If the world has unrestricted movement
                if (a.ply.world()?.forWorld.unrestrictedMovement) {
                    movePlayer(room, a.ply);
                    return;
                } 

                let moved = false;
                // Search the paths for the room in question, move 
                // the player if it is found.
                a.ply.location?.paths.forEach(x => {
                    if (x.forRoom.id == room?.forRoom.id) {
                        movePlayer(room, a.ply);
                        moved = true;
                        return
                    }
                });
                if (moved) {
                    return;
                } else {
                    a.ply.sendMessage('You search and search, but you can\'t find a way to get there from here');
                    return;
                }
                
            }

            // TODO let players move potentially to other players?
        },
    });
    registerGlobalVerb(verbMove);
}

function movePlayer(dest: RoomInstance, ply: Player) {
    ply.sendMessage(`You move quickly toward ${dest.forRoom.name}`);
    ply.move(dest);
}