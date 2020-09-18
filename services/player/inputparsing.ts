import * as Messages from '../../types/messages';
import { EventBus } from '../eventbus';
import { AlfEvent } from '../../types/events';
import Player from '../../types/game/player';
import { replacePunctuation } from '../../lib/util';
import nlp from 'compromise';
import { Instance } from '../../types/game/worldinstance';
import _ from 'lodash';
import { EntityTypeToTag } from '../../types/game/worldentitytype';

type LanguageExtension = (doc: nlp.Document, world: nlp.World) => void;

type LanguageHandler = (a: {
    sentence: Sentence, 
    ply: Player, 
    instance?: Instance,
    probableSubject?: WordTree,
}) => void;

export class LanguagePart {
    debugName?: string;
    semanticName: string;
    synonyms?: string[];
    ___alternatives: string[];

    /**
     * languageInstructions contain extensions to compromise itself to improve
     * language processing on aribitrary related words.
     */
    languageInstructions?: LanguageExtension[];

    /**
     * handlers implement the behaviour when a player says a sentence that
     * trigger this LanaguagePart.
     */
    handler: LanguageHandler;

    constructor(s: {
        semanticName: string,
        debugName?: string,
        synonyms?: string[],
        languageInstructions?: LanguageExtension[],
        handler: LanguageHandler;
    }) {
        this.semanticName = s.semanticName;
        this.synonyms = s.synonyms;
        this.debugName = s.debugName;
        this.languageInstructions = s.languageInstructions;
        this.handler = s.handler;

        let names = this.synonyms ?? [];
        names.push(this.semanticName);
        this.___alternatives = names;
    }
}

/**
 * WordTree contains a set of words associated to the root word. 
 * Generally attempts to treat proper nouns of the world as one word.
 */
class WordTree {
    rootTerm: nlp.ExtendedDocument<{}, nlp.World, nlp.Phrase>;
    modifiers: nlp.Term[] = [];

    gameObject: boolean;

    constructor(root: nlp.ExtendedDocument<{}, nlp.World, nlp.Phrase>, gameObject: boolean) {
        this.rootTerm = root;
        this.gameObject = gameObject;
    }

    addModifier(w: nlp.Term) {
        this.modifiers.unshift(w);
    }

    debugPrint() {
        console.log("Term:\n%O", this.rootTerm?.text());
        this.modifiers.forEach(x => {
            console.log("\t%O", (x as any).text())
        })
    }

    /**
     * Returns a preposition if this term is modified by one.
     * Useful for determining if this phrase is the subject of a sentence.
     */
    modifiedByPreposition(): nlp.Term | undefined {
        this.modifiers.forEach(x => {
            if ((x as any).match('#Preposition')) {
                return x;
            }
        })
        return undefined;
    }
}

/**
 * Sentences represent a single imperative 
 */
class Sentence {
    text: string;
    parsed: nlp.ExtendedDocument<{}, nlp.World, nlp.Phrase>;
    verb?: nlp.Term = undefined;
    topics?: nlp.ExtendedDocument<{}, nlp.World, nlp.Phrase>;

    trees: WordTree[] = [];
    //gameObjects?: nlp.ExtendedDocument<{}, nlp.World, nlp.Phrase>;

    constructor(doc: nlp.ExtendedDocument<{}, nlp.World, nlp.Phrase>) {
        this.parsed = doc;
        this.text = doc.text();
    }

    /**
     * build creates a sentence from its inputs. Returns false if parsing the
     * sentence failed.
     */
    build(): boolean {
        // For now, a sentence has one verb or its invalid.
        this.parsed.termList().forEach (w => {
            if (w.tags['Verb']) {
                if (this.verb) {
                    return false;
                }
                this.verb = w;
            }
        });

        const cb = (o: nlp.ExtendedDocument<{}, nlp.World, nlp.Phrase>) => {
            // Create a tree and look backwards through the sentence till we
            // find a verb or noun, then stop. Each stage prepends a word to the
            // tree of the noun that appears after it.
            const tree = new WordTree(o, true);
            o.lookBehind('.').reverse().some(x => {
                if ((x as any).match('(#Noun|#Verb)').some((_:any)=>true)) {
                    return true;
                }
                tree.addModifier((x as any).firstTerms());
                return false;
            });
            this.trees.push(tree);
        }

        // For each game object in the sentence, this is a bit dumb, but
        // should work well for most input.
        const objects = this.parsed.match("#GameObject+"); 
        objects.forEach(cb);

        const directions = this.parsed.match("#Direction");
        directions.forEach(cb);
        return true;
    }

    pickProbableSubject(): WordTree | undefined {
        // If we have no nouns, treat it as a subjectless command.
        if (this.trees.length == 0) {
            return undefined;
        }
        // Pick the only one, if there is only one.
        if (this.trees.length == 1) {
            return this.trees[0];
        }

        let marked: WordTree | undefined = undefined;
        _.forEachRight(this.trees, x => {
            if (x.modifiedByPreposition()) {
                marked = x;
                return;
            }
        });
        if (marked) {
            return marked;
        }

        // Otherwise pick the last one.
        return this.trees[-1];
    }

    debugPrint() {
        console.log("Sentence with verb %O:", this.verb?.text);
        this.trees.forEach(x => {
            x.debugPrint();
        });
    }
}

// Singleton manager.
class InputManager {
    wordReplacements: Map<string, string>;
    globalVerbs: LanguagePart[] = [];

    constructor() {
        this.wordReplacements = new Map();
    }

