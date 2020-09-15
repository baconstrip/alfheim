import { LanguagePart, registerGlobalVerb } from "../services/player/inputparsing";
import nlp from 'compromise';
import { DirectionFromWord } from "../types/game/direction";

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

            if (a.probableSubject.rootTerm?.match("#Direction")) {
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

                a.ply.sendMessage(`You move quickly toward ${dest.forRoom.name}`);
                a.ply.move(dest);
            }

            // TODO let players name rooms as well, potentially other players?
        },
    });
    registerGlobalVerb(verbMove);
}