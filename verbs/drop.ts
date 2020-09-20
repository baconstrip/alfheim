import { registerGlobalVerb, LanguagePart } from "../services/player/inputparsing";

export default ({}) =>{
    const dropVerb = new LanguagePart({
        semanticName: 'drop',
        synonyms: ['deposit', 'discard', 'toss'],
        handler: a => {            
            if (!a.probableSubject) {
                a.ply.sendMessage('What are you trying to discard?');
                return;
            }

            const obj = a.ply.world()?.objectByName(a.probableSubject.rootTerm.text());
            if (!obj || obj.forObject.hidden) {
                a.ply.sendMessage('I don\'t know what you\'re trying to drop.');
                return;
            }

            if (!obj.forObject.portable) {
                a.ply.sendMessage('Try as you might, it won\'t budge. Not even a little');
                return;
            }

            // If the player is carrying the object.
            if (a.ply.inventory.contents.some(x => x.forObject.id == obj.forObject.id)) {
                if (!a.ply.location?.inventory) {
                    throw new Error("Can't deposit something when a player isn't in a room");
                }
                a.ply.inventory.transferTo(a.ply.location?.inventory, obj);
                a.ply.sendMessage(`You set down ${obj.forObject.name} where you are.`)
                a.ply.updateInventory();
                return;
            }

            a.ply.sendMessage('You aren\'t carrying anything like that');
        },
    });
    registerGlobalVerb(dropVerb);
}