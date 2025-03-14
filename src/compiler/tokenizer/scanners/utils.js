import {
  KNOWN_PARENS_CLOSE,
  isAlphanumeric,
  isPunctClose,
} from "../lexemes.js";

/**
 * @param {string} char
 * @param {number} pos
 * @param {string} input
 * @param {{ offset?: number }} options
 * @returns {{ value: string; end: number }}
 */
function handleFence(char, pos, input, { offset = 0 } = {}) {
  let len = 0;

  while (input[pos + offset + len] === char) {
    len += 1;
  }

  let value = "";
  let closeLen = 0;
  let i = pos + offset + len;

  while (closeLen < len) {
    if (i >= input.length) {
      break;
    }

    if (input[i] === char) {
      closeLen += 1;
    } else {
      if (closeLen > 0) {
        value += char.repeat(closeLen);
        closeLen = 0;
      }

      value += input[i];
    }

    i += 1;
  }

  return {
    value: value.trim(),
    end: i,
  };
}

/**
 * @param {number} pos
 * @param {string} input
 * @param {{ offset?: number }} [options]
 * @returns {ReturnType<typeof handleFence>}
 */
export function handleBacktick(pos, input, options) {
  return handleFence("`", pos, input, options);
}

/**
 * @param {number} pos
 * @param {string} input
 * @param {{ offset?: number }} [options]
 * @returns {ReturnType<typeof handleFence>}
 */
export function handleQuote(pos, input, options) {
  return handleFence('"', pos, input, options);
}

/**
 * @param {string} prefix
 * @param {number} pos
 * @param {string} input
 * @returns {{ value: string; end: number }}
 */
export function handlePrefixed(prefix, pos, input) {
  const start = pos + prefix.length;
  let value = "";
  let [char] = input.slice(start);

  if (!char) {
    return { value: prefix, end: start };
  }

  if (isAlphanumeric(char)) {
    while (isAlphanumeric(char)) {
      value += char;
      [char] = input.slice(start + value.length);
    }

    return { value, end: start + value.length };
  }

  if (char === "`") {
    return handleBacktick(pos, input, { offset: prefix.length });
  }

  return { value: char, end: start + char.length };
}

/**
 * @param {string} input
 * @param {number} start
 * @returns {boolean}
 */
function isKnownParenCloseAt(input, start) {
  for (const key of KNOWN_PARENS_CLOSE.keys()) {
    if (input.startsWith(key, start)) {
      return true;
    }
  }

  return false;
}

/**
 * @param {string} input
 * @param {number} start
 * @param {boolean} isGrouping
 * @returns {boolean}
 */
export function hasOperand(input, start, isGrouping) {
  let pos = start;
  let postPrefixChar = input.at(pos);
  while (postPrefixChar === " " || postPrefixChar === "\n") {
    pos += 1;
    postPrefixChar = input.at(pos);
  }

  if (!postPrefixChar) {
    return false;
  }

  return !(
    isGrouping &&
    (isPunctClose(postPrefixChar) || isKnownParenCloseAt(input, pos))
  );
}

/**
 * @param {Pick<import("./index.js").Token, "name">} prefix
 * @returns {boolean}
 */
export function allowedStandalonePrefix(prefix) {
  return prefix.name === "root" || prefix.name === "sqrt";
}
