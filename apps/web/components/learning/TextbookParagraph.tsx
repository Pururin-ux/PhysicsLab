import Link from "next/link";
import { MathText } from "../ui/MathText";
import { Button } from "../ui/Button";
import { LessonCrumbs } from "./LessonCrumbs";
import { TextbookCheck } from "./TextbookCheck";
import { TextbookScene } from "./TextbookScene";
import { PressureTransfer } from "./PressureTransfer";
import { learningEntries } from "../../lib/learning/learning-entry";
import {
  paragraphNumber,
  physics9Book,
  type TextbookBlock,
  type TextbookBook,
  type TextbookChapter,
} from "../../lib/learning/textbook";
import styles from "./TextbookParagraph.module.css";

/** Школьный параграф: один материал внутри класса, с внутренними разделами.
 *  Номер § показывается только тогда, когда он подтверждён источником. */
export function TextbookParagraph({
  chapter,
  practiceReturn,
}: {
  chapter: TextbookChapter;
  practiceReturn?: { href: string; label: string } | null;
}) {
  const number = paragraphNumber(chapter.source.section);
  const book: TextbookBook = chapter.source.book ?? physics9Book;
  const connection = learningEntries.find((entry) => entry.id === chapter.id)?.connection;
  const next =
    connection && connection.href.startsWith("/learn/") && connection.href !== `/learn/${chapter.id}`
      ? connection
      : null;
  const practiceHref = practiceReturn?.href ?? chapter.practice.href;
  const practiceLabel = practiceReturn
    ? `Вернуться к задачам: ${practiceReturn.label}`
    : chapter.practice.label;

  const sectionIds = chapter.sections.map((_, index) => `razdel-${index + 1}`);
  const outline: { id: string; title: string }[] = [
    { id: "nablyudenie", title: "Наблюдение" },
    ...chapter.sections.map((section, index) => ({ id: sectionIds[index], title: section.title })),
    { id: "primer", title: "Разберём пример" },
    ...(chapter.summary?.length ? [{ id: "korotko", title: "Коротко" }] : []),
    { id: "self-check", title: "Проверь себя" },
  ];

  return (
    <article className={styles.paragraph}>
      <header className={styles.header}>
        <LessonCrumbs
          items={[
            { label: `← К оглавлению ${chapter.grade} класса`, href: `/learn?grade=${chapter.grade}` },
          ]}
        />
        <p className={styles.meta}>
          {chapter.grade} класс
          {chapter.unit ? <span aria-hidden="true"> · </span> : null}
          {chapter.unit ? chapter.unit : null}
        </p>
        <h1 className={styles.title}>
          {number ? <span className={styles.number}>§ {number}. </span> : null}
          {chapter.title}
        </h1>
        <p className={styles.lead}>{chapter.lead}</p>
      </header>

      <nav className={styles.outline} aria-label="В этом параграфе">
        <span className={styles.outlineLabel}>В этом параграфе</span>
        <ul className={styles.outlineList}>
          {outline.map((item) => (
            <li key={item.id}>
              <a className={styles.outlineLink} href={`#${item.id}`}>
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <details className={styles.outlineDisclosure}>
        <summary>В этом параграфе</summary>
        <ul className={styles.outlineList}>
          {outline.map((item) => (
            <li key={item.id}>
              <a className={styles.outlineLink} href={`#${item.id}`}>
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </details>

      <section id="nablyudenie" className={styles.wideSection}>
        <TextbookScene chapterId={chapter.id} />
      </section>

      {chapter.sections.map((section, index) => (
        <section key={section.title} id={sectionIds[index]} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          {section.paragraphs.map((text) => (
            <p key={text} className={styles.text}>
              <MathText text={text} />
            </p>
          ))}
          {section.blocks?.map((block, blockIndex) => (
            <Block key={`${section.title}-${blockIndex}`} block={block} />
          ))}
        </section>
      ))}

      <section id="primer" className={styles.section}>
        <h2 className={styles.sectionTitle}>Разберём пример</h2>
        <p className={styles.text}>
          <MathText text={chapter.example.question} />
        </p>
        <div className={styles.example}>
          <div className={styles.exampleData}>
            {chapter.example.given?.length ? (
              <div className={styles.exampleGroup}>
                <h3 className={styles.exampleLabel}>Дано</h3>
                <ul className={styles.exampleList}>
                  {chapter.example.given.map((line) => (
                    <li key={line}>
                      <MathText text={line} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {chapter.example.find ? (
              <div className={styles.exampleGroup}>
                <h3 className={styles.exampleLabel}>Найти</h3>
                <p className={styles.exampleLine}>
                  <MathText text={chapter.example.find} />
                </p>
              </div>
            ) : null}
          </div>
          <div className={styles.exampleSolution}>
            <h3 className={styles.exampleLabel}>Решение</h3>
            <ol className={styles.exampleSteps}>
              {chapter.example.steps.map((step) => (
                <li key={step}>
                  <MathText text={step} />
                </li>
              ))}
            </ol>
          </div>
        </div>
        {chapter.example.answer ? (
          <p className={styles.exampleAnswer}>
            Ответ: <b>{chapter.example.answer}</b>
          </p>
        ) : null}
        <p className={styles.exampleNote}>{chapter.example.conclusion}</p>
      </section>

      {chapter.summary?.length ? (
        <section id="korotko" className={styles.section}>
          <h2 className={styles.sectionTitle}>Коротко</h2>
          <div className={`lesson-note ${styles.summary}`}>
            <ul>
              {chapter.summary.map((line) => (
                <li key={line}>
                  <MathText text={line} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section id="self-check" className={`${styles.section} scroll-mt-24`}>
        <h2 className={styles.sectionTitle}>Проверь себя</h2>
        <div className={`lesson-card ${styles.check}`}>
          <TextbookCheck chapterId={chapter.id} check={chapter.check} />
        </div>
      </section>

      <div className={styles.footer}>
        <Button asChild size="lg">
          <Link href={practiceHref}>{practiceLabel}</Link>
        </Button>
        <nav className={styles.footerNav} aria-label="Переход по курсу">
          <Link href={`/learn?grade=${chapter.grade}`} className={styles.footerLink}>
            ← К оглавлению {chapter.grade} класса
          </Link>
          {next ? (
            <Link href={next.href} className={styles.footerNext}>
              Следующий параграф: {next.label} →
            </Link>
          ) : null}
        </nav>
        <details className={styles.source}>
          <summary>Источник</summary>
          <p>
            {book.title}, {chapter.source.section}
            {number ? "" : " (номер параграфа не подтверждён отдельным §)"}, с.{" "}
            {chapter.source.printedPage}. {book.authors}.
          </p>
          <a
            className={styles.sourceLink}
            href={chapter.source.pdfPage ? `${book.url}#page=${chapter.source.pdfPage}` : book.url}
            target="_blank"
            rel="noreferrer"
          >
            {chapter.source.pdfPage
              ? "Открыть страницу в официальном учебнике"
              : "Найти учебник в официальном электронном каталоге"}
          </a>
        </details>
      </div>
    </article>
  );
}

function Block({ block }: { block: TextbookBlock }) {
  switch (block.kind) {
    case "formula":
      return (
        <div className={`lesson-card lesson-card--inset ${styles.formula}`}>
          <MathText className={styles.formulaDisplay} text={`$${block.latex}$`} />
          {block.legend?.length ? (
            <dl className={styles.legend}>
              {block.legend.map((item) => (
                <div key={item.symbol}>
                  <dt>
                    <MathText text={`$${item.symbol}$`} />
                  </dt>
                  <dd>{item.meaning}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      );
    case "callout":
      return (
        <p className={`lesson-note ${styles.callout}`}>
          <MathText text={block.text} />
        </p>
      );
    case "conversions":
      return (
        <dl className={styles.conversions}>
          {block.rows.map((row) => (
            <div key={row.from}>
              <dt>{row.from}</dt>
              <span aria-hidden="true" className={styles.conversionArrow}>
                →
              </span>
              <dd>{row.to}</dd>
            </div>
          ))}
        </dl>
      );
    case "calculations":
      return (
        <div className={styles.calculations}>
          {block.items.map((item) => (
            <div key={item.title} className={styles.calculation}>
              <h3 className={styles.exampleLabel}>{item.title}</h3>
              <ul className={styles.stepLines}>
                {item.steps.map((step) => (
                  <li key={step}>
                    <MathText text={step} />
                  </li>
                ))}
              </ul>
              {item.bar !== undefined && block.scaleKPa ? (
                <span
                  className={styles.barTrack}
                  role="img"
                  aria-label={`Давление ${item.bar} кПа на общей шкале от 0 до ${block.scaleKPa} кПа`}
                >
                  <span
                    className={styles.barFill}
                    data-testid={item.testId}
                    style={{ width: `${(item.bar / block.scaleKPa) * 100}%` }}
                  />
                </span>
              ) : null}
              {item.note ? <p className={styles.exampleNote}>{item.note}</p> : null}
            </div>
          ))}
        </div>
      );
    case "list":
      return (
        <ul className={styles.list}>
          {block.items.map((item) => (
            <li key={item}>
              <MathText text={item} />
            </li>
          ))}
        </ul>
      );
    case "interaction":
      if (block.id === "pressure-transfer") return <PressureTransfer />;
      return null;
  }
}
