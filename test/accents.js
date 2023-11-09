import test from "ava";

import mathup from "../src/index.js";

/**
 * @param {string} str
 * @returns {string}
 */
function render(str) {
  return mathup(str).toString();
}

test("All accents", (t) => {
  t.snapshot(render("hat x"));
  t.snapshot(render("bar x"));
  t.snapshot(render("ul x"));
  t.snapshot(render("vec x"));
  t.snapshot(render("dot x"));
  t.snapshot(render("ddot x"));
  t.snapshot(render("tilde x"));
});

test("Dotless variants", (t) => {
  t.snapshot(render("hat h"));
  t.snapshot(render("hat i"));
  t.snapshot(render("hat j"));
  t.snapshot(render("hat k"));
  t.snapshot(render("ul i"));
  t.snapshot(render("ul j"));
});

test("Should put accents over all the following parenthesis", (t) => {
  t.snapshot(render("3hat(xyz)"));
});

test("Physics vector notation", (t) => {
  t.snapshot(render("vec x = a hat i + b hat j + c hat k"));
});
