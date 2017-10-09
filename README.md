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

