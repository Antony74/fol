
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

    const savedProof = decodeURIComponent(window.location.search.slice(1));

    let arrProofStrings: string[] = savedProof.split('\n');

    document.getElementById('proof').innerHTML = savedProof;

    const arrRingAxioms = arrRingAxiomStrings.map((sAxiom: string): Vertex => {
        const vertex = parser.parse(sAxiom);
        return vertex;
    });

    const arrRingAxiomsLeft = arrRingAxioms.map((ax) => ax.lhs);
    const arrRingAxiomsRight = arrRingAxioms.map((ax) => ax.rhs);

    document.getElementById('validate').onclick = (event: MouseEvent) => {
        event.preventDefault();

        const textArea: HTMLTextAreaElement = document.getElementById('proof') as HTMLTextAreaElement;

        arrProofStrings = textArea.value.split('\n').filter((s) => s.trim().length);

        const arrProof: Vertex[] = [];

        for (let n = 0; n < arrProofStrings.length; ++n) {
            try {
                const vertex = parser.parse(arrProofStrings[n]);
                arrProof.push(vertex);
            } catch (e) {
                const arrMsg = e.message.split('\n');
                if (arrMsg.length) {
                    arrMsg[0] = 'Parse error on line ' + (n + 1);
                }

                const msg = '<p><div class="redCell">' + arrMsg.join('<br>') + '</div></p>';

                document.getElementById('validation').innerHTML = msg;

                return;
            }
        }

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
                table += '<td class="redCell">X</td><td colspan="5">Unable to find matching rule for this step</td>';
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

        const url: string = window.location.origin
                          + window.location.pathname + '?' + encodeURIComponent(textArea.value);

        table += '<p><a href="' + url + '">permalink</a></p>';

        document.getElementById('validation').innerHTML = table;
    };

}

