import React, { Fragment, useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const FORMULA_MAP = new Map([
  ['x = x₀ + v·t', 'x = x_0 + vt'],
  ['S = |v|·t', 'S = |v|t'],
  ['v = v₀ + a·t', 'v = v_0 + at'],
  ['x = x₀ + v₀·t + a·t²/2', 'x = x_0 + v_0t + \\frac{at^2}{2}'],
  ['x = x₀ + v₀t + at²/2', 'x = x_0 + v_0t + \\frac{at^2}{2}'],
  ['v² = v₀² + 2·a·Δx', 'v^2 = v_0^2 + 2a\\Delta x'],
  ['h = g·t²/2', 'h = \\frac{gt^2}{2}'],
  ['F = m·a', 'F = ma'],
  ['F = m·g', 'F = mg'],
  ['F = k·Δl', 'F = k\\Delta l'],
  ['Fтр = μ·N', 'F_{\\text{тр}} = \\mu N'],
  ['A = F·S·cosα', 'A = FS\\cos\\alpha'],
  ['Eк = mv²/2', 'E_k = \\frac{mv^2}{2}'],
  ['Eп = mgh', 'E_p = mgh'],
  ['p = m·v', 'p = mv'],
  ['P = A/t = F·v', 'P = \\frac{A}{t} = Fv'],
  ['pV = νRT', 'pV = \\nu RT'],
  ['p₁V₁ = p₂V₂', 'p_1V_1 = p_2V_2'],
  ['V₁/T₁ = V₂/T₂', '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}'],
  ['p₁/T₁ = p₂/T₂', '\\frac{p_1}{T_1} = \\frac{p_2}{T_2}'],
  ['Q = ΔU + A', 'Q = \\Delta U + A'],
  ['Q = c·m·ΔT', 'Q = cm\\Delta T'],
  ['η = A/Q₁ = 1 - Q₂/Q₁', '\\eta = \\frac{A}{Q_1} = 1 - \\frac{Q_2}{Q_1}'],
  ['F = k·|q₁|·|q₂|/r²', 'F = k\\frac{|q_1||q_2|}{r^2}'],
  ['E = kQ/r²', 'E = k\\frac{Q}{r^2}'],
  ['C = ε₀εS/d', 'C = \\varepsilon_0\\varepsilon\\frac{S}{d}'],
  ['I = U/R', 'I = \\frac{U}{R}'],
  ['I = ε/(R + r)', 'I = \\frac{\\varepsilon}{R+r}'],
  ['P = U·I = I²R', 'P = UI = I^2R'],
]);

const INLINE_FORMULAS = Array.from(FORMULA_MAP.keys()).sort((a, b) => b.length - a.length);

const SUPERSCRIPT = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁻': '-',
};

const SUBSCRIPT = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function collectScript(source, startIndex, dictionary) {
  let value = '';
  let index = startIndex;
  while (index < source.length && dictionary[source[index]]) {
    value += dictionary[source[index]];
    index += 1;
  }
  return { value, index };
}

export function toLatex(value = '') {
  const raw = String(value).trim();
  if (FORMULA_MAP.has(raw)) return FORMULA_MAP.get(raw);
  if (raw.includes('\\')) return raw.replace(/\\\\/g, '\\');

  let result = '';
  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i];
    if (SUPERSCRIPT[char]) {
      const { value, index } = collectScript(raw, i, SUPERSCRIPT);
      result += `^{${value}}`;
      i = index - 1;
      continue;
    }
    if (SUBSCRIPT[char]) {
      const { value, index } = collectScript(raw, i, SUBSCRIPT);
      result += `_{${value}}`;
      i = index - 1;
      continue;
    }
    const replacements = {
      '·': '\\cdot ',
      'Δ': '\\Delta ',
      'α': '\\alpha ',
      'β': '\\beta ',
      'γ': '\\gamma ',
      'η': '\\eta ',
      'λ': '\\lambda ',
      'μ': '\\mu ',
      'ν': '\\nu ',
      'φ': '\\varphi ',
      'ε': '\\varepsilon ',
      'Σ': '\\sum ',
      '≈': '\\approx ',
      '°': '^\\circ ',
      '→': '\\to ',
      '↔': '\\leftrightarrow ',
    };
    result += replacements[char] || char;
  }

  return result
    .replace(/F⃗/g, '\\vec F')
    .replace(/p⃗/g, '\\vec p')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderKatex(latex, displayMode) {
  return katex.renderToString(latex, {
    displayMode,
    throwOnError: false,
    strict: 'ignore',
    trust: false,
    output: 'html',
  });
}

