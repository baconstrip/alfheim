import nlp from 'compromise';
import baseLanguage from '../lib/directionextension'
import directionextension from '../lib/directionextension';
 

export default ({}) => {
    nlp.extend(require('compromise-sentences'));
    directionextension({});
}