"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { filterNotebook, readNotebook } from "../../lib/learning/notebook";
import { Button } from "../ui/Button";

export function LearningNotebook() {
  const [notebook, setNotebook] = useState<ReturnType<typeof readNotebook> | null>(null);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const refresh = () => setNotebook(readNotebook());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener("focus", refresh); };
  }, []);
  if (!notebook) return <p role="status">Открываю твои записи…</p>;
  const visible = filterNotebook(notebook.notes, query);
  return <div className="mx-auto flex w-full max-w-[820px] flex-col gap-7 text-[var(--text-primary)]">
    <header>
      <Link className="inline-flex min-h-11 items-center text-sm text-[var(--action-primary)]" href="/profile">К прогрессу</Link>
      <h1 className="type-h1 mt-3">Мой блокнот</h1>
      <p className="mt-3 max-w-[640px] leading-relaxed text-[var(--text-secondary)]">Физика твоими словами. Здесь собраны объяснения, которые ты сохранил в уроках. Можно перечитать свою мысль и проверить её снова.</p>
    </header>
    {notebook.unavailable > 0 && <p role="alert" className="rounded-xl border border-[var(--border-strong)] p-4">Часть записей не удалось прочитать. Их содержимое не изменено. Сохрани имеющийся файл резервной копии, если он у тебя есть.</p>}
    {notebook.notes.length === 0 ? <section className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-primary)] p-6">
      <h2 className="type-h2">Первая запись — после открытия</h2>
      <p className="my-4 leading-relaxed text-[var(--text-secondary)]">В опыте с Мио проверь, как время движения меняет среднюю скорость. В конце запиши объяснение и нажми «Сохранить моё объяснение» — оно появится здесь.</p>
      <Button asChild><Link href="/practice/average-speed-lesson">Провести опыт с Мио</Link></Button>
    </section> : <>
      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="notebook-search">Найти в записях</label>
        <input id="notebook-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Например, скорость или время" className="min-h-12 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-primary)] px-4 outline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--action-primary)]" />
        <p role="status" className="mt-2 text-sm text-[var(--text-secondary)]">Найдено записей: {visible.length} из {notebook.notes.length}</p>
      </div>
      <div className="flex flex-col gap-4">
        {visible.map((note) => <article key={note.id} className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-primary)] p-5 sm:p-6">
          <p className="mb-2 text-xs text-[var(--text-secondary)]">Моё объяснение</p>
          <h2 className="type-h2">{note.title}</h2>
          <p className="my-5 whitespace-pre-wrap break-words border-l-2 border-[var(--action-primary)] pl-4 leading-relaxed">{note.text}</p>
          <Link className="inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-[var(--action-primary)] focus-visible:outline-2 focus-visible:outline-offset-4" href={note.href}>Вернуться в урок и дополнить</Link>
        </article>)}
        {visible.length === 0 && <p className="py-6">Таких записей пока нет. Попробуй другое слово.</p>}
      </div>
    </>}
    <footer className="border-t border-[var(--border-strong)] pt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
      <p>Это личные записи, а не проверенные ответы. Они хранятся в этом браузере и входят в файл прогресса.</p>
      <Link className="mt-2 inline-flex min-h-11 items-center text-[var(--action-primary)]" href="/profile#data-management">Сохранить резервную копию</Link>
    </footer>
  </div>;
}
