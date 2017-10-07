/* description: Parses mathematical expressions on rings. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[a-z]+                return 'VAR'
"="                   return '='
"*"                   return '*'
"-"                   return '-'
"+"                   return '+'
"("                   return '('
")"                   return ')'
"1"                   return 'ONE'
"0"                   return 'ZERO'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        {return $1;}
    | e '=' e EOF
        {return {text:'=', type:'symbol',  lhs: $1, rhs: $3};}
    ;

e
    : e '+' e
		{$$ = {text:'+', type:'symbol', lhs: $1, rhs: $3};}
    | e '*' e
		{$$ = {text:'*', type:'symbol', lhs: $1, rhs: $3};}
    | '-' e %prec UMINUS
		{$$ = {text:'-', type:'symbol', lhs: null, rhs: $2};}
    | '(' e ')'
        {$$ = $2;}
    | VAR
        {$$ = {text: $1, type: 'var', lhs: null, rhs: null};}
    | ZERO
        {$$ = {text: '0', type: 'const', lhs: null, rhs: null};}
    | ONE
        {$$ = {text: '1', type: 'const', lhs: null, rhs: null};}
    ;