export function InlineMath({ children, className = '' }) {
  const html = useMemo(() => renderKatex(toLatex(children), false), [children]);
  return (
    <span
      className={`physics-math-inline ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function BlockMath({ children, className = '' }) {
  const html = useMemo(() => renderKatex(toLatex(children), true), [children]);
  return (
    <div
      className={`physics-math-block ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function splitExplicitMath(text) {
  const parts = [];
  const regex = /\$([^$]+)\$/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: 'text', value: text.slice(last, match.index) });
    parts.push({ type: 'math', value: match[1] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
  return parts;
}

function splitKnownFormulas(text) {
  let parts = [{ type: 'text', value: text }];
  INLINE_FORMULAS.forEach((formula) => {
    const next = [];
    const regex = new RegExp(`(${escapeRegExp(formula)})`, 'g');
    parts.forEach((part) => {
      if (part.type !== 'text') {
        next.push(part);
        return;
      }
      const chunks = part.value.split(regex).filter(Boolean);
      chunks.forEach((chunk) => {
        next.push({ type: chunk === formula ? 'math' : 'text', value: chunk });
      });
    });
    parts = next;
  });
  return parts;
}

export function PhysicsInline({ children, className = '' }) {
  const source = String(children ?? '');
  const parts = splitExplicitMath(source).flatMap((part) => (
    part.type === 'math' ? [part] : splitKnownFormulas(part.value)
  ));

  return (
    <span className={className}>
      {parts.map((part, index) => (
        part.type === 'math'
          ? <InlineMath key={`${part.value}-${index}`}>{part.value}</InlineMath>
          : <Fragment key={`${part.value}-${index}`}>{part.value}</Fragment>
      ))}
    </span>
  );
}

function renderParagraph(paragraph, index) {
  const lines = paragraph.split('\n').filter(Boolean);
  const isList = lines.length > 1 && lines.every((line) => line.trim().startsWith('- '));
  const headingMatch = paragraph.match(/^\*\*(.+?)\*\*:?\s*([\s\S]*)$/);

  if (isList) {
    return (
      <ul key={index} className="space-y-3">
        {lines.map((line) => (
          <li key={line} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD700]" />
            <span><PhysicsInline>{line.replace(/^- /, '')}</PhysicsInline></span>
          </li>
        ))}
      </ul>
    );
  }

  if (headingMatch) {
    return (
      <section key={index} className="rounded-2xl border-l-4 border-l-[#00E5FF] bg-white/[0.025] px-5 py-4">
        <h4 className="mb-2 font-heading text-[15px] font-bold text-[#00E5FF]">
          <PhysicsInline>{headingMatch[1]}</PhysicsInline>
        </h4>
        {headingMatch[2] && (
          <p className="text-[14px] leading-8 text-white/70">
            <PhysicsInline>{headingMatch[2]}</PhysicsInline>
          </p>
        )}
      </section>
    );
  }

  return (
    <p key={index} className="text-[15px] leading-8 text-white/68">
      <PhysicsInline>{paragraph}</PhysicsInline>
    </p>
  );
}

export function PhysicsRichText({ text, className = '' }) {
  const paragraphs = String(text || '')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className={`physics-rich-text space-y-5 ${className}`}>
      {paragraphs.map(renderParagraph)}
    </div>
  );
}

export function FormulaDisplay({ formula, className = '' }) {
  return <BlockMath className={`text-white ${className}`}>{formula}</BlockMath>;
}
