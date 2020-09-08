import nlp from 'compromise';
import baseLanguage from '../lib/baselanguage'

export default ({}) => {
    nlp.extend(require('compromise-sentences'));
    baseLanguage({});
}