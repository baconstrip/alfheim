import nlp from 'compromise';
import baseLanguage from './directionextension'
import directionextension from './directionextension';
 

export default ({}) => {
    nlp.extend(require('compromise-sentences'));
    directionextension({});
    nlp.extend((_: nlp.Document, world: nlp.World) => {
        world.postProcess(doc => {
            // This is terrible and needs to be done better.
            doc.match("^#Noun").terms().tag("#Verb").unTag("#Noun");
        });
    });
}