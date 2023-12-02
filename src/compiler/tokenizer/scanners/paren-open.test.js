import test from "ava";

import parenOpen from "./paren-open.js";

test("rejects non-open-paren", (t) => {
  t.is(parenOpen(" ", "a(b)", { start: 0 }), null);
});

test("single paren-open", (t) => {
  t.deepEqual(parenOpen("(", "a(b)", { start: 1 }), {
    type: "paren.open",
    value: "(",
    end: 2,
  });
});

test("trailing paren-open", (t) => {
  t.deepEqual(parenOpen("(", "a(", { start: 1 }), {
    type: "paren.open",
    value: "(",
    end: 2,
  });
});

test("combined paren-open", (t) => {
  t.deepEqual(parenOpen("(", "(:", { start: 0 }), {
    type: "paren.open",
    value: "⟨",
    end: 2,
  });

  t.deepEqual(parenOpen("{", "{:", { start: 0 }), {
    type: "paren.open",
    value: "",
    end: 2,
  });
});

test("paren open is also an operator", (t) => {
  t.is(parenOpen("<", "<<<", { start: 0 }), null);
});

test("paren close is also an operator", (t) => {
  t.is(parenOpen(">", ">>>", { start: 0 }), null);
});
