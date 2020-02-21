#!/usr/bin/env bash

for word in "libro" "book" "once"; do
    curl -o dict_$word.html https://www.spanishdict.com/translate/$word
done

for word in "como" "hacer"; do
    curl -o conjug_$word.html https://www.spanishdict.com/conjugate/$word
done

