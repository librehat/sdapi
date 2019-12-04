enum Gender {
    Masculine,
    Femeline,
    Neutral
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
    Singular = 's',
    Plural = 'p'
}

enum Tense {
    Present,
    Preterite,
    Imperfect,
    Conditional,
    Imperfect2,
    Future,
    Affirmative,
    Negative,
    Past
}

enum Mood {
    Indicative,
    Subjunctive,
    Imperative
}

// Not a linguist, just trying to separate them in the program
enum Form {
    Simple,
    Progressive, // also known as continuous
    Perfect
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