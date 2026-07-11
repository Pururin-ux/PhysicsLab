# PhysicsLab — Public Beta Runbook

## Runtime

- Node **22.18.0** (см. CI parity; локально — nvm/volta на эту версию).
- npm ≥ 10 (идёт с Node 22).
- Установка: `npm ci` в корне репозитория и отдельно
  `npm ci --prefix apps/web` (два lock-файла, как в CI).
- Build: `cd apps/web && npm run build`.
- Start: `npm run start -- --hostname 0.0.0.0 --port 3000` (production
  server из `.next`).
- Health-проверка: `GET /` → 200, `GET /api/tasks?template=free-fall&count=3&batch=0`
  → 200 JSON с 3 задачами, `GET /nonexistent` → 404 со страницей приложения.

Известные грабли: `next dev` и `next build` делят `.next` — перед build
остановить dev-сервер.

## Deployment

Проект не привязан к конкретному hosting-провайдеру (Vercel/Netlify config
в репозитории отсутствует). Любой Node-хостинг:

- root directory: `apps/web` (build/start исполняются из него);
- build command при root directory `apps/web`: `npm ci && npm run build`;
- start command: `npm run start`;
- output: стандартный `.next` (standalone-режим не включён);
- обязательных secrets НЕТ: приложение не использует env-переменные,
  базы данных или внешние API.

Preview deployment: собрать и запустить тот же build на отдельном
порту/окружении, прогнать smoke-чеклист ниже. Production deployment: тот же
артефакт; после переключения — smoke-чеклист. Rollback: deploy предыдущего
known-good commit (см. «Rollback» ниже).

## Smoke checklist

1. `/` — landing открывается, есть CTA «К задачам».
2. `/topics` — пять активных тем + смешанная тренировка.
3. `/practice/kinematics-demo`, `/practice/dynamics-demo`,
   `/practice/electro-demo`, `/practice/thermo-demo`,
   `/practice/optics-demo` — задача загружается, ответ работает.
4. `/formulas` — справочник рендерится, поиск работает.
5. `/profile` — открывается без ошибок.
6. `/practice/exam-demo` — смешанная тренировка стартует.
7. `GET /api/tasks?template=free-fall&count=3&batch=0` — 200, 3 задачи.
8. `GET /api/tasks?template=exam&count=10&batch=0` — 200, 10 задач,
   по 2 из каждой темы.
9. Несуществующий URL — страница «Страница не найдена» с навигацией.
10. Отключить сеть → в тренировке появляется карточка ошибки с
    «Попробовать снова»; включить сеть → retry загружает тот же batch.
11. DevTools → заблокировать localStorage (или режим инкогнито с
    отключённым хранилищем) → приложение работает, показывается
    уведомление о несохранении прогресса.

Автоматизированный вариант: `npm run build && npm run smoke`
(production-сервер на 3100 поднимается конфигом сам).

## Data model (честно)

- Аккаунтов нет.
- Прогресс хранится в browser localStorage (`physicslab-v3-*`,
  версионированный конверт, текущая версия прогресса — 3).
- Восстановление незавершённой тренировки — sessionStorage
  (`physicslab-v3-active-quiz-v1`), живёт в рамках вкладки, максимум сутки.
- Очистка данных браузера удаляет прогресс. Облачной синхронизации нет.
- Проверка ответов клиентская: это учебный тренажёр, а не защищённый
  экзамен; анти-чит не заявляется.

## Rollback

1. Deploy предыдущего known-good commit (main всегда зелёный: CI гоняет
   types/unit/e2e/a11y/visual/build/manifest/smoke).
2. Локальные данные пользователей при откате НЕ страдают:
   - данные «из будущего» (записанные более новой версией) старая версия
     не читает и не удаляет — пользователь видит временный чистый прогресс
     и уведомление;
   - при следующем деплое новой версии эти данные снова подхватываются.
3. После отката прогнать smoke-чеклист и проверить, что миграции хранилища
   читают v1/v2/v3 (unit-тесты `progress-store.test.ts`,
   `storage-envelope.test.ts`).
