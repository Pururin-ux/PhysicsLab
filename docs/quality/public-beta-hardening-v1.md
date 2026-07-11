# Public Beta Hardening v1 — baseline и результат

Базлайн зафиксирован на main `08d1624` (после PR #16) чтением кода и
воспроизведением через Playwright route-интерцепцию. Ниже — поведение ДО
изменений этого PR и что сделано.

## Baseline: поведение до hardening

| # | Сценарий | Поведение до |
| --- | --- | --- |
| 1 | `/api/tasks` → 500 | generic «Не удалось загрузить задачи.», retry загружал ДРУГОЙ batch (batch+1) |
| 2 | `/api/tasks` → 503 | то же: ошибка неотличима от 4xx |
| 3 | invalid JSON | `response.json()` бросал SyntaxError; пользователю показывался сырой текст исключения («Unexpected token…») |
| 4 | `{}` | `payload.tasks === undefined` → `tasks.length` падал ниже по дереву; пустой экран |
| 5 | `{ tasks: [] }` | status ready, `currentTask === undefined` → `return null` → пустой экран |
| 6 | malformed single-choice task | без валидации попадал в UI; рендер падал или показывал битую карточку |
| 7 | malformed numeric task | то же: `task.answer.unit` мог бросить TypeError |
| 8 | зависший fetch | бесконечное «Готовлю новый набор задач…», без timeout |
| 9 | offline во время загрузки | generic message «Failed to fetch» неотличим от серверной ошибки |
| 10 | быстрая смена batch | AbortController был; гонок state не зафиксировано (abort по deps) — OK |
| 11 | refresh на задаче 4/10 | прогресс сессии терялся, началась новая сессия с задачи 1 |
| 12 | refresh после ответа до Next | ответ терялся; XP уже начислен, но задача начиналась заново |
| 13 | повреждённый recovery snapshot | recovery не существовал |
| 14 | повреждённый progress | envelope удалял ключ, store получал default — молча (OK, но без уведомления) |
| 15 | future-version progress | не читался и не удалялся (OK), но первая же запись сессии ЗАТИРАЛА future-данные текущей версией |
| 16 | localStorage read/write бросает | canUseStorage ловил property-доступ; write молча проглатывал ошибку и терял данные без уведомления |
| 17 | quota exceeded | write молча проглатывал; UI продолжал утверждать, что прогресс сохранён |
| 18 | несуществующий route | дефолтная минимальная 404 Next без навигации приложения |
| 19 | неполный список задач (n < 10) | принимался как валидный; total считался по факту (сессия «из 7») |
| 20 | ready без currentTask | `return null` → пустой экран |

Route-level: `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`
отсутствовали; runtime-исключение в route давало пустой экран в production.
API: внутренние ошибки возвращались как 400 с сырым `error.message`
(утечка внутренних формулировок), без `Cache-Control: no-store`.
Headers: не было `X-Content-Type-Options`, `Referrer-Policy`,
`Permissions-Policy`, `X-Frame-Options`; `X-Powered-By` включён.

## Что сделано (сводка)

- Типизированная модель ошибок загрузки (`offline / timeout / network / http /
  invalid_payload / empty_payload / integrity`), retry того же batch,
  таймаут 12 с, страховка от гонок поколением запроса.
- Pure-валидатор клиентского payload (`lib/quiz/quiz-payload.ts`) — malformed
  задачи не доходят до UI.
- Восстановление незавершённой сессии из sessionStorage
  (`physicslab-v3-active-quiz-v1`): active и answered фазы, без повторного XP,
  со строгой валидацией и очисткой.
- `writeStore` возвращает typed result; статус персистентности + одно
  ненавязчивое уведомление при quota/unavailable/corrupt/future-version;
  future-данные не затираются записью.
- `error.tsx` / `global-error.tsx` / `not-found.tsx`.
- API: стабильный error envelope `{ error, code, retryable }`, 500 для
  внутренних сбоев без утечки сообщений, `Cache-Control: no-store`, guard на
  пустой/дублированный результат генерации.
- Security headers + `poweredByHeader: false`. CSP отложен как follow-up:
  непроверенный CSP ломает KaTeX/inline-styles/Framer Motion.

## Известные ограничения (честно)

- Приложение offline-aware, но не offline-capable: без сети новые задачи не
  загружаются, и это прямо сообщается.
- Проверка ответов остаётся клиентской (учебный инструмент, не анти-чит).
- Аккаунтов и облачной синхронизации нет; очистка данных браузера удаляет
  прогресс.

## P2 follow-ups

- Полноценный протестированный CSP.
- Восстановление summary-фазы после reload (сейчас после записи результата
  снапшот очищается и summary не восстанавливается — данные уже в прогрессе).
- Persistent-уведомление о corrupt-сбросе показывается один раз на вкладку;
  межвкладочная синхронизация уведомлений не делается сознательно.
