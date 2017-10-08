
import * as bnf from 'ebnf-parser';
import {Jison} from 'jison';
import {bidirectionalSearchAcrossRulesForMatches, Vertex} from './fol';

const oReq = new XMLHttpRequest();
oReq.addEventListener('load', ready);
oReq.open('GET', 'ring.jison');
oReq.send();

function ready() {
    const grammar = this.responseText;
    const cfg = bnf.parse(grammar);
    const parser = Jison.Generator(cfg, {type: 'lalr'}).createParser();

    const arrRingAxiomStrings: string[] = [
        'x + (y + z) = (x + y) + z',        // Axiom 1
        'x + 0 = x',                        // Axiom 2
        'x + (-x) = 0',                     // Axiom 3
        'x + y = y + x',                    // Axiom 4
        'x * (y * z) = (x * y) * z',        // Axiom 5
        'x * 1 = x',                        // Axiom 6
        '1 * x = x',                        // Axiom 7
        'x * (y + z) = (x * y) + (x * z)',  // Axiom 8
        '(y + z) * x = (y * x) + (z * x)'   // Axiom 9
    ];

    const rows: string = arrRingAxiomStrings.map((sAxiom: string, index: number) => {
        return '<tr>'
        +      '   <td>Axiom ' + (index + 1) + '</td>'
        +      '   <td>' + sAxiom + '</td>'
        +      '</tr>';
    }).join('\n');

    document.getElementById('axioms').innerHTML = '<table>' + rows + '</table>';

    // https://codegolf.stackexchange.com/a/143928/71303
    let arrProofStrings: string[] = [
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

    document.getElementById('proof').innerHTML = arrProofStrings.join('\n');

    const arrRingAxioms = arrRingAxiomStrings.map((sAxiom: string): Vertex => {
        const vertex = parser.parse(sAxiom);
        return vertex;
    });

    const arrRingAxiomsLeft = arrRingAxioms.map((ax) => ax.lhs);
    const arrRingAxiomsRight = arrRingAxioms.map((ax) => ax.rhs);

    document.getElementById('validate').onclick = (event: MouseEvent) => {
        event.preventDefault();

        const textArea: HTMLTextAreaElement = document.getElementById('proof') as HTMLTextAreaElement;

        arrProofStrings = textArea.value.split('\n');

        const arrProof = arrProofStrings.map((sProofStep: string): Vertex => {
            const vertex = parser.parse(sProofStep);
            return vertex;
        });

        let table = '<table>';
        let fullResult = true;

        for (let n = 1; n < arrProof.length; ++n) {

            table += '<tr>';

            if (n === 1) {
                table += '<td>' + arrProofStrings[0] + '</td>';
            } else {
                table += '<td>&nbsp</td>';
            }

            table += '<td> = ' + arrProofStrings[n] + '</td>';

            const exprBefore = arrProof[n - 1];
            const exprAfter = arrProof[n];
            const result = bidirectionalSearchAcrossRulesForMatches(
                                arrRingAxiomsLeft,
                                arrRingAxiomsRight,
                                exprBefore,
                                exprAfter);

            if (result.result) {
                table += '<td class="greenCell">&#10004;</td>';
            } else {
                table += '<td class="redCell">X</td>';
                fullResult = false;
            }

            const arrContext = result.context.split(',');
            while (arrContext.length < 8) {
                arrContext.push('&nbsp');
            }

            table += arrContext.map((s) => '<td>' + s + '</td>').join('');

            table += '</tr>';
        }

        table += '</table>';

        if (fullResult) {
            table = '<p><div class="greenCell">&#10004; proved in ' + (arrProof.length - 1)
                  + ' steps</div></p>' + table;
        } else {
            table = '<p><div class="redCell">X unable to validate proof (' + (arrProof.length - 1)
                  + ' steps)</div></p>' + table;
        }

        document.getElementById('validation').innerHTML = table;
    };

}

