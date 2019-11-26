import dict from '../dictionary';
import fs from 'fs';

test('Spanish word - libro', () => {
    const html = fs.readFileSync('./test/dict_libro.html', 'utf-8');
    const result = dict.extract(html);
    expect(result).toBe("libro");
});

test('English word - book', () => {
    const html = fs.readFileSync('./test/dict_book.html', 'utf-8');
    const result = dict.extract(html);
    expect(result).toBe("book");
});
