import { registerGlobalVerb, LanguagePart } from "../inputparsing";

export default ({ }) => {
    const openVerb = new LanguagePart({
        semanticName: 'say',
        synonyms: ['speak', 'yell', 'utter'],
        handler: a => {

            // Todo: this will need to be fixed because players may not neccessarily just type "say"
            var scrubbed = a.sentence.text.replace(/say/i, '');

            if (!a.ply.alive) {
                a.ply.sendMessage("Dead men tell no tales.");
                return;
            }

            a.ply.sendMessage(`You speak aloud!`);
            [...(a.ply.world()!.players())]
                .filter((p) => p.location != undefined && p.location == a.ply.location && p != a.ply)
                .forEach((p) => {
                    p.sendMessage(`${a.ply.authUser.displayname} says: ${scrubbed}`)
                }
            );
        },
    });
    registerGlobalVerb(openVerb);
}