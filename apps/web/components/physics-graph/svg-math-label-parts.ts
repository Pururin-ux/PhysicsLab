import type { MathLabelSpec } from "../../lib/physics/physics-graph-spec";

export type MathLabelPartKind = "text" | "symbol" | "unit" | "number" | "subscript" | "superscript";

export type MathLabelPart = {
  kind: MathLabelPartKind;
  text: string;
};

const SUBSCRIPT_DIGITS: Record<string, string> = {
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
};

const SUPERSCRIPT_DIGITS: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "⁻": "-",
};

const SYMBOLIC_LABEL_RE = /^([+-]?\d+(?:[.,]\d+)?)?([A-Za-zА-Яа-яτΤμµθΘπρσφωΩΣΔλ])([₀₁₂₃₄₅₆₇₈₉]+)?([⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)?$/u;

function replaceByMap(value: string, map: Record<string, string>) {
  return Array.from(value)
    .map((char) => map[char] ?? char)
    .join("");
}

function appendUnitParts(parts: MathLabelPart[], unit: string) {
  let buffer = "";

  for (const char of Array.from(unit)) {
    if (SUPERSCRIPT_DIGITS[char]) {
      if (buffer) {
        parts.push({ kind: "unit", text: buffer });
        buffer = "";
      }
      parts.push({ kind: "superscript", text: SUPERSCRIPT_DIGITS[char] });
      continue;
    }

    buffer += char;
  }

  if (buffer) {
    parts.push({ kind: "unit", text: buffer });
  }
}

function parseStringLabel(label: string): MathLabelPart[] {
  const trimmed = label.trim();

  if (!trimmed) {
    return [{ kind: "text", text: label }];
  }

  const commaIndex = trimmed.indexOf(",");
  if (commaIndex > 0) {
    const symbol = trimmed.slice(0, commaIndex).trim();
    const unit = trimmed.slice(commaIndex + 1).trim();
    const parts = parseStringLabel(symbol);

    if (unit) {
      parts.push({ kind: "text", text: ", " });
      appendUnitParts(parts, unit);
    }

    return parts;
  }

  if (/^[+-]?\d+(?:[.,]\d+)?$/u.test(trimmed)) {
    return [{ kind: "number", text: trimmed }];
  }

  const symbolicMatch = trimmed.match(SYMBOLIC_LABEL_RE);
  if (symbolicMatch) {
    const [, prefix, symbol, subscript, superscript] = symbolicMatch;
    const parts: MathLabelPart[] = [];

    if (prefix) {
      parts.push({ kind: "number", text: prefix });
    }

    parts.push({ kind: "symbol", text: symbol });

    if (subscript) {
      parts.push({ kind: "subscript", text: replaceByMap(subscript, SUBSCRIPT_DIGITS) });
    }

    if (superscript) {
      parts.push({ kind: "superscript", text: replaceByMap(superscript, SUPERSCRIPT_DIGITS) });
    }

    return parts;
  }

  const unitParts: MathLabelPart[] = [];
  appendUnitParts(unitParts, trimmed);

  return unitParts.length > 0 ? unitParts : [{ kind: "text", text: trimmed }];
}

export function getMathLabelParts(label: MathLabelSpec, unit?: string): MathLabelPart[] {
  if (typeof label === "string") {
    const parts = parseStringLabel(label);

    if (unit) {
      parts.push({ kind: "text", text: ", " });
      appendUnitParts(parts, unit);
    }

    return parts;
  }

  if (label.text) {
    return parseStringLabel(label.text);
  }

  const parts: MathLabelPart[] = [];

  if (label.prefix) {
    parts.push({ kind: "number", text: label.prefix });
  }

  if (label.symbol) {
    parts.push({ kind: "symbol", text: label.symbol });
  }

  if (label.subscript) {
    parts.push({ kind: "subscript", text: label.subscript });
  }

  if (label.superscript) {
    parts.push({ kind: "superscript", text: label.superscript });
  }

  const labelUnit = label.unit ?? unit;
  if (labelUnit) {
    if (parts.length > 0) {
      parts.push({ kind: "text", text: ", " });
    }
    appendUnitParts(parts, labelUnit);
  }

  return parts.length > 0 ? parts : [{ kind: "text", text: "" }];
}

export function getAccessibleMathLabel(label: MathLabelSpec, unit?: string) {
  return getMathLabelParts(label, unit)
    .map((part) => part.text)
    .join("");
}
