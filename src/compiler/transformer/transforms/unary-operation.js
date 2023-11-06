import {
  literalValue,
  textLiteralAttrs,
  textLiteralValue,
} from "./text-transforms.js";

/**
 * @typedef {import("../../parser/index.js").Node} ASTNode
 * @typedef {import("../../parser/index.js").UnaryOperation} UnaryOperation
 * @typedef {import("../../parser/index.js").Literal} Literal
 * @typedef {import("../../parser/index.js").SpaceLiteral} SpaceLiteral
 */

/**
 * @template {ASTNode} Node
 * @overload
 * @param {Node} childNode
 * @param {UnaryOperation} node
 * @returns {Node}
 */

/**
 * @template {ASTNode} Node
 * @overload
 * @param {Node[]} childNode
 * @param {UnaryOperation} node
 * @returns {Node[]}
 */

/**
 * @template {ASTNode} Node
 * @overload
 * @param {Node[][]} childNode
 * @param {UnaryOperation} node
 * @returns {Node[][]}
 */

/**
 * @template {ASTNode} Node
 * @param {Node | Node[] | Node[][]} childNode
 * @param {UnaryOperation} node
 * @returns {Node | Node[] | Node[][]}
 */
function handleCommand(childNode, node) {
  if (Array.isArray(childNode)) {
    return childNode.map((grandChild) =>
      handleCommand(/** @type {Node} */ (grandChild), node),
    );
  }

  if (childNode.type === "TextLiteral") {
    const { attrs = {}, transforms = [] } = node;

    return {
      ...childNode,
      attrs: textLiteralAttrs(attrs, transforms),
      value: textLiteralValue(childNode.value, transforms),
    };
  }

  if (
    childNode.type === "IdentLiteral" &&
    childNode.value.length === 1 &&
    node.transforms &&
    node.transforms.length === 1 &&
    node.transforms[0] === "normal"
  ) {
    // Disable auto-italic idents
    return {
      ...childNode,
      attrs: {
        ...(childNode.attrs ?? {}),
        mathvariant: "normal",
      },
    };
  }

  if (
    childNode.type === "IdentLiteral" ||
    childNode.type === "NumberLiteral" ||
    childNode.type === "OperatorLiteral"
  ) {
    const { transforms = [] } = node;

    return {
      ...childNode,
      value: literalValue(childNode.value, transforms),
    };
  }

  if ("items" in childNode) {
    return {
      ...childNode,
      items: childNode.items.map((grandChild) =>
        handleCommand(/** @type {Node} */ (grandChild), node),
      ),
    };
  }

  return childNode;
}

/** @type {import("../index.js").TransformFn<UnaryOperation>} */
export default function unaryOperation(node, transform) {
  if (node.name === "command") {
    return transform(handleCommand(node.items[0], node));
  }

  if (node.name === "fence") {
    const { open, close } = node.attrs || {};

    /** @type {(import("../index.js").Tag | null)[]} */
    const childNodes = [
      { tag: "mo", attrs: { fence: true }, textContent: `${open}` },
      node.items.length === 1
        ? transform(node.items[0])
        : { tag: "mrow", childNodes: node.items.map(transform) },
      { tag: "mo", attrs: { fence: true }, textContent: `${close}` },
    ];

    return {
      tag: "mrow",
      childNodes,
    };
  }

  const tag = `m${node.name}`;
  let [operant] = node.items;

  if (operant.type === "Term" && operant.items.length === 1) {
    // There is no need of a singleton term.
    [operant] = operant.items;
  }

  if (node.accent) {
    const attrs = node.attrs ? { ...node.attrs } : {};
    if (node.name === "over") {
      attrs.accent = true;

      // Remove the dot from i and j to make way for the accent.
      if (operant.type === "IdentLiteral") {
        if (operant.value === "i") {
          operant.value = "ı";
        } else if (operant.value === "j") {
          operant.value = "ȷ";
        }
      }
    } else if (node.name === "under") {
      attrs.accentunder = true;
    }

    const childNodes = [
      transform(operant),
      {
        tag: "mo",
        textContent: node.accent,
      },
    ];

    return {
      tag,
      childNodes,
      attrs,
    };
  }

  return {
    tag,
    childNodes: [transform(operant)],
    attrs: node.attrs,
  };
}
