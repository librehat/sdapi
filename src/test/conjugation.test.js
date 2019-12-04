import { extract, query } from '../conjugation';
import { Person, CNumber, Tense, Mood, Form } from '../constants';
import fs from 'fs';

test('Spanish word - hacer', () => {
    const html = fs.readFileSync('./src/test/conjug_hacer.html', 'utf-8');
    const result = extract(html);
    expect(result).toContainEqual({
        person: Person.First,
        number: CNumber.Singular,
        tense: Tense.Present,
        mood: Mood.Indicative,
        form: Form.Simple,
        sdTense: 'presentIndicative',
        word: 'hago'
    });
    expect(result).toContainEqual({
        person: Person.Second,
        number: CNumber.Singular,
        tense: Tense.Imperfect2,
        mood: Mood.Subjunctive,
        form: Form.Simple,
        sdTense: 'imperfectSubjunctive2',
        word: 'hicieses'
    });
    expect(result).toContainEqual({
        person: Person.Third,
        number: CNumber.Plural,
        tense: Tense.Negative,
        mood: Mood.Imperative,
        form: Form.Simple,
        sdTense: 'negativeImperative',
        word: 'no hagan'
    });
    expect(result).toContainEqual({
        person: Person.First,
        number: CNumber.Plural,
        tense: Tense.Conditional,
        mood: Mood.Indicative,
        form: Form.Progressive,
        sdTense: 'conditionalContinuous',
        word: 'estaríamos haciendo'
    });
    expect(result).toContainEqual({
        person: Person.Second,
        number: CNumber.Singular,
        tense: Tense.Past,
        mood: Mood.Subjunctive,
        form: Form.Perfect,
        sdTense: 'pastPerfectSubjunctive',
        word: 'hubieras hecho'
    });
});

test('Real-world query - hacer', async () => {
    // Similar test but this one queries the word from SpanishDict.com
    const result = await query('hacer');
    expect(result).toContainEqual({
        person: Person.First,
        number: CNumber.Singular,
        tense: Tense.Present,
        mood: Mood.Indicative,
        form: Form.Simple,
        sdTense: 'presentIndicative',
        word: 'hago'
    });
});