    handleSentence(s: Sentence, ply: Player) {
        if (!s.verb) {
            ply.sendMessage("I'm sorry, I don't understand what you're trying to say. Try speaking imperatively with simple commands.");
            return;
        }


        // This is actual location where verbs are run.
        const verbCallback = (verb: LanguagePart) => {
            verb.handler({
                sentence: s,
                ply: ply,
                instance: ply.location?.fromWorld,
                probableSubject: s.pickProbableSubject(),
            });
        }

        // Right now, we only check the global verbs to see if its one of them.
        const ran = this.globalVerbs.some(verb => {
            return verb.___alternatives.some(x => {
                if (x == s.verb?.text) {
                    verbCallback(verb);
                    return true;
                }
                return false;
            });
        });

        if (!ran) {
            ply.sendMessage(`I'm sorry, I don't know how to ${s.verb?.text}.`);
            return;
        }
    }
}
var ___inst: InputManager;

function replaceAll(input: string, find: RegExp, replace: string): string {
    return input.replace(new RegExp(find, 'g'), replace);
}

/**
 * Updates a string to use words more regularly, replacing certain words to
 * make it easier on the language parser.
 * 
 * This is very aggressive, and will often remove context, use only to fix
 * issues with language processing.
 * 
 * NOT USED, consider this
 */
function normalizeWords(input: string): string {
    return "";
}

/**
 * Replaces common punctuation with standard interpretations to make parsing
 * more uniform.
 * 
 * Currently only works with ','.
 */
function normalisePunctuation(input: string): string {
    return replaceAll(input, /\,+/, " and ");
}


/**
 * Breaks apart the input into sentences and excutes cb on each section
 * individually.
 * 
 * @param cb 
 */
function breakSentences(input: nlp.ExtendedDocument<{}, nlp.World, nlp.Phrase>, cb: (x: nlp.ExtendedDocument<{}, nlp.World, nlp.Phrase>) => void) {
    let sections = input.sentences();
    input.sentences().forEach((y) => {
        // This should probably do multiple nested clauses, but I can't be 
        // bothered.
        const matched = y.match('[<prev>#Verb .+? #Noun .+?] and [<next>.+? #Verb .+?]').splitAfter('and');
        if (matched.some(_=>true)) {
            matched.lastTerms().delete('and');
            sections = matched;
        }
    });

    let splits = sections;

    // NOTE TO SELF: this hack with the phrase as any is what's needed to 
    // fix this code.
    // const splits = sections.map((y: nlp.Phrase) => {
    //     const matches = (y as any).match("#Verb");
    //     console.log('matches: %O', matches);
    //     return matches;
    // })
    // This is going to need a lot more work, for now, let's ignore it
    // and move on.
    // sections.forEach(y => {
    //     const matched = y.match('[<prev>#Verb  .+?] and [<next>.+? #Verb .+]').splitAfter('and');
    //     console.log("Matching.. %O", matched)
    //     if(matched.some(_=>true)) {
    //         matched.lastTerms().delete('and');
    //         const postfix = matched.match('#Verb [.?+]').groups()[0];
    //         matched.groups()['prev'].append(postfix.text());
    //         splits = matched;
    //     }
    // });

    splits.forEach(x => {
        cb(x);
    })
}

/**
 * Takes a crude pass over all the objects in a player's world to attempt to
 * match objects that exist in their world with GameObject. Tags all objects in
 * the WorldLexicon() of the player's instance.
 */
function tagWorldObjects(ply: Player, input: nlp.ExtendedDocument<{}, nlp.World, nlp.Phrase>, cb: (x: nlp.ExtendedDocument<{}, nlp.World, nlp.Phrase>) => void) {
    const lexicon = ply.location?.fromWorld.WorldLexicon();
    input.forEach(x => {
        lexicon?.forEach((v, k) =>{
            x.match(k).canBe("#Noun? #Adjective?").tag("GameObject").tag(`#${EntityTypeToTag(v.t)}`);
        });
        cb(x);
    });
}

function handleTextInput(ply: Player, input: string) {
    // Step one, clean the input.
    const puncless = replacePunctuation(input).toLowerCase();

    // Normalize input to replace punctuation with regular interpretation.
    const normalised = normalisePunctuation(puncless);

    breakSentences(nlp(normalised), (x) => {
        tagWorldObjects(ply, x, (statement) => {
            ply.sendMessage("I think you said " + statement.text(), statement.termList())

            const sentence = new Sentence(statement);
            const success = sentence.build();
            ply.sendMessage(`The verb was ${sentence.verb?.text}: ${success}`);

            sentence.debugPrint();

            ___inst.handleSentence(sentence, ply);
        });
    });
}

function ignoreCommands(input: string): boolean {
    return input.trim().startsWith('/');
}

function addGlobalLanguageExtension(instructions?: LanguageExtension[]) {
    instructions?.forEach((x) => {
        nlp.extend(x);
    });
}

export function registerGlobalVerb(s: LanguagePart) {
    addGlobalLanguageExtension(s.languageInstructions);
    ___inst.globalVerbs.push(s);
};

export default async ({ }) => {
    ___inst = new InputManager();
    console.log('Created input module');
    EventBus.onEvent(AlfEvent.MESSAGE_IN, ({ ply, message }: { ply: Player, message: Messages.Msg }) => {
        if (message.type == Messages.ClientMessage.TEXT_INPUT) {
            const body = (message.body as any).input as string;
            if (ignoreCommands(body)) {
                return;
            }
            const start = new Date();
            handleTextInput(ply, body);
            const end = new Date();
            console.log("Time to perform request %Oms", end.getTime() - start.getTime());
        }
    });
};
