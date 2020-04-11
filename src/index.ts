import dict from './dictionary';
import conju from './conjugation';
import request from './request';


export default {
    translate: async (word: string) => dict(await request.translate(word)),
    conjugate: async (verb: string) => conju(await request.conjugate(verb))
};
