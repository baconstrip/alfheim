import nlp from 'compromise';
import baseLanguage from '../lib/directionextension'
import directionextension from '../lib/directionextension';
 

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