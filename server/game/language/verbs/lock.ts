import { registerGlobalVerb, LanguagePart } from "../inputparsing";

export default ({}) =>{
    const lockVerb = new LanguagePart({
        semanticName: 'lock',
        handler: a => {            
            if (!a.probableSubject) {
                a.ply.sendMessage('What are you trying to lock? I don\'t think there\'s anything like that around here');
                return;
            }

            const obj = a.ply.world()?.objectByName(a.probableSubject.rootTerm.text());
            if (!obj || obj.forObject.hidden) {
                a.ply.sendMessage('I don\'t know what you\'re trying to lock.');
                return;
            }

            if (a.ply.world()?.PlayerCanReachObject(obj.forObject.id, a.ply)) {
                if (obj.locked) {
                    a.ply.sendMessage(`The ${obj.forObject.name} is already locked, you're not a locksmith, so your attempt to double lock it fails.`);
                    return;
                }
                if (obj.open) {
                    a.ply.sendMessage(`The ${obj.forObject.name} is still open, you need to close it before you can lock it.`);
                    return;
                }
                const room = a.ply.location;
                if (!room) {
                    a.ply.sendMessage(`You can't lock something when I don't know where you are...`);
                    return;
                }

                if (!obj.forObject.container) {
                    a.ply.sendMessage(`You can't lock the ${obj.forObject.name}.`)
                    return;
                }

                obj.locked = true;
                a.ply.sendMessage(`You lock the ${obj.forObject.name}, it's sealed up tight`);
                return;
            }

            a.ply.sendMessage(`You try to lock the ${obj.forObject.name}, but can't reach it`);
        },
    });
    registerGlobalVerb(lockVerb);
}