# Snapshot report for `test/options.js`

The actual snapshot is saved in `options.js.snap`.

Generated by [AVA](https://avajs.dev).

## Display block, when passed in

> Snapshot 1

    '<math display="block"></math>'

## right-to-left direction when passed in

> Snapshot 1

    '<math dir="rtl"></math>'

## Should be able to be both at the same time

> Snapshot 1

    '<math dir="rtl" display="block"></math>'

## Comma as a decimal mark

> Snapshot 1

    '<math><mn>40,2</mn></math>'

> Snapshot 2

    '<math><mfrac><mn>40,2</mn><mn>13,3</mn></mfrac></math>'

> Snapshot 3

    '<math><msup><mn>2</mn><mn>0,5</mn></msup></math>'

## Column separators default to ";" when decimal marks are ","

> Snapshot 1

    '<math><mrow><mo fence="true">(</mo><mrow><mn>1</mn><mo separator="true">;</mo><mn>2</mn><mo separator="true">;</mo><mn>3,14</mn></mrow><mo fence="true">)</mo></mrow></math>'

## Row separators default to ";;" when column separators are ";"

> Snapshot 1

    '<math><mrow><mo fence="true">[</mo><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3.14</mn></mtd></mtr></mtable><mo fence="true">]</mo></mrow></math>'

> Snapshot 2

    '<math><mrow><mo fence="true">[</mo><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3,14</mn></mtd></mtr></mtable><mo fence="true">]</mo></mrow></math>'

## Arbitrary column separators

> Snapshot 1

    '<math><mrow><mo fence="true">(</mo><mrow><mrow><mn>1</mn></mrow><mo separator="true">|</mo><mrow><mn>2</mn></mrow><mo separator="true">|</mo><mn>3.14</mn></mrow><mo fence="true">)</mo></mrow></math>'

> Snapshot 2

    '<math><mrow><mo fence="true">(</mo><mrow><mrow><mn>1</mn></mrow><mo separator="true">;</mo><mrow><mn>2</mn></mrow><mo separator="true">;</mo><mn>3,14</mn></mrow><mo fence="true">)</mo></mrow></math>'

## Arbitrary row separators

> Snapshot 1

    '<math><mrow><mo fence="true">(</mo><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3.14</mn></mtd></mtr></mtable><mo fence="true">)</mo></mrow></math>'

> Snapshot 2

    '<math><mrow><mo fence="true">(</mo><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3,14</mn></mtd></mtr></mtable><mo fence="true">)</mo></mrow></math>'