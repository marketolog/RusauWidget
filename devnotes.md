# Project DevNotes

## Technical Log & Architectural Decisions

---

## SubsWidget — Floating TG Button

**Дата:** 2026-03-12  
**Статус:** ✅ Реализован и протестирован локально

---

### Обзор

Встраиваемый JS-виджет для сайтов на Tilda. Одиночный `<script src="widget.js"></script>` тег в `<body>` добавляет анимированную плавающую кнопку с popup-окном QA Starter Pack.

---

### Файловая структура

```
SubsWidget/
├── widget.source.js   # Исходник с placeholder'ами для SVG
├── widget.js          # Финальный билд (346 KB, вставлять на сайт)
├── build.py           # Скрипт сборки: конвертирует SVG → base64 data URI
├── test.html          # Тестовая страница для локальной разработки
└── img/
    ├── icon1.svg      # Roadmap icon (~86 KB)
    ├── icon2.svg      # Шпаргалки icon (~110 KB)
    └── icon3.svg      # Тренажёры icon (~57 KB)
```

---

### Ключевые архитектурные решения

#### 1. IIFE Pattern
Весь код обёрнут в `(function(){ 'use strict'; ... })()` для предотвращения загрязнения глобального скоупа. Критично для Tilda, где может быть конфликт переменных с другими виджетами.

#### 2. Стратегия встраивания SVG-иконок
**Проблема:** иконки popup крупные (~253 KB суммарно), прямая конкатенация строк в JS нечитаема и ненадёжна.  
**Решение:** двухэтапная сборка:
- `widget.source.js` содержит плейсхолдеры `'ICON1_PLACEHOLDER'`, `'ICON2_PLACEHOLDER'`, `'ICON3_PLACEHOLDER'`
- `build.py` конвертирует SVG в base64 data URI и подставляет в плейсхолдеры
- Результат — `widget.js` (самодостаточный, без внешних зависимостей по иконкам)

Иконка подарка на кнопке — упрощённый inline SVG (~500 байт), хардкодирован в `GIFT_SVG`.

#### 3. GSAP загрузка
GSAP 3 загружается динамически с CDN `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`. Виджет ждёт `DOMContentLoaded` и загрузки GSAP перед инициализацией анимаций.

#### 4. Мобильная адаптация
- Hover-плашка "Забери QA Starter Pack" не показывается на touchscreen (`window.matchMedia('(hover: none)')`)
- Popup на мобильных занимает `90vw`, на десктопе фиксированная ширина `360px`
- `viewport` meta тег в `test.html` обеспечивает корректный рендер на мобильных

#### 5. Цветовая схема
Telegram brand:
- Основной: `#2AABEE` (Telegram Blue)
- Градиент кнопки: `linear-gradient(135deg, #2AABEE 0%, #229ED9 50%, #6B73FF 100%)`
- Hover-плашка: `linear-gradient(135deg, rgba(42,171,238,0.95), rgba(107,115,255,0.95))`
- Shimmer анимация CTA кнопки: `background-size: 200%` + keyframe движение

#### 6. Анимации GSAP

| Состояние | Анимация |
|-----------|----------|
| Появление кнопки | `from: {scale: 0, opacity: 0}` → 0.6s bounce |
| Idle pulse ring | бесконечный `scale: 1.6, opacity: 0` loop, 2s |
| Смена иконки gift↔tg | `yoyo: true`, 3s интервал, crossfade opacity |
| Hover badge | `x: 10→0, opacity: 0→1`, 0.35s ease.out |
| Popup открытие | overlay `opacity 0→1`, popup `scale 0.85→1, y: 20→0`, 0.4s |
| Popup закрытие | обратная анимация, 0.3s, затем `display: none` |

---

### Сборка

```bash
cd /Users/olegkobyzev/Documents/SubsWidget
python3 build.py
# ✓ widget.js built successfully — 346.5 KB
```

### Локальное тестирование

```bash
cd /Users/olegkobyzev/Documents/SubsWidget
python3 -m http.server 8765
# Открыть: http://localhost:8765/test.html
```

---

### Деплой на Tilda

Добавить в `<body>` сайта Tilda через настройки → Ещё → HTML-код в body:

```html
<script src="https://YOUR_CDN/widget.js"></script>
```

Или использовать Tilda Zero Block для вставки JS-кода.

---

### Результаты тестирования (2026-03-12)

| Тест | Результат |
|------|-----------|
| Кнопка появляется в правом нижнем углу | ✅ |
| Pulse-анимация кнопки | ✅ |
| Hover-плашка "Забери QA Starter Pack" | ✅ |
| Смена иконки Gift → TG | ✅ |
| Popup открывается по клику | ✅ |
| SVG иконки в popup (icon1/2/3) | ✅ |
| CTA кнопка shimmer-эффект | ✅ |
| Закрытие popup через X кнопку | ✅ |
| Backdrop blur при открытом popup | ✅ |

---

### Риски и ограничения

- **Размер файла:** `widget.js` весит ~346 KB из-за base64 SVG-иконок. Если иконки облегчить, можно снизить до ~50 KB.
- **GSAP CDN зависимость:** при блокировке CDN анимации не отработают. Fallback — показ без анимаций (UI доступен).
- **Tilda конфликты:** тестировалось только на чистом HTML. На реальной Tilda-странице возможны z-index конфликты с элементами Tilda (рекомендовано `z-index: 9999`).
