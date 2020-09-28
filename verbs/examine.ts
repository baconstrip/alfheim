import { registerGlobalVerb, LanguagePart } from "../services/player/inputparsing";

export default ({}) => {
    const verbExamine = new LanguagePart({
        semanticName: 'examine',
        synonyms: ['look', 'check', 'inspect', 'describe'],
        handler: a => {
            // This is stupid and will need to go at some point.
            if (a.sentence.parsed.match("(around|room)").some(_=> true)) {
                a.ply.sendMessage(`You look around ${a.ply.location?.forRoom.name}, you find:`);
                a.ply.sendMessage(a.ply.location?.forRoom.description ?? "");
                const objs = a.ply.location?.inventory.contents.map(x => x.forObject.name).join(", ");
                if (objs) {
                    a.ply.sendMessage(`In the room there's: ${objs}`);
                }
                return;
            }

            if (!a.probableSubject) {
                a.ply.sendMessage('I don\'t know what you want to look at, I don\'t think there\'s anything like that around here');
                return;
            }

            const obj = a.ply.world()?.objectByName(a.probableSubject.rootTerm.text());
            if (!obj || obj.forObject.hidden) {
                a.ply.sendMessage('I don\'t know what you\'re trying to look at');
                return;
            }

            if (a.ply.world()?.PlayerCanSeeObject(obj.forObject.id, a.ply)) {
                a.ply.sendMessage(`You take a closer look at ${obj.forObject.name}...`);
                a.ply.sendMessage(`<span class="examine-text">${obj.forObject.description}</span>`);
                return;
            }
        },
    });
    registerGlobalVerb(verbExamine);
}