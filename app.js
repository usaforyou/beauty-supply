/* ============================================================
   Beauty Supply — app.js
   Загружает каталог из data/products.json и отрисовывает секции
   «В наличии» и «Предзаказ». Без библиотек и внешних CDN.
   ============================================================ */

// Единственная точка настройки Telegram-канала заказа.
// При смене оператора достаточно изменить эту строку.
const TELEGRAM_URL = 'https://t.me/beautysupply_ru';

(function () {
  'use strict';

  var HIDDEN_STATUSES = ['hidden', 'sold'];

  function formatPrice(value) {
    return value.toLocaleString('ru-RU') + ' ₽';
  }

  function telegramLink(product) {
    var text = product
      ? 'Здравствуйте! Хочу заказать товар ' + product.id + ' — ' + product.title + '.'
      : 'Здравствуйте! Хочу оформить заказ.';
    return (
      TELEGRAM_URL +
      '?text=' +
      encodeURIComponent(text)
    );
  }

  var AMP = String.fromCharCode(38); // &

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, AMP + 'amp;')
      .replace(/</g, AMP + 'lt;')
      .replace(/>/g, AMP + 'gt;')
      .replace(/"/g, AMP + 'quot;')
      .replace(/'/g, AMP + '#39;');
  }

  function renderPhoto(product) {
    if (product.photos && product.photos.length > 0) {
      return (
        '<img class="product-photo" src="' +
        escapeHtml(product.photos[0]) +
        '" alt="Фото товара: ' +
        escapeHtml(product.title) +
        '" loading="lazy" decoding="async">'
      );
    }
    // Заглушка вместо фото: реальные фотографии добавляются в assets/ (см. assets/README.md)
    return (
      '<div class="product-photo" role="img" aria-label="Фото товара: ' +
      escapeHtml(product.title) +
      '">' +
      '<span class="photo-brand">' +
      escapeHtml(product.brand) +
      '</span>' +
      '<span class="photo-hint">Фото по запросу у оператора</span>' +
      '</div>'
    );
  }

  function renderCard(product) {
    var isPreorder = product.status === 'preorder';
    var badge = isPreorder
      ? '<span class="badge badge--preorder">Предзаказ</span>'
      : '<span class="badge badge--in-stock">В наличии</span>';
    var note = '';
    if (isPreorder && product.preorder_note) {
      note =
        '<p class="product-note"><strong>Срок поступления уточняется у оператора.</strong> ' +
        escapeHtml(product.preorder_note) +
        '</p>';
    } else if (product.price_note) {
      note = '<p class="product-note">' + escapeHtml(product.price_note) + '</p>';
    }
    return (
      '<article class="product-card" data-id="' + escapeHtml(product.id) + '">' +
      renderPhoto(product) +
      '<div class="product-body">' +
      '<div class="product-top">' +
      badge +
      '<span class="product-id">' + escapeHtml(product.id) + '</span>' +
      '</div>' +
      '<h3 class="product-title">' + escapeHtml(product.title) + '</h3>' +
      '<p class="product-brand">' + escapeHtml(product.brand) + '</p>' +
      '<p class="product-category">' + escapeHtml(product.category) + '</p>' +
      '<p class="product-description">' + escapeHtml(product.short_description) + '</p>' +
      note +
      '<div class="product-price-row">' +
      '<span class="product-price">' + formatPrice(product.price_rub) + '</span>' +
      '<span class="product-city">' + escapeHtml(product.city) + '</span>' +
      '</div>' +
      '<div class="product-actions">' +
      '<a class="btn btn-primary btn-card" href="' + telegramLink(product) + '" target="_blank" rel="noopener noreferrer">Заказать в Telegram</a>' +
      '</div>' +
      '</div>' +
      '</article>'
    );
  }

  function renderError(grid) {
    grid.innerHTML =
      '<div class="catalog-error">' +
      '<h3>Каталог временно недоступен</h3>' +
      '<p>Не удалось загрузить список товаров. Попробуйте обновить страницу или напишите оператору напрямую.</p>' +
      '<a class="btn btn-primary" href="' + telegramLink(null) + '" target="_blank" rel="noopener noreferrer">Написать в Telegram</a>' +
      '</div>';
  }

  function renderSection(grid, products) {
    if (!products.length) {
      grid.innerHTML =
        '<div class="catalog-error">' +
        '<h3>Товаров пока нет</h3>' +
        '<p>В этом разделе сейчас нет опубликованных товаров. Уточните ассортимент у оператора.</p>' +
        '<a class="btn btn-primary" href="' + telegramLink(null) + '" target="_blank" rel="noopener noreferrer">Написать в Telegram</a>' +
        '</div>';
      return;
    }
    grid.innerHTML = products.map(renderCard).join('');
  }

  function init() {
    var yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }

    // Все статические Telegram-ссылки (шапка, hero, footer) управляются
    // единственной константой TELEGRAM_URL. Атрибут data-telegram в HTML
    // служит маркером; href в разметке — запасной вариант без JS.
    var staticLinks = document.querySelectorAll('a[data-telegram]');
    for (var i = 0; i < staticLinks.length; i++) {
      staticLinks[i].href = telegramLink(null);
    }

    var grids = {
      'in_stock': document.getElementById('grid-in-stock'),
      'preorder': document.getElementById('grid-preorder')
    };

    if (!grids.in_stock || !grids.preorder) {
      return;
    }

    fetch('data/products.json', { cache: 'no-cache' })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        var products = (data && Array.isArray(data.products) ? data.products : [])
          .filter(function (p) {
            return p && HIDDEN_STATUSES.indexOf(p.status) === -1;
          });

        renderSection(grids.in_stock, products.filter(function (p) { return p.status === 'in_stock'; }));
        renderSection(grids.preorder, products.filter(function (p) { return p.status === 'preorder'; }));
      })
      .catch(function () {
        renderError(grids.in_stock);
        renderError(grids.preorder);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
