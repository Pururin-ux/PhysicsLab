import { renderFormulaToHtml } from "../../lib/formula-rendering";
import { cn } from "../../lib/utils";

interface MathTextProps {
  text: string;
  className?: string;
}

// Три типа инлайн-разметки конспекта, все в одном проходе:
// $...$ — формула (KaTeX), ==...== — маркер-выделение, **...** — акцент.
const TOKEN_PATTERN = /(\$[^$]+\$|==[^=]+==|\*\*[^*]+\*\*)/g;

function renderToken(token: string, key: number) {
  if (token.startsWith("$") && token.endsWith("$")) {
    return (
      <span
        key={key}
        className="formula-white whitespace-nowrap"
        dangerouslySetInnerHTML={{
          __html: renderFormulaToHtml(token.slice(1, -1)),
        }}
      />
    );
  }

  if (token.startsWith("==") && token.endsWith("==")) {
    return (
      <mark key={key} className="nova-highlight">
        {token.slice(2, -2)}
      </mark>
    );
  }

  if (token.startsWith("**") && token.endsWith("**")) {
    return (
      <strong key={key} className="font-bold text-white">
        {token.slice(2, -2)}
      </strong>
    );
  }

  return <span key={key}>{token}</span>;
}

// Рендерит строку с фрагментами $...$/==...==/**...** как настоящую разметку:
// формулы через KaTeX, ==...== как маркер-выделение, **...** как акцент.
export function MathText({ text, className }: MathTextProps) {
  const parts = text.split(TOKEN_PATTERN);

  if (parts.length === 1) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={cn("[&_.katex]:text-[1.02em]", className)}>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          renderToken(part, index)
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </span>
  );
}
