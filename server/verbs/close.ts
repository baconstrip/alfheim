import { registerGlobalVerb, LanguagePart } from "../player/inputparsing";

export default ({}) =>{
    const closeVerb = new LanguagePart({
        semanticName: 'close',
        synonyms: ['shut'],
        handler: a => {            
            if (!a.probableSubject) {
                a.ply.sendMessage('What are you trying to close? I don\'t think there\'s anything like that around here');
                return;
            }

            const obj = a.ply.world()?.objectByName(a.probableSubject.rootTerm.text());
            if (!obj || obj.forObject.hidden) {
                a.ply.sendMessage('I don\'t know what you\'re trying to close.');
                return;
            }

            if (a.ply.world()?.PlayerCanReachObject(obj.forObject.id, a.ply)) {
                if (!obj.open) {
                    a.ply.sendMessage(`The ${obj.forObject.name} is already closed, try as you might, you can't close it any more than it is already closed.`);
                    return;
                }
                obj.open = false;
                a.ply.sendMessage(`You carefully shut the ${obj.forObject.name}`);
                return;
            }

            a.ply.sendMessage('You try to close the object, but can\'t reach it');
        },
    });
    registerGlobalVerb(closeVerb);
}