
import './node_modules/@types/node/index.d.ts';

const jison = require('./node_modules/jison/lib/jison.js');

const arrRingAxioms: string[] = [
    'a + (b + c) = (a + b) + c',
    'a + 0 = a',
    'a + (-a) = 0',
    'a + b = b + a',
    'a × (b × c) = (a × b) × c',
    'a × 1 = a',
    '1 × a = a',
    'a × (b + c) = (a × b) + (a × c)',
    '(b + c) × a = (b × a) + (c × a)'
];

