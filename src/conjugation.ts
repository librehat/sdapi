import fetch from 'node-fetch';
import { Person, CNumber, Tense, Mood, Form } from './constants';
import { extractComponentData } from './util';

interface ConjugationResult {
    person?: Person;
    number?: CNumber;
    tense: Tense;
    mood: Mood;
    form: Form;
    paradigm: string; // This holds the 'paradigm' from the SpanishDict
    word: string;
}

/**
 * The same has happened to the tenses. Tense is used in their data structure for both
 * simple tenses and compound tenses. It also has the infomration of mood.
 * From SpanishDict, the tenses of the verb are a bit mixed up. For example,
 * 
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

function convertPronounToPerson(person: string): Person|undefined {
    if (person === 'yo' || person === 'nosotros') {
        return Person.First;
    }
    if (person === 'tú' || person === 'vosotros') {
        return Person.Second;
    }
    const thirdPersons = [ 'él', 'ella', 'Ud.', 'ellos', 'ellas', 'Uds.' ];
    if (thirdPersons.some(p => person.includes(p))) {
        return Person.Third;
    }
}

function convertPronounToNumber(person: string): CNumber|undefined {
    const singulars = [ 'yo', 'tú', 'él', 'ella', 'Ud.' ];
    const plurals = [ 'nosotros', 'vosotros', 'ellos', 'ellas', 'Uds.' ];
    if (singulars.some(singular => person.includes(singular))) {
        return CNumber.Singular;
    }
    if (plurals.some(plural => person.includes(plural))) {
        return CNumber.Plural;
    }
}

function convertParadigmToTense(tense: string): Tense {
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

function convertParadigmToMood(tense: string): Mood {
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

function convertParadigmToForm(tense: string): Form {
    if (tense.includes('Continuous')) {
        return Form.Progressive;
    }
    if (tense.includes('Perfect')) {
        return Form.Perfect;
    }
    return Form.Simple;
}

function convertParadigmToConjugationResults(paradigm: string, data: []): Array<ConjugationResult> {
    return data.map((item: any) => ({
        person: convertPronounToPerson(item.pronoun),
        number: convertPronounToNumber(item.pronoun),
        tense: convertParadigmToTense(paradigm),
        mood: convertParadigmToMood(paradigm),
        form: convertParadigmToForm(paradigm),
        paradigm: paradigm,
        word: item.word
    }));
}

function extract(html: string): Array<ConjugationResult> {
    const componentData = extractComponentData(html);
    if (!componentData.altLangUrl.includes('/verbos/')) {
        throw new Error('No conjugation found. Maybe it was not a verb?');
    }
    const paradigms = componentData.verb?.paradigms;
    if (!paradigms) {
        throw new Error('Couldn\'t find paradigms in the component data. SpanishDict API might have changed');
    }
    let results: Array<ConjugationResult> = [];
    for (const paradigm in paradigms) {
        results = results.concat(convertParadigmToConjugationResults(paradigm, paradigms[paradigm]));
    }
    return results;
}

async function query(verb: string): Promise<Array<ConjugationResult>> {
    if (!verb.length) {
        return Promise.reject(new Error('Zero-length word'));
    }
    const res = await fetch(`https://www.spanishdict.com/conjugate/${verb}`);
    return extract(await res.text());
}

export {
    extract,
    query
};
export default query;
