
import * as bnf from 'ebnf-parser';
import {Jison} from 'jison';
import {equals, ruleMatches, Vertex} from './fol';

const oReq = new XMLHttpRequest();
oReq.addEventListener('load', ready);
oReq.open('GET', 'ring.jison');
oReq.send();

function ready() {
    const grammar = this.responseText;
    const cfg = bnf.parse(grammar);
    const parser = Jison.Generator(cfg, {type: 'lalr'}).createParser();

    const arrRingAxiomStrings: string[] = [
        'a + (b + c) = (a + b) + c',        // Axiom 1
        'a + 0 = a',                        // Axiom 2
        'a + (-a) = 0',                     // Axiom 3
        'a + b = b + a',                    // Axiom 4
        'a * (b * c) = (a * b) * c',        // Axiom 5
        'a * 1 = a',                        // Axiom 6
        '1 * a = a',                        // Axiom 7
        'a * (b + c) = (a * b) + (a * c)',  // Axiom 8
        '(b + c) * a = (b * a) + (c * a)'   // Axiom 9
    ];

    // https://codegolf.stackexchange.com/a/143928/71303
    const arrProofStrings: string[] = [
        '(-a)*(-a)',
        '((-a)*(-a))+0',                                            // Axiom 2
        '((-a)*(-a))+(((a*a)+(a*(-a)))+(-((a*a)+(a*(-a)))))',       // Axiom 3
        '(((-a)*(-a))+((a*a)+(a*(-a))))+(-((a*a)+(a*(-a))))',       // Axiom 1
        '(((a*a)+(a*(-a)))+((-a)*(-a)))+(-((a*a)+(a*(-a))))',       // Axiom 4
        '((a*a)+((a*(-a))+((-a)*(-a))))+(-((a*a)+(a*(-a))))',       // Axiom 1
        '((a*a)+((a+(-a))*(-a)))+(-((a*a)+(a*(-a))))',              // Axiom 9
        '((a*a)+(0*(-a)))+(-((a*a)+(a*(-a))))',                     // Axiom 3
        '((a*(a+0))+(0*(-a)))+(-((a*a)+(a*(-a))))',                 // Axiom 2
        '((a*(a+(a+(-a))))+(0*(-a)))+(-((a*a)+(a*(-a))))',          // Axiom 3
        '(((a*a)+(a*(a+(-a))))+(0*(-a)))+(-((a*a)+(a*(-a))))',      // Axiom 8
        '((a*a)+((a*(a+(-a)))+(0*(-a))))+(-((a*a)+(a*(-a))))',      // Axiom 1
        '(a*a)+(((a*(a+(-a)))+(0*(-a)))+(-((a*a)+(a*(-a)))))',      // Axiom 1
        '(a*a)+((((a*a)+(a*(-a)))+(0*(-a)))+(-((a*a)+(a*(-a)))))',  // Axiom 8
        '(a*a)+(((a*a)+((a*(-a))+(0*(-a))))+(-((a*a)+(a*(-a)))))',  // Axiom 1
        '(a*a)+(((a*a)+((a+0)*(-a)))+(-((a*a)+(a*(-a)))))',         // Axiom 9
        '(a*a)+(((a*a)+(a*(-a)))+(-((a*a)+(a*(-a)))))',             // Axiom 2
        '(a*a)+0',                                                  // Axiom 3
        'a*a'                                                       // Axiom 2
    ];

    const arrRingAxioms = arrRingAxiomStrings.map((sAxiom: string): Vertex => {
        const vertex = parser.parse(sAxiom);
        return vertex;
    });

    const arrProof = arrProofStrings.map((sProofStep: string): Vertex => {
        const vertex = parser.parse(sProofStep);
        return vertex;
    });

    const step0: Vertex = arrProof[0];
    const step1: Vertex = arrProof[1];

    console.log('step0 and step1 are equal? (expect false)', equals(step0, step1));
    console.log('step0 and step1.lhs are equal? (expect true)', equals(step0, step1.lhs));
}

