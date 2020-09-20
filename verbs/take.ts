import { registerGlobalVerb, LanguagePart } from "../services/player/inputparsing";

export default ({}) =>{
    const takeVerb = new LanguagePart({
        semanticName: 'take',
        synonyms: ['grab', 'lift'],
        handler: a => {            
            if (!a.probableSubject) {
                a.ply.sendMessage('What are you trying to grab? I don\'t think there\'s anything like that around here');
                return;
            }
            const obj = a.ply.world()?.objectByName(a.probableSubject.rootTerm.text());
            if (!obj || obj.forObject.hidden) {
                a.ply.sendMessage('I don\'t know what you\'re trying to grab.');
                return;
            }

            if (!obj.forObject.portable) {
                a.ply.sendMessage('Try as you might, it won\'t budge. Not even a little');
                return;
            }

            if (a.ply.world()?.PlayerCanReachObject(obj.forObject.id, a.ply)) {
                const otherInv = a.ply.location.fromWorld.findObjectHolder(obj.forObject.id);
                if (!otherInv)  {
                    throw new Error("Can't manage inventory when not found");
                }
                if (a.ply.inventory.isFull()) { 
                    a.ply.sendMessage("You look down at the object, and think about how much you're " +
                        "already carrying. You can't bear the thought of carrying yet one more item.")
                    return;
                }
                if (!otherInv.transferTo(a.ply.inventory, obj)) {
                    a.ply.sendMessage("A mysterious force has prevented you from taking it...");
                    return;
                }
                a.ply.sendMessage(`You take ${obj.forObject.name} and place it in your inventory...`);
                a.ply.updateInventory();
                return;
            }

            a.ply.sendMessage('You try to take the object, but can\'t reach it');
        },
    });
    registerGlobalVerb(takeVerb);
}