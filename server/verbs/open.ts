import { registerGlobalVerb, LanguagePart } from "../player/inputparsing";

export default ({}) =>{
    const openVerb = new LanguagePart({
        semanticName: 'open',
        handler: a => {            
            if (!a.probableSubject) {
                a.ply.sendMessage('What are you trying to open? I don\'t think there\'s anything like that around here');
                return;
            }

            const obj = a.ply.world()?.objectByName(a.probableSubject.rootTerm.text());
            if (!obj || obj.forObject.hidden) {
                a.ply.sendMessage('I don\'t know what you\'re trying to open.');
                return;
            }

            if (a.ply.world()?.PlayerCanReachObject(obj.forObject.id, a.ply)) {
                if (obj.open) {
                    a.ply.sendMessage(`The ${obj.forObject.name} is already open, try as you might, you can't open it any more than it is already open.`);
                    return;
                }
                if (obj.locked) {
                    a.ply.sendMessage(`You attempt to open the ${obj.forObject.name}, but it's locked. Have you tried unlocking it first?`)
                    return;
                }
                obj.open = true;
                a.ply.sendMessage(`You pull open the ${obj.forObject.name}`);
                return;
            }

            a.ply.sendMessage(`You try to open the ${obj.forObject.name}, but can't reach it`);
        },
    });
    registerGlobalVerb(openVerb);
}