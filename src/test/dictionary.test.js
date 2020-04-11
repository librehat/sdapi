import extract from '../dictionary';
import { Gender, Language } from '../constants';
import request from '../request';
import fs from 'fs';

test('Spanish word - libro', () => {
    const html = fs.readFileSync('./src/test/dict_libro.html', 'utf-8');
    const result = extract(html);
    result.forEach(word => {
        expect(word.word).toMatch('libro');
    });
});

test('English word - book', () => {
    const html = fs.readFileSync('./src/test/dict_book.html', 'utf-8');
    const result = extract(html);
    result.forEach(word => {
        expect(word.word).toMatch('book');
    });
});

test('Bilingual word - once', () => {
    // SpanishDict by default only returns Spanish to English result
    // To get English to Spanish, `?langFrom=en` must be added in the URL
    const html = fs.readFileSync('./src/test/dict_once.html', 'utf-8');
    const result = extract(html);
    const es1 = {
        word: 'once',
        lang: Language.Spanish,
        gender: Gender.Masculine,
        context: 'number',
        meaning: 'eleven',
        part: 'noun',
        examples: [
            {
                original: 'El once es el número favorito de mi hermana.',
                translated: "Eleven is my sister's favorite number."
            }
        ],
        regions: []
    };
    const en1 = {
        word: 'once',
        lang: Language.English,
        gender: Gender.Neutral,
        context: 'when',
        meaning: 'una vez que',
        part: 'conjunction',
        examples: [
            {
                original: 'He fell exhausted to the ground once he crossed the finish line.',
                translated: 'Cayó exhausto al suelo una vez que cruzó la meta.'
            }
        ],
        regions: []
    };
    expect(result).toContainEqual(es1);
    expect(result).not.toContainEqual(en1);
});

test('Real-world query - libro', async () => {
    // Similar test but this one queries the word from SpanishDict.com
    const result = extract(await request.translate('libro'));
    result.forEach(word => {
        expect(word.word).toMatch('libro');
    });
});
