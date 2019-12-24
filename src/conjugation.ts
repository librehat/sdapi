//@ts-ignore
import { parse } from 'himalaya';
import fetch from 'node-fetch';
import { Person, CNumber, Tense, Mood, Form } from './constants';
import { hasAttribute, attributeValue, isTagType, flattenText } from './util';

interface ConjugationResult {
    person?: Person;
    number?: CNumber;
    tense: Tense;
    mood: Mood;
    form: Form;
    sdTense: string; // This holds the 'data-tense' from the SpanishDict
    word: string;
}

/**
 * From SpanishDict, the accidents to the verb are a bit mixed up. For example,
 * 'person' and 'number' are now in the same classification as 'person':
 *   First Singular = 0, // Yo
 *   Second Singular = 1, // Tú
 *   Thrid Singular = 2, // Él/Ella/Usted
 *   First Plural = 3, // Nosotros
 *   Second Plural = 4, // Vosotros
 *   Third Plural = 5, // Ellos/Ellas/Ustedes
 *   Any (?) = 6
 * 
 * The same has happened to the tenses. Tense is used in their data structure for both
 * simple tenses and compound tenses. It also has the infomration of mood.
 *   presentIndicative = Present, Indicative
 *   preteritIndicative = Preterite, Indicative
 *   imperfectIndicative = Imperfect, Indicative
 *   conditionalIndicative = Conditional, Indicative
 *   presentSubjunctive = Present, Subjunctive
 *   imperfectSubjuncitve = Imperfect, Subjunctive
 *   imperfectSubjunctive2 = Imperfect2, Subjunctive
 *   futureSubjunctive = Future, Subjunctive
 *   imperative = Affirmative, Imperative
 *   negativeImperative = Negative, Imperative
 *   presentContinuous = Present, Continuous / Progressive (Compound)
 *   preteritContinuous = Preterite, Continuous / Progressive (Compound)
 *   imperfectContinuous = Imperfect, Continuous / Progressive (Compound)
 *   conditionalContinuous = Conditional, Continuous / Progressive (Compound)
 *   futureContinuous = Future, Continuous / Progressive (Compound)
 *   presentPerfect = Present, Perfect (compound tense)
 *   preteritPerfect = Preterite, Perfect (compound tense)
 *   pastPerfect = Past, Perfect (compound tense)
 *   conditionalPerfect = Conditional, Perfect (compound tense)
 *   futurePerfect = Future, Perfect (compound tense)
 *   presentPerfectSubjunctive = Present, Perfect Subjunctive (compound tense)
 *   pastPerfectSubjunctive = Past, Perfect Subjunctive (compound tense)
 *   futurePerfectSubjunctive = Future, Perfect Subjunctive (compound tense)
 */

function sdPersonToPerson(person: string): Person|undefined {
    if (person === '0' || person === '3') {
        return Person.First;
    }
    if (person === '1' || person === '4') {
        return Person.Second;
    }
    if (person === '2' || person === '5') {
        return Person.Third;
    }
}

function sdPersonToNumber(person: string): CNumber|undefined {
    const num = Number.parseInt(person, 10);
    if (Number.isNaN(num)) {
        return;
    }
    if (0 <= num && num <= 2) {
        return CNumber.Singular;
    }
    if (3 <= num && num <= 5) {
        return CNumber.Plural;
    }
}

function sdTenseToTense(tense: string): Tense {
    const match = /[A-Z][^\d]*/.exec(tense);
    if (match) {
        tense = tense.substring(0, match.index) + tense.substring(match.index + match[0].length);
    }
    switch (tense) {
        case 'present':
            return Tense.Present;
        case 'preterit':
            return Tense.Preterite;
        case 'imperfect':
            return Tense.Imperfect;
        case 'imperfect2':
            return Tense.Imperfect2;
        case 'future':
            return Tense.Future;
        case 'imperative':
            return Tense.Affirmative;
        case 'negative':
            return Tense.Negative;
        case 'conditional':
            return Tense.Conditional;
        case 'past':
            return Tense.Past;
    }
    throw new Error(`Unknown tense ${tense}`);
}

function sdTenseToMood(tense: string): Mood {
    const lcTense = tense.toLowerCase();
    if (lcTense.includes('indicative')) {
        return Mood.Indicative;
    }
    if (lcTense.includes('subjunctive')) {
        return Mood.Subjunctive;
    }
    if (lcTense.includes('imperative')) {
        return Mood.Imperative;
    }
    return Mood.Indicative;
}

function sdTenseToForm(tense: string): Form {
    if (tense.includes('Continuous')) {
        return Form.Progressive;
    }
    if (tense.includes('Perfect')) {
        return Form.Perfect;
    }
    return Form.Simple;
}

/**
 * Trims the unnecessary branches and returns the part that contains the conjugation
 * as an object array.
 * @param {String} html
 * @return {Array<Object>}
 */
function extractConjugationJson(html: string): Array<any> {
    const json = parse(html);
    const link = attributeValue(json[1].children[0].children[1], 'href');
    if (link.indexOf('https://www.spanishdict.com/conjugate/') !== 0) {
        throw new Error('No conjugation found. Maybe it was not a verb?');
    }
    const contentDiv = json[1].children[1].children[0].children
    .find((tag: any) => isTagType(tag, 'element', 'div') && hasAttribute(tag, 'class', 'content-container container'));
    if (!contentDiv) {
        throw new Error('Couldn\'t find the content div. SpanishDict API might have changed.');
    }
    const mainContainer = contentDiv.children.find((tag: any) => hasAttribute(tag, 'id', 'main-container-flex'));
    if (!mainContainer) {
        throw new Error('Couldn\'t find the main container. SpanishDict API might have changed.');
    }
    const conjugation = mainContainer.children[0].children
    .find((tag: any) => isTagType(tag, 'element', 'div') && hasAttribute(tag, 'class', 'conjugation'));
    if (!conjugation) {
        throw new Error('Couldn\'t find the conjugation div. SpanishDict API might have changed');
    }
    return conjugation;
}

function convertTagToConjugationResult(tag: any): ConjugationResult {
    const sdPerson = attributeValue(tag, 'data-person');
    const sdTense = attributeValue(tag, 'data-tense');
    const word = flattenText(tag.children);
    return {
        person: sdPersonToPerson(sdPerson),
        number: sdPersonToNumber(sdPerson),
        tense: sdTenseToTense(sdTense),
        mood: sdTenseToMood(sdTense),
        form: sdTenseToForm(sdTense),
        sdTense: sdTense,
        word: word
    };
}

/**
 * Recursively converts the JSON to ConjugationResult array
 */
function convertTagToConjugationResults(tag: any): Array<ConjugationResult> {
    let results: Array<ConjugationResult> = [];
    if (isTagType(tag, 'element') && hasAttribute(tag, 'data-person')) {
        results.push(convertTagToConjugationResult(tag));
    } else if (tag.children) {
        tag.children.forEach((childTag: any) => {
            results = results.concat(convertTagToConjugationResults(childTag));
        });
    }
    return results;
}

function extract(html: string): Array<ConjugationResult> {
    return convertTagToConjugationResults(extractConjugationJson(html));
}

async function query(verb: string): Promise<Array<ConjugationResult>> {
    if (!verb.length) {
        return Promise.reject(new Error('Zero-length word'));
    }
    const res = await fetch(`https://www.spanishdict.com/conjugate/${verb}`);
    return extract(await res.text());
}

export {
    convertTagToConjugationResults,
    extract,
    query
};
export default query;
