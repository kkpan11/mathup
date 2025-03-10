import test from "ava";

import term from "./term.js";

const SPACE = { type: "space", value: " " };

test("empty term", (t) => {
  const tokens = [];
  const { end, node } = term({ start: 0, tokens });

  t.is(end, 0);
  t.deepEqual(node, {
    type: "Term",
    items: [],
  });
});

test("singleton term", (t) => {
  const tokens = [{ type: "ident", value: "a" }];
  const { end, node } = term({ start: 0, tokens });

  t.is(end, 1);
  t.deepEqual(node, {
    type: "Term",
    items: [{ type: "IdentLiteral", value: "a" }],
  });
});

test("parses until it finds a space", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "operator", value: "+" },
    { type: "ident", value: "b" },
    SPACE,
    { type: "operator", value: "-" },
    SPACE,
    { type: "number", value: "2" },
    { type: "ident", value: "c" },
  ];

  const { end, node } = term({ start: 0, tokens });

  t.is(end, 3);
  t.deepEqual(node.items, [
    { type: "IdentLiteral", value: "a" },
    { type: "OperatorLiteral", value: "+" },
    { type: "IdentLiteral", value: "b" },
  ]);
});

test("parses a likely differential as an operator", (t) => {
  const tokens = [
    { type: "ident", value: "d" },
    { type: "ident", value: "x" },
  ];

  const { end, node } = term({ start: 0, tokens });

  t.is(end, 2);
  t.deepEqual(node, {
    type: "Term",
    items: [
      { type: "OperatorLiteral", value: "𝑑", attrs: { rspace: "0" } },
      { type: "IdentLiteral", value: "x" },
    ],
  });
});

test("d is not likely a differential operator the operant isn’t an ident", (t) => {
  const tokens = [
    { type: "ident", value: "d" },
    { type: "operator", value: "x" },
  ];

  const { end, node } = term({ start: 0, tokens });

  t.is(end, 2);
  t.deepEqual(node, {
    type: "Term",
    items: [
      { type: "IdentLiteral", value: "d" },
      { type: "OperatorLiteral", value: "x" },
    ],
  });
});

test("parses a likely differential as an operator on a nested ident", (t) => {
  const tokens = [
    { type: "ident", value: "d" },
    { type: "ident", value: "x" },
    { type: "infix", name: "sup" },
    { type: "number", value: "2" },
  ];

  const { end, node } = term({ start: 0, tokens });

  t.is(end, tokens.length);
  t.is(node.type, "Term");
  t.is(node.items.length, 2);
  t.deepEqual(node.items[0], {
    type: "OperatorLiteral",
    value: "𝑑",
    attrs: { rspace: "0" },
  });
  t.is(node.items[1].type, "BinaryOperation");
});

test("parses a likely closing pipe after a prefix", (t) => {
  const tokens = [
    { type: "operator", value: "|" },
    { type: "prefix", name: "sqrt" },
    SPACE,
    { type: "ident", value: "x" },
    { type: "operator", value: "|" },
  ];
  const { end, node } = term({ start: 0, tokens });

  t.is(end, tokens.length);
  t.is(node.type, "Term");
  t.is(node.items.length, 3);
  t.deepEqual(node.items[0], {
    type: "OperatorLiteral",
    value: "|",
  });
  t.is(node.items[1]?.type, "UnaryOperation");
  t.is(node.items[1]?.name, "sqrt");
  t.is(node.items[1]?.items[0].items.length, 1);
  t.is(node.items[1]?.items[0].items[0].type, "IdentLiteral");
  t.is(node.items[1]?.items[0].items[0].value, "x");
  t.deepEqual(node.items[2], {
    type: "OperatorLiteral",
    value: "|",
  });
});

test("parses a likely closing pipe after a series of prefixes", (t) => {
  const tokens = [
    { type: "operator", value: "|" },
    { type: "prefix", name: "sqrt" },
    SPACE,
    { type: "prefix", name: "sqrt" },
    SPACE,
    { type: "prefix", name: "sqrt" },
    SPACE,
    { type: "ident", value: "x" },
    { type: "operator", value: "|" },
  ];
  const { end, node } = term({ start: 0, tokens });

  t.is(end, tokens.length);
  t.is(node.type, "Term");
  t.is(node.items.length, 3);
  t.deepEqual(node.items[0], {
    type: "OperatorLiteral",
    value: "|",
  });
  t.is(node.items[1]?.type, "UnaryOperation");
  t.is(node.items[1]?.name, "sqrt");
  t.deepEqual(node.items[2], {
    type: "OperatorLiteral",
    value: "|",
  });
});

test("don’t guess closing pipes when there are many to choice from’", (t) => {
  const tokens = [
    { type: "operator", value: "|" },
    { type: "prefix", name: "sqrt" },
    SPACE,
    { type: "ident", value: "a" },
    { type: "operator", value: "|" },
    { type: "ident", value: "b" },
    { type: "operator", value: "|" },
  ];
  const { end, node } = term({ start: 0, tokens });

  t.is(end, tokens.length);
  t.is(node.type, "Term");
  t.is(node.items.length, 2);
  t.deepEqual(node.items[0], {
    type: "OperatorLiteral",
    value: "|",
  });
  t.is(node.items[1]?.type, "UnaryOperation");
  t.is(node.items[1]?.name, "sqrt");
});

test("pipe as the operant is not likely closing", (t) => {
  const tokens = [
    { type: "operator", value: "|" },
    { type: "prefix", name: "sqrt" },
    SPACE,
    { type: "operator", value: "|" },
  ];
  const { end, node } = term({ start: 0, tokens });

  t.is(end, tokens.length);
  t.is(node.type, "Term");
  t.is(node.items.length, 2);
  t.deepEqual(node.items[0], {
    type: "OperatorLiteral",
    value: "|",
  });
  t.is(node.items[1]?.type, "UnaryOperation");
  t.is(node.items[1]?.name, "sqrt");
});
