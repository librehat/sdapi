//@ts-ignore
import { parse } from 'himalaya';
import fetch from 'node-fetch';

enum Gender {
    Masculine,
    Femeline,
    Neutral
}

enum Language {
    English = 'en',
    Spanish = 'es'
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
    const json = parse(html);
    const resultsLine = json[1].children[0].children[20].children[0].content.split('\n')
                        .find((line: string) => line.includes('SD_DICTIONARY_RESULTS_PROPS'));
    if (!resultsLine) {
        throw new Error('Cannot find SD_DICTIONARY_RESULTS_PROPS. SpanishDict API might have changed');
    }
    const resultsProps = JSON.parse(resultsLine.substring(resultsLine.indexOf('=') + 1,
                                                          resultsLine.length - 1));
    let result: Array<WordResult> = [];
    for (const lang of [Language.Spanish, Language.English]) {
        const entry = resultsProps[lang].entry;
        if (!entry) {
            continue;
        }
        const neodict = entry.neodict;
        if (!neodict || !neodict.length) {
            throw new Error('Cannot find neodict. SpanishDict API might have changed');
        }
        result = result.concat(neodict.map((nd: any) => nd.posGroups).flat()
        .map((posGroup: any) => posGroup.senses).flat()
        .map((sense: any) => convertSense(sense, lang)));
    }
    return result;
}

function query(word: string): Promise<Array<WordResult>> {
    if (!word.length) {
        return Promise.reject(new Error('Zero-length word'));
    }
    const url = "https://www.spanishdict.com/translate/" + word;
    return fetch(url)
    .then(res => res.text())
    .then(text => extract(text));
}

export default {
    extract,
    query
};
