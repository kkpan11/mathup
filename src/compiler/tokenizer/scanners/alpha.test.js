import test from "ava";

import alpha from "./alpha.js";

test("rejects non-alpha", (t) => {
  t.is(alpha(" ", " a bc", { start: 0, grouping: false }), null);
});

test("single alpha is ident", (t) => {
  const token = alpha("a", " a bc", { start: 1, grouping: false });

  t.is(token?.type, "ident");
  t.is(token?.value, "a");
  t.is(token?.end, 2);
  t.is(token?.split, true);
});

test("subsequent alphas are separate ident", (t) => {
  const token = alpha("b", "bc ", { start: 0, grouping: false });

  t.is(token?.type, "ident");
  t.is(token?.value, "bc");
  t.is(token?.end, 2);
  t.is(token?.split, true);
});

test("stops scanning on numeric", (t) => {
  const token = alpha("d", "de2", { start: 0, grouping: false });

  t.is(token?.type, "ident");
  t.is(token?.value, "de");
  t.is(token?.end, 2);
  t.is(token?.split, true);
});

test("trailing alphas", (t) => {
  const token = alpha("a", " abc", { start: 1, grouping: false });

  t.is(token?.type, "ident");
  t.is(token?.value, "abc");
  t.is(token?.end, 4);
  t.is(token?.split, true);
});

test("known ident maps", (t) => {
  const token = alpha("p", "pi", { start: 0, grouping: false });

  t.is(token?.type, "ident");
  t.is(token?.value, "π");
  t.is(token?.end, 2);
  t.falsy(token?.split);
});

test("known ident greedy", (t) => {
  const token = alpha("s", "sinh", { start: 0, grouping: false });

  t.is(token?.type, "ident");
  t.is(token?.value, "sinh");
  t.is(token?.end, 4);
  t.falsy(token?.split);
});

test("substrings are not known idents", (t) => {
  const token = alpha("s", "sinfoo", { start: 0, grouping: false });

  t.is(token?.type, "ident");
  t.is(token?.value, "sinfoo");
  t.is(token?.end, 6);
  t.is(token?.split, true);
});

test("known ident with symbol", (t) => {
  const token = alpha("O", "O/", { start: 0, grouping: false });

  t.is(token?.type, "ident");
  t.is(token?.value, "∅");
  t.is(token?.end, 2);
  t.falsy(token?.split);
});

test("known ident with symbol cannot be followed with an alphanum", (t) => {
  const token = alpha("O", "O/1", { start: 0, grouping: false });

  t.is(token?.type, "ident");
  t.is(token?.value, "O");
  t.is(token?.end, 1);
  t.is(token?.split, true);
});

test("known operators", (t) => {
  const token = alpha("n", "not", { start: 0, grouping: false });

  t.is(token?.type, "operator");
  t.is(token?.value, "¬");
  t.is(token?.end, 3);
  t.falsy(token?.split);
});

test("known operator with symbol", (t) => {
  const token = alpha("o", "o+", { start: 0, grouping: false });

  t.is(token?.type, "operator");
  t.is(token?.value, "⊕");
  t.is(token?.end, 2);
  t.falsy(token?.split);
});

test("known operator with symbol cannot be followed by an alphanum", (t) => {
  const token = alpha("o", "o+o", { start: 0, grouping: false });

  t.is(token?.type, "ident");
  t.is(token?.value, "o");
  t.is(token?.end, 1);
  t.is(token?.split, true);
});

test("can’t contain a period", (t) => {
  const token = alpha("a", "a.b", { start: 0, grouping: false });

  t.is(token?.type, "ident");
  t.is(token?.value, "a");
  t.is(token?.end, 1);
  t.is(token?.split, true);
});

test("can’t start with a period", (t) => {
  const token = alpha(".", ".b", { start: 0, grouping: false });

  t.is(token, null);
});

test("can’t end with a period", (t) => {
  const token = alpha("a", "a.", { start: 0, grouping: false });

  t.is(token?.type, "ident");
  t.is(token?.value, "a");
  t.is(token?.end, 1);
  t.is(token?.split, true);
});

test("known prefix", (t) => {
  const token = alpha("h", "hat a", { start: 0, grouping: false });

  t.is(token?.type, "prefix");
  t.is(token?.name, "over");
  t.is(token?.accent, "^");
  t.is(token?.end, 3);
  t.falsy(token?.split);
});

test("known prefix without an operand is ident", (t) => {
  const token = alpha("h", "hat", { start: 0, grouping: false });

  t.is(token?.type, "ident");
  t.is(token?.value, "hat");
  t.is(token?.end, 3);
  t.is(token?.split, true);
});

test("known prefix alone in a group is ident", (t) => {
  const token = alpha("h", "( hat )", { start: 2, grouping: true });

  t.is(token?.type, "ident");
  t.is(token?.value, "hat");
  t.is(token?.end, 5);
  t.is(token?.split, true);
});

test("known prefix alone in a group with known close paren is ident", (t) => {
  const token = alpha("h", "( hat :)", { start: 2, grouping: true });

  t.is(token?.type, "ident");
  t.is(token?.value, "hat");
  t.is(token?.end, 5);
  t.is(token?.split, true);
});

test("sqrt is allowed as standalone prefix", (t) => {
  const token = alpha("s", "sqrt", { start: 0, grouping: false });

  t.is(token?.type, "prefix");
  t.is(token?.name, "sqrt");
  t.is(token?.end, 4);
  t.falsy(token?.split);
});

test("root is allowed as standalone prefix", (t) => {
  const token = alpha("r", "root", { start: 0, grouping: false });

  t.is(token?.type, "prefix");
  t.is(token?.name, "root");
  t.is(token.arity, 2);
  t.is(token?.end, 4);
  t.falsy(token?.split);
});

test("known prefix in a group with an operand", (t) => {
  const token = alpha("h", "( hat : )", { start: 2, grouping: true });

  t.is(token?.type, "prefix");
  t.is(token?.name, "over");
  t.is(token?.accent, "^");
  t.is(token?.end, 5);
  t.falsy(token?.split);
});

test("known command", (t) => {
  const token = alpha("b", "blue a", { start: 0, grouping: false });

  t.is(token?.type, "command");
  t.is(token?.name, "color");
  t.is(token?.value, "blue");
  t.is(token?.end, 4);
  t.falsy(token?.split);
});

test("known command without an operand is an ident", (t) => {
  const token = alpha("b", "blue", { start: 0, grouping: false });

  t.is(token?.type, "ident");
  t.is(token?.value, "blue");
  t.is(token?.end, 4);
  t.is(token?.split, true);
});

test("known command with period", (t) => {
  const token = alpha("b", "bg.blue a", { start: 0, grouping: false });

  t.is(token?.type, "command");
  t.is(token?.name, "background");
  t.is(token?.value, "blue");
  t.is(token?.end, 7);
  t.falsy(token?.split);
});
