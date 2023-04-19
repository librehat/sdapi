enum Gender {
    Masculine = 'm',
    Femeline = 'f',
    Neutral = 'n'
}

enum Language {
    English = 'en',
    Spanish = 'es'
}

enum Person {
    First = '1st',
    Second = '2nd',
    Third = '3rd'
}

enum CNumber {
    Singular = 'sig',
    Plural = 'plr'
}

enum Tense {
    Present = 'present',
    Preterite = 'preterite',
    Imperfect = 'imperfect',
    Conditional = 'conditional',
    Imperfect2 = 'imperfect2',
    Future = 'future',
    Informal = 'informal',
    Affirmative = 'affirmative',
    Negative = 'negative',
    Past = 'past'
}

enum Mood {
    Indicative = 'ind',
    Subjunctive = 'sub',
    Imperative = 'imp'
}

// Not a linguist, just trying to separate them in the program
enum Form {
    Simple = 'simp',
    Progressive = 'prog', // also known as continuous
    Perfect = 'perf'
}

export {
    CNumber,
    Form,
    Gender,
    Language,
    Mood,
    Person,
    Tense
};
