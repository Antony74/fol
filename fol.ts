
export class Vertex {
    public text: string;
    public type: 'symbol' | 'var' | 'const';
    public lhs: Vertex;
    public rhs: Vertex;
}

export class RuleMatchResult {
    public result: boolean;
    public variables: object;
    public context: string;
}

const resultFalse = {
    result: false,
    variables: [],
    context: ''
};

function shallowEquals(v1: Vertex, v2: Vertex): boolean {

    if (v1 === null && v2 === null) {
        return true;
    } else if (v1 === null || v2 === null) {
        return false;
    } else if (v1.text !== v2.text || v1.type !== v2.type) {
        return false;
    } else {
        return true;
    }

}

function deepEquals(v1: Vertex, v2: Vertex): boolean {

    if (v1 === null && v2 === null) {
        return true;
    } else if (!shallowEquals(v1, v2)) {
        return false;
    } else if (v1.lhs && !deepEquals(v1.lhs, v2.lhs)) {
        return false;
    } else if (v1.rhs && !deepEquals(v1.rhs, v2.rhs)) {
        return false;
    } else {
        return true;
    }
}

export function ruleMatches(
                        ruleBefore: Vertex,
                        ruleAfter: Vertex,
                        exprBefore: Vertex,
                        exprAfter: Vertex,
                        variables: object): RuleMatchResult {

    const result1 = rulePartMatches(ruleBefore, exprBefore, []);

    if (result1.result) {
        const result2 = rulePartMatches(ruleAfter, exprAfter, result1.variables);
        return result2;
    } else {
        return result1;
    }
}

function rulePartMatches(rulePart: Vertex, expression: Vertex, variables: object): RuleMatchResult {

    const result: RuleMatchResult = {
        result: false,
        variables: Object.assign({}, variables),
        context: ''
    };

    if (rulePart === null && expression === null) {
        result.result = true;
        return result;
    } else if (rulePart === null || expression === null) {
        result.result = false;
        return result;
    }

    if (rulePart.type === 'var') {
        const varName = rulePart.text;
        if (variables[varName]) {
            result.result = deepEquals(expression, variables[varName]);
        } else {
            result.result = true;
            result.variables[varName] = expression;
        }

        return result;
    }

    if (rulePart.type === expression.type && rulePart.text === expression.text) {
        const lhResult: RuleMatchResult = rulePartMatches(rulePart.lhs, expression.lhs, result.variables);

        if (lhResult.result) {
            const rhResult: RuleMatchResult = rulePartMatches(rulePart.rhs, expression.rhs, lhResult.variables);
            return rhResult;
        }

        result.result = false;
        return result;
    }

    result.result = false;
    return result;
}

export function searchForRuleMatches(
    ruleBefore: Vertex,
    ruleAfter: Vertex,
    exprBefore: Vertex,
    exprAfter: Vertex,
    variables: object): RuleMatchResult {

    const result = ruleMatches(ruleBefore, ruleAfter, exprBefore, exprAfter, variables);

    if (result.result) {
        return result;
    }

    if (exprBefore.lhs && exprAfter.lhs) {
        const lhResult = searchForRuleMatches(ruleBefore, ruleAfter, exprBefore.lhs, exprAfter.lhs, variables);

        if (lhResult.result) {

            if (shallowEquals(exprBefore, exprAfter) && deepEquals(exprBefore.rhs, exprAfter.rhs)) {
                lhResult.context = 'l' + lhResult.context;
                return lhResult;
            }
        }
    }

    if (exprBefore.rhs && exprAfter.rhs) {
        const rhResult = searchForRuleMatches(ruleBefore, ruleAfter, exprBefore.rhs, exprAfter.rhs, variables);

        if (rhResult.result) {

            if (shallowEquals(exprBefore, exprAfter) && deepEquals(exprBefore.lhs, exprAfter.lhs)) {
                rhResult.context = 'r' + rhResult.context;
                return rhResult;
            }
        }
    }

    return resultFalse;
}

export function vertexAsString(vertex: Vertex, brackets: boolean): string {

    if (vertex.lhs === null && vertex.rhs === null) {
        brackets = false;
    }

    const arr: string[] = [];

    if (brackets) {
        arr.push('(');
    }

    if (vertex.lhs) {
        arr.push(vertexAsString(vertex.lhs, true));
    }

    arr.push(vertex.text);

    if (vertex.rhs) {
        arr.push(vertexAsString(vertex.rhs, true));
    }

    if (brackets) {
        arr.push(')');
    }

    return arr.join(' ');
}

export function variablesAsString(variables: object): string {
    return Object.keys(variables).map((key) => {
        return key + ' = ' + vertexAsString(variables[key], false);
    }).join(', ');
}

export function searchAcrossRulesForMatches(
    rulesBefore: Vertex[],
    rulesAfter: Vertex[],
    exprBefore: Vertex,
    exprAfter: Vertex): RuleMatchResult {

    if (rulesBefore.length !== rulesAfter.length) {
        console.log('Rule lengths are different');
        return resultFalse;
    }

    for (let n = 0; n < rulesBefore.length; ++n) {

        const result = searchForRuleMatches(rulesBefore[n], rulesAfter[n], exprBefore, exprAfter, []);

        if (result.result) {

            if (result.context.length === 0) {
                result.context = 'root';
            }

            result.context = 'axiom ' + (n + 1) + ', ' + result.context + ', ' + variablesAsString(result.variables);
            return result;
        }
    }

    return resultFalse;
}

export function bidirectionalSearchAcrossRulesForMatches(
    rulesLhs: Vertex[],
    rulesRhs: Vertex[],
    exprBefore: Vertex,
    exprAfter: Vertex): RuleMatchResult {

    if (rulesLhs.length !== rulesRhs.length) {
        console.log('Rule lengths are different');
        return resultFalse;
    }

    const result1 = searchAcrossRulesForMatches(rulesLhs, rulesRhs, exprBefore, exprAfter);

    if (result1.result) {
        result1.context = 'Left to right ' + result1.context;
        return result1;
    }

    const result2 = searchAcrossRulesForMatches(rulesRhs, rulesLhs, exprBefore, exprAfter);

    if (result2.result) {
        result2.context = 'Right to left ' + result2.context;
        return result2;
    }

    return resultFalse;
}

