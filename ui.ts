
import * as bnf from 'ebnf-parser';
import {Jison} from 'jison';
import {Vertex} from './fol';

const oReq = new XMLHttpRequest();
oReq.addEventListener('load', ready);
oReq.open('GET', 'ring.jison');
oReq.send();

function ready() {
    const grammar = this.responseText;
    const cfg = bnf.parse(grammar);
    const parser = Jison.Generator(cfg, {type: 'lalr'}).createParser();

    const arrRingAxiomStrings: string[] = [
        'a + (b + c) = (a + b) + c',
        'a + 0 = a',
        'a + (-a) = 0',
        'a + b = b + a',
        'a * (b * c) = (a * b) * c',
        'a * 1 = a',
        '1 * a = a',
        'a * (b + c) = (a * b) + (a * c)',
        '(b + c) * a = (b * a) + (c * a)'
    ];

    const arrRingAxioms = arrRingAxiomStrings.map((sAxiom: string): Vertex => {
        console.log(sAxiom);
        const vertex = parser.parse(sAxiom);
        console.log(vertex);
        return vertex;
    });

}

