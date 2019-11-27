import dict from '../dictionary';
import fs from 'fs';

test('Spanish word - libro', () => {
    const html = fs.readFileSync('./test/dict_libro.html', 'utf-8');
    const result = dict.extract(html);
    result.forEach(word => {
        expect(word.word).toBe("libro");
    });
});

test('English word - book', () => {
    const html = fs.readFileSync('./test/dict_book.html', 'utf-8');
    const result = dict.extract(html);
    expect(result).toBe("book");
});

/*
test('Bilingual word - once', () => {
// We expect to see both Spanish and English results
});
 */


/*
 *
test('Real-world query - libro', () => {
// Similar test but this one queries the word from SpanishDict.com
});
 */
