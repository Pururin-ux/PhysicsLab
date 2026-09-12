# Проверка production-сборки

2026-09-08. Проверена текущая локальная версия apps/web, без публикации.

Команды из корня, PowerShell:

```powershell
$env:NEXT_DIST_DIR='.next-production-audit'
npm run build
npm run assert:routes
npm run smoke
```

Сборка завершилась успешно: Next.js 16.2.6, TypeScript и генерация
102 статических страниц. Изолированный distDir не затронул .next сервера
разработки. Автоматические добавления путей этого временного distDir в
tsconfig.json удалены после проверки; сама папка сохранена и игнорируется Git.

Обязательные маршруты расширены до 27: включены учебник и динамический
маршрут глав, тетрадь, средняя скорость, плотность, электричество, оптика,
диагностика и страница программы экзамена. Проверка манифеста теперь
использует NEXT_DIST_DIR, совпадающий со сборкой. Все обязательные маршруты
присутствуют, /dev отсутствует во всём production-манифесте.

37 автоматизированных проверок next start на 3100 прошли за 16,9 с:
страницы отвечают 200, основные области видимы, каждая из шести глав имеет
заголовок, самопроверку и загруженное изображение, dev-маршруты отвечают 404,
проверены базовые заголовки и контракт смешанного API-набора задач.
После прогона Playwright остановил собственный сервер. Попытка открыть
3100 вручную произошла уже после остановки (connection refused); ручного
визуального вердикта по production этим действием не получено.
Сервер разработки 3000 подтверждён живым отдельной проверкой порта.

## Границы доказательства

Это не полное прохождение всех взаимодействий в production, не аудит
доступности, безопасности или скорости на слабом телефоне, не проверка
деплоя/домена/синхронизации и не подтверждение покрытия школьной программы.
Полная цель платформы остаётся активной.

## Повторная сборка после восьмой главы и нового входа в обучение

Те же команды повторены после pressure, force-and-dynamometer, трёх целей
contact-pressure и LearningModes на /topics. Next.js 16.2.6: сборка и
TypeScript успешны, 106 статических страниц. Манифест: 27 обязательных
маршрутов присутствуют, dev-маршруты отсутствуют.

41 production-проверка прошла за 18,0 с. Все восемь глав загружают
иллюстрации и самопроверку. Дополнительно проверены реальные действия:
/topics → Читать → Сила и динамометр → два груза → разбор 3 Н → ответ
самопроверки → перезагрузка → сохранённый ответ → статус в оглавлении.
API давления выдаёт пять задач с тремя искомыми величинами и одним верным
вариантом в каждой задаче. Проверка не ограничивается статичным HTML.

После прогона 3100 остановлен самим Playwright; 3000 продолжает слушать
(PID30376). Автодобавления двух временных путей в tsconfig удалены; сборка
сохранена. Публикация и полный production-аудит мобильных взаимодействий
не выполнялись. Результат обновляет прежний срез шести глав, но не доказывает
полноту платформы или программы. Повторная попытка открыть спецификацию
РИКЗ 2026 через web закончилась тайм-аутом; её содержание не объявлено сверенным.

## Production verification after student-interface corrections

Built with NEXT_DIST_DIR=.next-production-audit, leaving the development .next and
port 3000 untouched. Build completed: 106 static pages, TypeScript successful.
assert:routes confirmed all 27 required routes and no development routes.
All 41 production smoke checks passed against next start on port 3100 (20.2 s).
Checks include eight illustrated chapters, required pages, headers, balanced task API,
force-model interaction and persisted check after reload, and pressure target variants.
Removed Next's auto-added isolated-output includes from tsconfig afterward.

A separate local production preview was started on 3100 for CUA inspection. Observed
fresh homepage at 390 px in dark/light, entered topics, searched relative velocity,
opened five-task practice, read updated air-reference wording and theme-aware diagram,
and answered 10 m/s correctly. Feedback and next-task control were visible above the
mobile navigation. This is evidence for this path, not full production acceptance.
Full curriculum, remaining broad lesson links, Mio library expansion, and other product
requirements remain unfinished. The production preview process is tracked separately
from development (exec session 8314).
