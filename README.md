[CLICK HERE TO RUN THIS PROJECT IN YOUR BROWSER](https://antony74.github.io/fol/index.html?(-a)*(-a)%0A((-a)*(-a))%2B0%0A((-a)*(-a))%2B(((a*a)%2B(a*(-a)))%2B(-((a*a)%2B(a*(-a)))))%0A(((-a)*(-a))%2B((a*a)%2B(a*(-a))))%2B(-((a*a)%2B(a*(-a))))%0A(((a*a)%2B(a*(-a)))%2B((-a)*(-a)))%2B(-((a*a)%2B(a*(-a))))%0A((a*a)%2B((a*(-a))%2B((-a)*(-a))))%2B(-((a*a)%2B(a*(-a))))%0A((a*a)%2B((a%2B(-a))*(-a)))%2B(-((a*a)%2B(a*(-a))))%0A((a*a)%2B(0*(-a)))%2B(-((a*a)%2B(a*(-a))))%0A((a*(a%2B0))%2B(0*(-a)))%2B(-((a*a)%2B(a*(-a))))%0A((a*(a%2B(a%2B(-a))))%2B(0*(-a)))%2B(-((a*a)%2B(a*(-a))))%0A(((a*a)%2B(a*(a%2B(-a))))%2B(0*(-a)))%2B(-((a*a)%2B(a*(-a))))%0A((a*a)%2B((a*(a%2B(-a)))%2B(0*(-a))))%2B(-((a*a)%2B(a*(-a))))%0A(a*a)%2B(((a*(a%2B(-a)))%2B(0*(-a)))%2B(-((a*a)%2B(a*(-a)))))%0A(a*a)%2B((((a*a)%2B(a*(-a)))%2B(0*(-a)))%2B(-((a*a)%2B(a*(-a)))))%0A(a*a)%2B(((a*a)%2B((a*(-a))%2B(0*(-a))))%2B(-((a*a)%2B(a*(-a)))))%0A(a*a)%2B(((a*a)%2B((a%2B0)*(-a)))%2B(-((a*a)%2B(a*(-a)))))%0A(a*a)%2B(((a*a)%2B(a*(-a)))%2B(-((a*a)%2B(a*(-a)))))%0A(a*a)%2B0%0Aa*a)

This project is a proof checker for the following puzzle:

<https://codegolf.stackexchange.com/questions/143822/a-%C3%97-a-a-%C3%97-a>

It's all first order logic, hence the name 'fol'.  I'm not sure how much additional work would be needed to make it a general purpose first order logic checker.

First the axioms and proof-steps are parsed with a [Jison](https://zaa.ch/jison/) parser.  So for example

    x * (y + z)
    
becomes the following syntax-tree

    {
        "text": "*",
        "type": "symbol",
        "lhs": {
            "text": "x",
            "type": "var",
            "lhs": null,
            "rhs": null
        },
        "rhs": {
            "text": "+",
            "type": "symbol",
            "lhs": {
                "text": "y",
                "type": "var",
                "lhs": null,
                "rhs": null
            },
            "rhs": {
                "text": "z",
                "type": "var",
                "lhs": null,
                "rhs": null
            }
        }
    }

After that, the syntax-trees for each proof-step are searched to see if any of the axioms can be fitted against it.

*There is a proof embedded in the "RUN THIS PROJECT" link at the top of the page.  The proof was written by [etoplay](https://codegolf.stackexchange.com/users/45161/etoplay) and was taken from [StackExchange](https://codegolf.stackexchange.com/a/143928) under [cc by-sa 3.0](https://creativecommons.org/licenses/by-sa/3.0/) with [attribution required.](https://stackoverflow.blog/2009/06/25/attribution-required/)*
