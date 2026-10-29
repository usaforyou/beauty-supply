# Отчёт финального аудита и апгрейда — Beauty Supply (редакция 2)

Дата: 29.10.2026. Выполнен по промпту `docs/FINAL_AUDIT_PROMPT.md`.
Формат: проблема → исправление → доказательство → остаточное ограничение.

## Соответствие каталога источнику

Источник: [aifirsts.github.io/s/catalog](https://aifirsts.github.io/s/catalog/) (подтверждено 29.10.2026). Цены текущего `products.json` совпали с источником до апгрейда — изменения коснулись описаний, фото, статусов и категорий.

| ID | Товар в источнике | Цена, ₽ | Фото (assets/products/) | Статус |
|---|---|---|---|---|
| BS-001 | Hourglass Ambient Lighting Blush | 2 960 | hourglass-ambient-lighting-blush-01.jpg | в наличии |
| BS-002 | Charlotte Tilbury Pillow Talk Eyeshadow Palette | 6 000 | charlotte-tilbury-pillow-talk-palette-01.jpg | в наличии |
| BS-003 | Hourglass Curator Minimalist Palette | 5 200 | hourglass-curator-minimalist-palette-01.jpg | в наличии |
| BS-004 | IMAGE Skincare VOL.U.LIFT Body Cream | 8 500 | image-vol-u-lift-body-cream-01.jpg | в наличии |
| BS-005 | IMAGE Skincare VOL.U.LIFT Concentrate | 12 900 | image-vol-u-lift-concentrate-01.jpg | в наличии |
| BS-006 | IMAGE Skincare Daily Prevention SPF 30 | 4 900 | image-daily-prevention-spf-30-variants-01.jpg | в наличии |
| BS-007 | IMAGE Skincare Vital C Night Cream | 8 500 | image-vital-c-night-cream-01.jpg | в наличии |
| BS-008 | IMAGE Skincare Daily Prevention SPF 75 | 6 700 | image-daily-prevention-spf-75-01.jpg | в наличии |
| BS-009 | IMAGE MD Biotech Longevity Crème | 10 400 | image-md-biotech-longevity-creme-01.jpg | в наличии |
| BS-010 | IMAGE MD Restoring Youth Serum | 11 999 | image-md-restoring-youth-serum-01.jpg | в наличии |
| BS-011 | IMAGE The MAX Crème (48 г) | 11 500 | image-the-max-supply.jpg | в наличии · новое поступление |
| BS-012 | IMAGE The MAX Eye Crème (15 мл) | 6 800 | image-the-max-supply.jpg | в наличии · новое поступление |
| BS-013 | IMAGE MD Restoring Power-C Serum (30 мл) | 11 500 | image-md-power-c-and-biotech-supply.jpg | в наличии · новое поступление |

Категория BS-005 изменена «Уход за телом» → «Уход за кожей» (источник: «Кремы для лица»).

## Найденные проблемы и исправления

| # | Проблема | Исправление | Доказательство | Остаточное ограничение |
|---|---|---|---|---|
| 1 | Позиционирование «Москва» во всех текстах | Заменено на «Россия, доставка по всей России»: title, meta, OG, hero, преимущества, заголовки секций, FAQ, футер, city в JSON | DOM-проверка: `/Москв/i` по body — false; «Росси» встречается 19 раз; Avito-ссылки не тронуты | Фактическое место хранения товара в источнике — Москва; на сайте не утверждается иное |
| 2 | Заглушки вместо фото товаров | 12 фото из источника скачаны в assets/products/, пути в photos, alt из источника в photo_alt | 13/13 img с naturalWidth>0 (после decode); валидные JPEG (проверены сигнатуры) | Два товара делят одно фото поставки (BS-011/BS-012) — так в источнике |
| 3 | Секция «Предзаказ» противоречит источнику (все 13 в наличии) | BS-011–013 → статус in_stock + флаг is_new; секция переименована в «Новое поступление», бейдж badge--new | 10 карточек в #grid-in-stock, 3 в #grid-preorder, 3 бейджа «Новое поступление» | Легаси-фолбэк status:preorder сохранён в app.js |
| 4 | Описания карточек короткие, с «Товар в Москве» | Заменены дословно на описания источника | Сверка DOM с JSON: 13/13 совпадений | — |
| 5 | Контраст бейджа «Новое поступление» (4,38:1 < 4,5:1) | Цвет текста изменён на --color-primary-hover (#83432c) | Контраст #83432c на #f6e4da ≈ 5,5:1 — проходит AA | — |
| 6 | Артикул BS-011–013 обрезался за край карточки на 320px (два бейджа + ID в строке) | .product-top: добавлен flex-wrap: wrap | Программная проверка: 0 элементов за границами карточек на 320px; скриншот подтверждён | — |
| 7 | «Регулярно привозим новинки» — не подтверждено источником | Убрано слово «Регулярно» | Текст в index.html | — |
| 8 | В assets/README.md неверно указано, что два файла делятся карточками | Исправлено: делится только image-the-max-supply.jpg (BS-011/BS-012) | Сверка с products.json | — |
| 9 | Клавиатурная навигация FAQ не проверялась кликами | Дополнительный тест: focus на summary, Enter — открытие и закрытие | FAQ открывается/закрывается с клавиатуры, видимый фокус-ринк | — |

## Регрессионные проверки (все пройдены)

- JSON валиден; 13 товаров (10 + 3); hidden/sold фильтруются (подмена JSON: 8+3, BS-001/BS-002 скрыты)
- 13 автотекстов Telegram сверены с JSON; 16 ссылок на t.me/beautysupply_ru
- FAQ: 12/12 реальными кликами; состояние ошибки (битый JSON) рендерится
- Якоря: все 4 секции на 76px, не перекрываются sticky-хедером
- Overflow: нет на 320/375/768/1280; пункты меню однострочные
- Консольных ошибок нет; JS-синтаксис валиден
- Полный визуальный осмотр 1280px и 320px (hero, каталог, новинки, FAQ, футер) — чисто

## Git и публикация

- Коммит апгрейда: `506048f` "feat: Russia-wide positioning, real photos, new arrivals section" (+ фикс-коммит), поверх `34e777c`. История не переписывалась.
- Превью задеплоено и проверено в свежем браузере (cssV6, 10+3, фото 13/13, Москва отсутствует).
- Публичный адрес https://beautysupplyru.pplx.app пока показывает редакцию 1 — перепубликация ожидает подтверждения владельца.
