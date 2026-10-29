# Beauty Supply — сайт-каталог

Статический сайт-каталог косметики и ухода из США: товары в наличии в Москве
и предзаказ. Заказы оформляются через Telegram — без корзины, оплаты и backend.

## Каталог

| Раздел | Товаров |
|---|---|
| В наличии (Москва) | 10 |
| Предзаказ | 3 |

Данные каталога: `data/products.json` (единый источник).

## Демо

Превью сайта: [perplexity.ai/computer/a/beauty-supply-katalog-kosmetik](https://www.perplexity.ai/computer/a/beauty-supply-katalog-kosmetik-7VdAZv5cTHmAbXg.RV25Iw)
(превью-хостинг Perplexity Computer; репозиторий — источник кода, GitHub Pages
не используется).

## Локальный запуск

Сайт читает каталог через `fetch`, поэтому открывать `index.html` двойным
щелчком (file://) нельзя. Запустите локальный HTTP-сервер:

```bash
python3 -m http.server 8000
```

и откройте http://localhost:8000

## Настройка

- **Telegram для заказов** — константа `TELEGRAM_URL` в начале `app.js`.
- **Товары** — `data/products.json`; правила обновления — `docs/SITE_SPEC.md`.
- **Фото товаров** — папка `assets/`, инструкция — `assets/README.md`.

## Документация

- `docs/SITE_SPEC.md` — спецификация, схема данных, правила обновления каталога.
- `docs/PROMPT_AUDIT.md` — аудит исходного промпта-брифа.
- `docs/IMPROVED_PROMPT.md` — улучшенный промпт v2.0.

## Ограничения

Без внешних библиотек и CDN. Без корзины, онлайн-оплаты, личного кабинета и
backend. Информация на сайте не является публичной офертой.
