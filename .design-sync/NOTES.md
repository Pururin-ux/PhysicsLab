# design-sync NOTES — PhysicsLab

- Репо — Next.js-приложение (apps/web), НЕ пакет: нет dist/, нет node_modules/<pkg>. Вход бандла — генерируемый файл `apps/web/.ds-entry.ts`; наружу публикуется 31 компонент из `componentSrcMap`. Полный прогон: `node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules apps/web/node_modules --entry apps/web/.ds-entry.ts --out ds-bundle --render-sample 0`. При изменении `componentSrcMap` перегенерировать `.ds-entry.ts`.
- CSS: `apps/web/.ds-css/tailwind.css` — КОПИЯ скомпилированного Next-бандла (`apps/web/.next/static/css/<big-hash>.css`, содержит Tailwind v4 + KaTeX) с путями шрифтов, переписанными на ./media/. После изменения стилей сайта и `npm run build` копию нужно обновить (sed '/_next/static/media/ → ./media/' + docopy woff2). cssEntry ограничен корнем пакета — потому файл лежит в apps/web, а не в .design-sync.
- Шрифты: `.design-sync/css/fonts.css` (Manrope/Unbounded из next/font — чистые @font-face из малого css Next-сборки; + JetBrains Mono variable woff2 с Google Fonts, OFL — пользователь одобрил вложение 17.07.2026). Медиа рядом в `.design-sync/css/media/`.
- `runtimeFontPrefixes`: STIX Two Math / Cambria Math / Latin Modern Math / Roboto Mono — системные фолбэки ПОЗАДИ вложенных шрифтов (KaTeX_* и JetBrains Mono); сайт их тоже не поставляет.
- Исключены из DS (жёсткая привязка к Next runtime / глобальному состоянию): QuizSession, PracticeWithHelp, SessionSummary, QuizLoadErrorCard (next/link), CoachAvatar/NovaReaction/NovaStage (next/image), XPBadge (nanostores) и все страницы-композиции (landing/profile/mistakes/tasks). SvgMathLabel — служебный, скрыт.
- Playwright для validate: `.ds-sync` держит playwright@1.61.1 (совпадает с пином репо; chromium уже в кэше ms-playwright).
- CoachBubble исключён: транзитивно импортирует NovaReaction → next/image; один top-level process.env валит весь IIFE-бандл (все превью падали с «process is not defined»).
- Превью-фон: emit рендерит стори на белом body; DS тёмная → cfg.provider=DsDarkSurface (apps/web/.ds-surface.tsx, подключён через extraEntries "./.ds-surface.tsx") оборачивает каждую стори тёмной подложкой #07081E.
- `.design-sync/conventions.md` вшивается через `readmeHeader`: там отдельно указано, что `DsDarkSurface` — только стенд превью и не должен попадать в экраны продукта.
- `dtsPropsFor` в `.design-sync/config.json` хранит публичные контракты всех 31 компонентов. После изменения исходных пропсов нужно синхронно обновить этот раздел; иначе Claude Design увидит устаревший API при корректном рендере превью.

## Риски повторной синхронизации

- Перед прогоном обновить `apps/web/.ds-css/tailwind.css` и вложенные шрифты, если менялся production CSS или запускался новый Next build с другими хешами.
- Не удалять авторские `.design-sync/previews/*.tsx`: генератор считает их пользовательскими и использует для визуальной аттестации.
- После каждого изменения конфига или компонентного API запускать полный `resync.mjs`, а не только `package-build.mjs`; итог должен показать 31 clean render, `pendingGrade: []` и 0 capture errors.
- `StarField` намеренно использует fixed-позиционирование. Его override остаётся в single-режиме; это не дефект переполнения карточки.

## Re-sync risks (что может молча протухнуть)
- `apps/web/.ds-css/tailwind.css` и шрифты в `fonts/` — копии из `.next` production-сборки. После изменения стилей/страниц сайта: `npm run build`, затем обновить копию (sed путей `/_next/static/media/` → `./media/`) и docopy новых woff2. Иначе DS отстанет от сайта.
- `apps/web/.ds-entry.ts` генерируется из `componentSrcMap` — при добавлении/удалении компонентов перегенерировать (иначе бандл не совпадёт с конфигом).
- Репозиторий лежит в OneDrive: после сна машины OneDrive может выгрузить сгенерированные PNG (`ds-bundle/_screenshots/**`) при живом кэше оценок — лечится `rm .design-sync/.cache/review/*.json` + полный `package-capture`.
- Сюжеты превью (тексты задач) взяты из актуального банка задач 17.07.2026 — при переписывании формулировок на сайте превью не сломаются, но могут разойтись с продом по содержанию.
- Классификатор-инфраструктура сессии дважды «падала» с ложными ошибками записи; часть «упавших» вызовов реально применялась. При странных дублях/расхождениях file-state — сверять содержимое файла перед перезаписью.

## Known render warns
- (пусто — финальный validate чист: 31/31, bad/thin/variantsIdentical = 0)
