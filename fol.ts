
export class Vertex {
    public text: string;
    public type: 'symbol' | 'var' | 'const';
    public lhs: Vertex;
    public rhs: Vertex;
}

export class RuleMatchResult {
    public result: boolean;
    public variables: object;
}

function equals(v1: Vertex, v2: Vertex): boolean {

    if (v1 === null && v2 === null) {
        return true;
    } else if (v1 === null || v2 === null) {
        return false;
    } else if (v1.text !== v2.text || v1.type !== v2.type) {
        return false;
    } else if (!equals(v1.lhs, v2.lhs)) {
        return false;
    } else if (!equals(v1.rhs, v2.rhs)) {
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
        variables: Object.assign({}, variables)
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
            result.result = equals(expression, variables[varName]);
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

