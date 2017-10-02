/* description: Parses mathematical expressions on rings. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
"("                   return '('
")"                   return ')'
"PI"                  return 'PI'
"E"                   return 'E'
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
    ;

e
    : e '+' e
		{$$ = {symbol:'PLUS', value: $1.value + $3.value, children:[$1, {symbol:'+'}, $3]};}
    | e '-' e
		{$$ = {symbol:'SUB',  value: $1.value - $3.value, children:[$1, {symbol:'-'}, $3]};}
    | e '*' e
		{$$ = {symbol:'MULT', value: $1.value * $3.value, children:[$1, {symbol:'*'}, $3]};}
    | e '/' e
		{$$ = {symbol:'DIV',  value: $1.value / $3.value, children:[$1, {symbol:'/'}, $3]};}
    | e '^' e
		{$$ = {symbol:'POW', value: Math.pow($1.value, $3.value), children:[$1, {symbol:'^'}, $3]};}
    | '-' e %prec UMINUS
		{$$ = {symbol:'NEG', value: -$2.value, children:[{symbol:'-'}, $2]};}
    | '(' e ')'
        {$$ = {symbol:'BRACKET', value: $2.value, children:[{symbol:'('}, $2, {symbol:')'}]};}
    | NUMBER
        {$$ = {symbol:'NUMBER', value:Number(yytext)};}
    | E
        {$$ = {symbol:'E', value:Math.E};}
    | PI
        {$$ = {symbol:'PI', value:Math.PI};}
    ;
