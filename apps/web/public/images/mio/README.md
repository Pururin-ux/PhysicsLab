# Мио

Авторский аниме-маскот PhysicsLab Web. Образ одобрен Сашей 08.09.2026.
Источник: встроенный imagegen, текущая задача 01a07fda-30d2-73b1-949c-0fb4ae0ceaa7.
Оригинал: exec-b0db484a-0134-4b75-95df-84f7e7caed57.png; сохранён без изменений.
Ассет mio-thinking-v1.png: прозрачный фон, поза размышления с блокнотом.
Использование: AverageSpeedLab, напарница по проверке гипотез.
Это авторский персонаж; не является свободным ИИ-чатом и не оценивает
свободный текст ученика автоматически.

Подключённые дополнительные состояния:
- `mio-surprised-v1.png`: открытие, исходник exec-9562b977-3f78-4969-a76d-abbc9b863112.png.
- `mio-celebrate-v1.png`: успех, исходник exec-33126a82-deb7-4075-a948-cdcc7d6bbd76.png.

Обе версии имеют настоящую прозрачность; фон проверен в интерфейсе.
Объясняющая поза с открытой книгой сгенерирована, но не подключена:
генератор пока сохраняет нарисованную клетку вместо прозрачного фона.
Не использовать промежуточные RGB-версии с клетчатым фоном в продукте.

Реакции: мягкое появление при смене состояния; один короткий подъём и наклон
при успехе. Бесконечных циклов нет. При reduced motion анимация выключена.

`mio-attentive-v1.png`: внимательная проверка условий, без улыбки. Исходник
imagegen exec-0deb7299-b29b-4737-bc95-e05b8e323597.png содержал нарисованный
шахматный фон (RGB). Фон удалён Adobe Photoshop select-subject cutout,
request 36a43756-9ce7-4218-a878-56dde67681b2. Результат RGBA 1254×1254.
В AverageSpeedLab используется при объяснении и самостоятельном расчёте.
Края тонких волос требуют отдельной проверки при крупном использовании;
не считать автоматическую вырезку полноценной ручной ретушью.

`textbook-path-v1.png`: Мио вернулась за блокнотом. Источник
exec-baf39f2e-9a15-49ba-bd5f-e81dbc3555f6.png, правка черновика
exec-8cdce50d-4476-410d-9b9d-8de97c832357.png с исходным портретом как якорем.
Убраны несвязанные приборы, открытая улыбка и сильный румянец. Непрозрачная
контекстная сцена 1536×1024. Дистанция 20 м задаётся отдельной моделью;
перспектива рисунка не служит измерением расстояния.

`textbook-average-v1.png`: Мио стоит рядом с велосипедом на подножке,
сосредоточенно проверяет секундомер. Источник exec-b8067e37-7792-493e-8b5c-9e095dc7d7c0.png,
переработан черновик exec-b92b1f4c-b4a8-471d-888d-292bba08e8d9.png:
исправлена постановка персонажа рядом с велосипедом, убрана улыбка.
Не использовать изображённый секундомер как источник численных данных.

`textbook-acceleration-v1.png`: Мио держится за поручень троллейбуса,
наблюдая улицу. Источник exec-943988ad-0654-42bd-8da6-6c556b2612dd.png.
Это контекст, а не изображение измеренных скорости или ускорения;
направления задаёт отдельная модель с явно выбранной осью.

`textbook-measurement-v1.png`: боковой ракурс, Мио читает мениск на уровне
глаз. Финальный источник exec-9e2fd8d1-9eb1-4ee7-a9d1-f2cc16dbbbae.png.
После исходника exec-c223266e-4369-420e-8707-c6ab4362464f.png исправлены
видимая заколка на неверной стороне и высота воды относительно глаза.
Промежуточный exec-e2da1065-1b0c-41e0-a536-906e815a7401.png не подключён.
В профиле заколка на дальнем виске скрыта волосами. Численные шкалы и
погрешности объясняет отдельный MeasurementModel, не рисунок.

`textbook-density-v1.png`: источник exec-bdf03c51-354a-409b-b204-463051467ca1.png, 1536×1024. Мио помещает образец на весы, сосредоточена, рот закрыт. Проверены сторона пряди и четырёхлучевой заколки, контакт руки с образцом, различимость предметов. Показания весов не изображены; численные доказательства даёт DensityModel. Изображение показывает помещение образца, не окончательный отсчёт при касании рукой.

`textbook-inertia-v1.png`: exec-03a7f847-7781-496e-9502-440343d05b41.png, 1536×1024. Мио удерживает лабораторную тележку за ручку; свободная шайба на платформе. Закрытая усмешка, приподнятая бровь, активная поза. Изображение контекстное; мировые координаты и скорость задаёт InertiaModel.

`textbook-pressure-v1.png`: exec-b287dd61-1edd-4bbf-a7a6-c9e3ce819a7f.png, 1536×1024. Мио наблюдает два бруска на разных гранях и мягких опорах; руки не давят на них. Закрытая сосредоточенная мимика. Растр показывает качественный опыт; численные сила, площадь и давление задаются отдельно в PressureModel.

## Force chapter · 2026-09-08
- Asset: textbook-force-v1.png. Built-in imagegen, source exec-d21f94a8-f183-4636-adb9-df2bacbfee68.png (original preserved).
- Identity reference: mio-thinking-v1.png. New action: recording a suspended spring dynamometer observation.
- Review: navy bob, cyan right forelock, left gold star, cyan/cream/navy outfit retained. Closed focused mouth, apparatus connected to stand, load clear of table, hands not supporting load. Narrative art only; calibrated diagram supplied separately.
- Production prompt recorded in docs/design/mio/force-prompt.md.

## Skeptical state and hypothesis revision · 2026-09-08
- Runtime: mio-skeptical-v2.png; original imagegen exec-4459a0e6-d2eb-4535-b709-9ba588e49aa9.png.
- First generated RGB image had a painted checkerboard. First Adobe cutout (request 00785f1b-db71-4adf-b133-602b00e8b6bf, output 247528a2-467d-43f5-be12-16a5c20e5171) retained checkerboard pixels in hair gaps: mio-skeptical-v1.png is a rejected intermediate, not referenced by UI.
- Targeted imagegen cleanup to opaque white: exec-67aceb36-a749-41d7-a09a-5224e23d9a40.png. Adobe second cutout request c802387a-b28c-4f0b-8414-c67ec13ea3b0, output 6a75cb0b-dffd-4b0b-a284-269b1f1e2fd8. 1254 square PNG.
- Visual purpose: skepticism about Mio's own initial hypothesis, never punishment for a pupil's wrong answer. Closed mouth, asymmetrical brows, folded arms and notebook. Used before the counterexample in AverageSpeedLab.
- Desktop dark-background edges and mobile revised-note layout visually checked. This is a static actor state, not a facial animation rig. SVG strike animates the correction of her own claim.
- Prompt record: docs/design/mio/skeptical-prompt.md.

## Relative motion chapter · 2026-09-08
- Runtime: textbook-relative-v1.png (1536×1024), built-in imagegen source exec-03d46b09-9e17-4aed-9db8-4b6441b9a858.png.
- Reference: mio-thinking-v1.png. Mio observes a passing boat from the bank, holding a notebook and pencil; focused closed mouth.
- Identity reviewed: navy bob, cyan right forelock, left gold star and cyan/cream/navy jacket. No generated labels or formulae. The boat scene supplies context; RelativeMotionModel supplies coordinates and measurements.
- Original and route reviewed visually. Mobile crop retains both Mio and boat; bottom fade checked against light and dark surfaces. No Adobe edits were needed for this image.
