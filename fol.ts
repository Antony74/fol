
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

export function equals(v1: Vertex, v2: Vertex): boolean {

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

export function rulePartMatches(rulePart: Vertex, expression: Vertex, variables: object): RuleMatchResult {

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

    // TODO - There's more ways things can match.
    // Err on the side of returning false and it should be obvious when this code needs filling in.

    return result;
}

