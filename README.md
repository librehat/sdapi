# Unofficial SpanishDict API
[![npm version](https://badge.fury.io/js/sdapi.svg)](https://badge.fury.io/js/sdapi)

`sdapi` provides an unofficial node.js API to get translations and conjugations from SpanishDict.com.

## Usage
```js
import sdapi from 'sdapi';

sdapi.translate('libro').then(console.log);
sdapi.conjugate('hacer').then(console.log);
```

Or in CommonJS style:

```js
const translate = require('sdapi').default.translate;
translate('libro').then(console.log);
```

## Development
After cloning this repository, please run `npm install` to install all the development dependencies.

This project is developed using TypeScript, which means you need to _compile_ the source code. This can be done by `npm run build`. Unit tests are written with Jest and can be run with `npm run test`.

## CLI
There are two dummy simiple CLI clients bundled in this repository, `sd-translate` and `sd-conjugate` for translations and conjugations respectively.
