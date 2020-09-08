import * as Messages from '../../types/messages';
import { EventBus } from '../eventbus';
import { AlfEvent } from '../../types/events';
import Player from '../../types/game/player';
import { replacePunctuation } from '../../lib/util';
import nlp from 'compromise';


type LanguageExtension = (doc: nlp.Document, world: nlp.World) => void;

export class LanguagePart {
    debugName?: string;
    semanticName: string;
    synonyms?: string[];

    languageInstructions?: LanguageExtension[];

    constructor(s: {
        semanticName: string,
        debugName?: string,
        synonyms?: string[],
        languageInstructions?: LanguageExtension[],
    }) {
        this.semanticName = s.semanticName;
        this.synonyms = s.synonyms;
        this.debugName = s.debugName;
        this.languageInstructions = s.languageInstructions;
    }
}

// Singleton manager.
class InputManager {
    wordReplacements: Map<string, string>;

    constructor() {
        this.wordReplacements = new Map();
    }
}
var ___inst: InputManager;

function replaceAll(input: string, find: RegExp, replace: string): string {
    return input.replace(new RegExp(find, 'g'), replace);
}

function fixWhitespace(input: string): string {
    return input.trim().replace(/\s{2,}/g, ' ');
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
    ___inst.wordReplacements
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
        // This should probably do multiple nested clauses, but I can't be bothered.
        let found = false;
        const matched = y.match('[<prev>#Verb .+? #Noun .+?] and [<next>.+? #Verb .+?]').splitAfter('and');
        if (matched.some(_=>true)) {
            matched.lastTerms().delete('and');
            sections = matched;
        }
    });

    sections.forEach(x => {
        cb(x);
    })
}

function handleRawInput(ply: Player, input: string) {
    // Step one, clean the input.
    const puncless = replacePunctuation(input).toLowerCase();

    // Normalize input to replace punctuation with regular interpretation.
    const normalised = normalisePunctuation(puncless);


    breakSentences(nlp(normalised), (statement) => {

        ply.sendMessage("I think you said " + statement.text(), statement.termList())
        console.log("%O", statement.nouns());
        console.log("%O", statement.verbs());
        console.log("%O", statement.topics());
        console.log("%O", statement.sentences());
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
            handleRawInput(ply, body);
        }
    });
};
