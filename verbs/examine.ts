import { registerGlobalVerb, LanguagePart } from "../services/player/inputparsing";

export default ({}) =>{
    const verbExamine = new LanguagePart({
        semanticName: 'examine',
        synonyms: ['look', 'check', 'inspect'],
        handler: a => {
            
        },
    });
    registerGlobalVerb(verbExamine);
}