import { Gender, Language } from './constants';
import { extractComponentData } from './util';

export interface Example {
    original: string;
    translated: string;
}

export interface WordResult {
    lang: Language;
    word: string;
    gender?: Gender;
    pronunciation?: string;
    context: string;
    meaning: string;
    part: string;  // TODO: make it an enum
    examples: Array<Example>;
    regions: Array<string>;
}

function convertGender(gender: string): Gender {
    if (gender === 'M') {
        return Gender.Masculine;
    }
    if (gender === 'F') {
        return Gender.Femeline;
    }
    return Gender.Neutral;
}

function convertExample(example: any, lang: Language): Example {
    const originalKey = (lang === Language.Spanish ? "textEs" : "textEn");
    const translatedKey = (lang === Language.Spanish ? "textEn" : "textEs");
    return {
        original: example[originalKey],
        translated: example[translatedKey]
    };
}

function convertSense(sense: any, lang: Language): WordResult {
    const translation = sense.translations[0];
    return {
        word: sense.subheadword,
        lang: lang,
        gender: sense.gender ? convertGender(sense.gender) : undefined,
        context: sense.context,
        meaning: translation.translation,
        part: sense.partOfSpeech.nameEn,
        examples: translation.examples.map((eg: any) => convertExample(eg, lang)),
        regions: sense.regions.map((region: any) => region.nameEn)
    };
}

function extract(html: string): Array<WordResult> {
    const resultsProps = extractComponentData(html).sdDictionaryResultsProps;
    const neodict = resultsProps?.entry?.neodict;
    if (!neodict || !neodict.length) {
        throw new Error('Cannot find neodict. SpanishDict API might have changed');
    }
    return neodict
    .map((nd: any) => nd.posGroups).flat()
    .map((posGroup: any) => posGroup.senses).flat()
    .map((sense: any) => convertSense(sense, resultsProps.entryLang));
}

export default extract;
