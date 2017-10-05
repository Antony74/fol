
import * as bnf from 'ebnf-parser';
import {Jison} from 'jison';

const oReq = new XMLHttpRequest();
oReq.addEventListener('load', ready);
oReq.open('GET', 'ring.jison');
oReq.send();

function ready() {
    const grammar = this.responseText;
    const cfg = bnf.parse(grammar);
    const parser = Jison.Generator(cfg, {type: 'lalr'}).createParser();

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

    parser.parse(arrRingAxioms[0]);

}

