/* eslint-env browser */

import mathup from "./index.js";

const MATHML_NS = "http://www.w3.org/1998/Math/MathML";

// Replace with (when available):
// import stylesheet from "./stylesheets/core.css" with { type: "css" };
const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  :is(
      mo.mathup-function-application,
      :not(mfrac, msub, msup, msubsup, munder, mover, munderover)
        > :is(
          .mathup-function-ident,
          :is(msub, msup, msubsup, munder, mover, munderover):has(
              > .mathup-function-ident:first-child
            )
        )
    )
    + :is(
      mi,
      mn,
      :is(mrow, msub, msup, msubsup, munder, mover, munderover):has(
          > :is(mn, mi):first-child
        )
    ),
  :not(mfrac, msub, msup, msubsup, munder, mover, munderover)
    > :is(
      mi,
      mo.mathup-function-application,
      mo.mathup-invisible-times
    )
    + :is(
      .mathup-function-ident,
      :is(msub, msup, msubsup, munder, mover, munderover):has(
          > .mathup-function-ident:first-child
        )
    ),
  :not(mfrac, msub, msup, msubsup, munder, mover, munderover)
    > :is(
      mi,
      mn,
      mo.mathup-invisible-add,
      mo.mathup-invisible-times,
      :is(mrow, msub, msup, msubsup, munder, mover, munderover):has(
          > :is(mi, mn):first-child
        )
    )
    + mfrac,
  :not(mfrac, msub, msup, msubsup, munder, mover, munderover)
    > mfrac
    + :is(
      mi,
      mn,
      mfrac,
      mroot,
      msqrt,
      mo.mathup-invisible-times,
      :is(mrow, msub, msup, msubsup, munder, mover, munderover):has(
          > :is(mi, mn):first-child
        )
    ) {
    padding-inline-start: 0.35ex;
  }

  .mathup-enclose-cancel {
    background: linear-gradient(
      to bottom right,
      transparent calc(50% - 0.1ex),
      currentColor calc(50% - 0.05ex),
      currentColor calc(50% + 0.05ex),
      transparent calc(50% + 0.1ex)
    );
  }
`);

const template = document.createElement("template");
{
  const slot = document.createElement("slot");
  const math = document.createElementNS(MATHML_NS, "math");

  slot.style.display = "none";
  math.setAttribute("part", "math");

  template.content.appendChild(slot);
  template.content.appendChild(math);
}

export default class MathUpElement extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [stylesheet];

    const shadowRoot =
      /** @type {DocumentFragment} */
      (template.content.cloneNode(true));

    const slot = shadowRoot.querySelector("slot");

    slot?.addEventListener("slotchange", () => {
      this.update();
    });

    shadow.appendChild(shadowRoot);
  }

  update() {
    if (this.updateRequest) {
      // Only perform once per animation frame.
      window.cancelAnimationFrame(this.updateRequest);
    }

    const input = this.textContent;
    const options = {
      decimalMark: this.decimalMark,
      colSep: this.colSep,
      rowSep: this.rowSep,

      bare: true,
    };

    const mathNode = this.shadowRoot?.querySelector("math");

    if (input != null && mathNode) {
      this.updateRequest = window.requestAnimationFrame(() => {
        mathup(input, options).updateDOM(mathNode);
      });
    }
  }

  static get observedAttributes() {
    return ["display", "dir", "decimal-mark", "col-sep", "row-sep"];
  }

  /**
   * @param {string} name
   * @param {string} _oldValue
   * @param {string} newValue
   * @returns {void}
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    const mathNode = this.shadowRoot?.querySelector("math");

    if (name === "display" || name === "dir") {
      mathNode?.setAttribute(name, newValue);
    } else if (
      name === "decimal-mark" ||
      name === "col-sep" ||
      name === "row-sep"
    ) {
      this.update();
    }
  }

  get display() {
    return this.getAttribute("display") || "inline";
  }

  set display(value) {
    this.setAttribute("display", value);
  }

  get dir() {
    return this.getAttribute("dir") || "ltr";
  }

  set dir(value) {
    this.setAttribute("dir", value);
  }

  get decimalMark() {
    return this.getAttribute("decimal-mark") || ".";
  }

  set decimalMark(value) {
    this.setAttribute("decimal-mark", value);
  }

  get colSep() {
    return this.getAttribute("col-sep") || ",";
  }

  set colSep(value) {
    this.setAttribute("col-sep", value);
  }

  get rowSep() {
    return this.getAttribute("row-sep") || ";";
  }

  set rowSep(value) {
    this.setAttribute("row-sep", value);
  }
}

customElements.define("math-up", MathUpElement);
