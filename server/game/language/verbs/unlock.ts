import { registerGlobalVerb, LanguagePart } from "../inputparsing";

export default ({}) =>{
    const unlockVerb = new LanguagePart({
        semanticName: 'unlock',
        handler: a => {            
            if (!a.probableSubject) {
                a.ply.sendMessage('What are you trying to unlock? I don\'t think there\'s anything like that around here');
                return;
            }

            const obj = a.ply.world()?.objectByName(a.probableSubject.rootTerm.text());
            if (!obj || obj.forObject.hidden) {
                a.ply.sendMessage('I don\'t know what you\'re trying to unlock.');
                return;
            }

            if (a.ply.world()?.PlayerCanReachObject(obj.forObject.id, a.ply)) {
                const room = a.ply.location;
                if (!room) {
                    a.ply.sendMessage(`You can't unlock something when I don't know where you are...`);
                    return;
                }
                if (obj.forObject.lock({ply: a.ply, room: room, inst: room.fromWorld, obj: obj})) {
                    a.ply.sendMessage(`You switftly undo the lock on the ${obj.forObject.name}, and it springs open`);
                    obj.locked = false;
                    obj.open = true;
                    return;
                } else {
                    // Assume the lock method told the player something.
                    return;
                }
            }

            a.ply.sendMessage(`You try to unlock the ${obj.forObject.name}, but can't reach it`);
        },
    });
    registerGlobalVerb(unlockVerb);
}