# Snapshot report for `test/basics.mjs`

The actual snapshot is saved in `basics.mjs.snap`.

Generated by [AVA](https://avajs.dev).

## 1+1 = 2

> Snapshot 1

    '<math><mrow><mn>1</mn><mo>+</mo><mn>1</mn></mrow><mo>=</mo><mn>2</mn></math>'

## 3-2 = 1

> Snapshot 1

    '<math><mrow><mn>3</mn><mo>-</mo><mn>2</mn></mrow><mo>=</mo><mn>1</mn></math>'

## Should wrap all expressions in <math>

> Snapshot 1

    '<math></math>'

## Should wrap decimals in <mn>

> Snapshot 1

    '<math><mn>3.141592654</mn></math>'

## Should wrap identifiers in <mi>

> Snapshot 1

    '<math><mi>x</mi></math>'

> Snapshot 2

    '<math><mi>y</mi></math>'

> Snapshot 3

    '<math><mi>a</mi></math>'

> Snapshot 4

    '<math><mrow><mi>n</mi><mi>i</mi></mrow></math>'

## Should wrap numbers in <mn>

> Snapshot 1

    '<math><mn>42</mn></math>'

## Should wrap operatos in <mo>

> Snapshot 1

    '<math><mo>+</mo></math>'

> Snapshot 2

    '<math><mo>-</mo></math>'