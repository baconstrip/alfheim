import { registerGlobalVerb, LanguagePart } from "../services/player/inputparsing";
import nlp from 'compromise';
import { Direction } from "../types/game/direction";

export default ({}) => {
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
    });
    registerGlobalVerb(verbMove);

    // Add some rules to make it more likely that directions are matched
    // correctly, and annotate them as directions.
    nlp.extend((doc: nlp.Document, world: nlp.World) => {
        // Create a list of all direction names
        let directions: string[] = [];
        for (let d in Direction) {
            if (isNaN(Number(d))) {
                directions.push(d.toLowerCase());
            }
        }
        const directionMatcher = "(" + directions.join('|') + ")";
        console.log('%O', directionMatcher);
        world.postProcess(doc => {
            // If a direction ends a phrase, assume it is always a direction.
            doc.match(directionMatcher + '$')
                .tag('Direction')
                .tag('Noun')
                .unTag('Adjective');

            // if a direction proceeds a conjuction directly, assume a 
            // direction.
            doc.match(directionMatcher + ' #Conjunction')
                .firstTerms()
                .tag('Direction')
                .tag('Noun')
                .unTag('Adjective');
        })
    });
}