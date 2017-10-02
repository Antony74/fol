
class Vertex {
    text: String;
    type: 'symbol' | 'variable';
    lhs: Vertex;
    rhs: Vertex;
};

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

function ruleMatches(rule: Vertex, expression: Vertex, variables: Map<String,Vertex>): boolean {

    if (rule === null && expression === null) {
        return true;
    } else if (rule === null || expression === null) {
        return false;
    }

    if (rule.type !== expression.type) {
        return false;
    }

    if (rule.type === 'symbol') {
        if (rule.text !== expression.text) {
            return false;
        }

        if (!ruleMatches(rule.lhs, expression.lhs, variables)) {
            return false;
        }

        
    }
}

