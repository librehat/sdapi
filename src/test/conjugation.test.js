import { extract, query } from '../conjugation';
import { Person, CNumber, Tense, Mood, Form } from '../constants';
import fs from 'fs';

test('Spanish verb - hacer', () => {
    const html = fs.readFileSync('./src/test/conjug_hacer.html', 'utf-8');
    const result = extract(html);
    expect(result).toContainEqual({
        person: Person.First,
        number: CNumber.Singular,
        tense: Tense.Present,
        mood: Mood.Indicative,
        form: Form.Simple,
        paradigm: 'presentIndicative',
        word: 'hago'
    });
    expect(result).toContainEqual({
        person: Person.Second,
        number: CNumber.Singular,
        tense: Tense.Imperfect2,
        mood: Mood.Subjunctive,
        form: Form.Simple,
        paradigm: 'imperfectSubjunctive2',
        word: 'hicieses'
    });
    expect(result).toContainEqual({
        person: Person.Third,
        number: CNumber.Plural,
        tense: Tense.Negative,
        mood: Mood.Imperative,
        form: Form.Simple,
        paradigm: 'negativeImperative',
        word: 'no hagan'
    });
    expect(result).toContainEqual({
        person: Person.First,
        number: CNumber.Plural,
        tense: Tense.Conditional,
        mood: Mood.Indicative,
        form: Form.Progressive,
        paradigm: 'conditionalContinuous',
        word: 'estaríamos haciendo'
    });
    expect(result).toContainEqual({
        person: Person.Second,
        number: CNumber.Singular,
        tense: Tense.Past,
        mood: Mood.Subjunctive,
        form: Form.Perfect,
        paradigm: 'pastPerfectSubjunctive',
        word: 'hubieras hecho'
    });
});

test('Real-world verb conjugation - hacer', async () => {
    // Similar test but this one queries the word from SpanishDict.com
    const result = await query('hacer');
    expect(result).toContainEqual({
        person: Person.First,
        number: CNumber.Singular,
        tense: Tense.Present,
        mood: Mood.Indicative,
        form: Form.Simple,
        paradigm: 'presentIndicative',
        word: 'hago'
    });
});

test('Spanish word (not a verb) - libro', () => {
    const html = fs.readFileSync('./src/test/dict_libro.html', 'utf-8');
    expect(() => extract(html)).toThrow('No conjugation found. Maybe it was not a verb?');
});

test('Spanish verb (non-inifinivo) - como', () => {
    const html = fs.readFileSync('./src/test/conjug_como.html', 'utf-8');
    const result = extract(html);
    expect(result).toContainEqual({
        person: Person.Third,
        number: CNumber.Singular,
        tense: Tense.Present,
        mood: Mood.Subjunctive,
        form: Form.Perfect,
        paradigm: 'presentPerfectSubjunctive',
        word: 'haya comido'
    });
});
