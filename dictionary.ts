//@ts-ignore
import { parse } from 'himalaya';

enum Gender {
    Masculine,
    Femeline,
    Neutral
}

enum Language {
    English,
    Spanish
}

interface Example {
    original: string;
    translated: string;
}

interface WordResult {
    lang: Language;
    word: string;
    gender?: Gender;
    pronunciation?: string;
    meaning: string;
    examples: Array<Example>;
}

function convertLang(lang: string): Language {
    return lang === 'es' ? Language.Spanish : Language.English;
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
        meaning: translation.translation,
        examples: translation.examples.map((eg: any) => convertExample(eg, lang))
    };
}

function extract(html: string): Array<WordResult> {
    const json = parse(html);
    const resultsLine = json[1].children[0].children[20].children[0].content.split('\n')
                        .find((line: string) => line.includes('SD_DICTIONARY_RESULTS_PROPS'));
    const resultsProps = JSON.parse(resultsLine.substring(resultsLine.indexOf('=') + 1, resultsLine.length - 1));
    const lang = resultsProps.es.entry ? Language.Spanish : Language.English;
    const entry = lang === Language.Spanish ? resultsProps.es.entry : resultsProps.en.entry;
    if (!entry) {
        throw new Error('Unknown results');
    }
    const neodict = entry.neodict;
    if (!neodict || !neodict.length) {
        throw new Error('No results');
    }
    console.log(JSON.stringify(neodict));
    return neodict.map((nd: any) => nd.posGroups).flat()
    .map((posGroup: any) => posGroup.senses).flat()
    .map((sense: any) => convertSense(sense, lang));
}

function query(word: string): Array<WordResult> {
    let html = "" + word; // TODO
    return extract(html);
}

export default {
    extract,
    query
};
