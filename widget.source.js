/* SubsWidget — Floating TG Button
 * Self-contained embeddable widget for Tilda
 * Icons embedded as base64 data URIs via build script
 */
(function () {
  'use strict';

  /* ── CONFIG ──────────────────────────────────────────── */
  var CONFIG = {
    tgLink: 'https://t.me/rusaubot?start=site',
    icon1: 'ICON1_PLACEHOLDER',
    icon2: 'ICON2_PLACEHOLDER',
    icon3: 'ICON3_PLACEHOLDER',
  };

  /* ── GSAP LOADER ─────────────────────────────────────── */
  function loadGSAP(cb) {
    if (window.gsap) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  /* ── CSS ─────────────────────────────────────────────── */
  var CSS = `
  #subs-widget-root {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 999999;
    display: flex;
    align-items: center;
    gap: 12px;
    pointer-events: none;
  }

  /* ---- badge ---- */
  #subs-badge {
    pointer-events: auto;
    display: flex;
    align-items: center;
    padding: 10px 18px;
    border-radius: 24px;
    background: linear-gradient(135deg, #2AABEE 0%, #7B2FF7 100%);
    box-shadow: 0 8px 28px rgba(123,47,247,0.45);
    cursor: pointer;
    opacity: 0;
    transform: translateX(16px);
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
  }
  #subs-badge span {
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.01em;
    pointer-events: none;
  }

  /* ---- button ---- */
  #subs-btn {
    pointer-events: auto;
    position: relative;
    width: 62px;
    height: 62px;
    border-radius: 50%;
    background: #2AABEE;
    box-shadow: 0 4px 20px rgba(42,171,238,0.55);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    user-select: none;
    -webkit-user-select: none;
    overflow: visible;
  }

  /* pulse ring */
  #subs-btn::before {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 2px solid rgba(42,171,238,0.35);
    animation: subs-pulse 2.4s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes subs-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%       { transform: scale(1.18); opacity: 0; }
  }

  /* icon wrapper */
  .subs-icon-wrap {
    position: absolute;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .subs-icon-wrap img {
    width: 30px;
    height: 30px;
    object-fit: contain;
  }
  .subs-icon-wrap svg { display: block; }
  #subs-icon-gift { opacity: 1; }
  #subs-icon-tg   { opacity: 0; }

  /* ---- overlay ---- */
  #subs-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.52);
    z-index: 999998;
    display: none;
    opacity: 0;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  /* ---- popup ---- */
  #subs-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.85);
    z-index: 999999;
    background: #fff;
    border-radius: 20px;
    width: min(420px, 92vw);
    box-shadow: 0 20px 60px rgba(0,0,0,0.22);
    opacity: 0;
    display: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    overflow: hidden;
  }

  /* popup header */
  #subs-popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 24px 18px;
  }
  #subs-popup-title {
    font-size: 22px;
    font-weight: 800;
    color: #1A1A2E;
    letter-spacing: -0.03em;
    line-height: 1.15;
    margin: 0;
  }
  #subs-close-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #F3F4F6;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 0;
    transition: background 0.18s;
  }
  #subs-close-btn:hover { background: #E5E7EB; }
  #subs-close-btn svg { pointer-events: none; }

  .subs-divider {
    height: 1px;
    background: #E5E7EB;
    margin: 0;
  }

  /* items */
  #subs-items {
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .subs-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 13px 0;
  }
  .subs-item + .subs-item {
    border-top: 1px solid #F3F4F6;
  }
  .subs-item-icon {
    width: 50px;
    height: 50px;
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
  }
  .subs-item-icon img {
    width: 38px;
    height: 38px;
    object-fit: contain;
  }
  .subs-item-text { flex: 1; min-width: 0; padding-top: 3px; }
  .subs-item-title {
    font-size: 15px;
    font-weight: 700;
    color: #1A1A2E;
    line-height: 1.3;
    margin: 0 0 3px;
  }
  .subs-item-desc {
    font-size: 13px;
    color: #6B7280;
    line-height: 1.5;
    margin: 0;
  }

  /* CTA */
  #subs-cta-section {
    padding: 16px 24px 24px;
  }
  #subs-cta-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 52px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 15px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.01em;
    background-size: 200% 100%;
    background-position: 0% 50%;
    background-image: linear-gradient(90deg, #2AABEE 0%, #7B2FF7 50%, #2AABEE 100%);
    box-shadow: 0 4px 20px rgba(42,171,238,0.4);
    transition: transform 0.15s, box-shadow 0.15s;
    animation: subs-shimmer 3s linear infinite;
    text-decoration: none;
  }
  #subs-cta-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(42,171,238,0.55);
  }
  @keyframes subs-shimmer {
    0%   { background-position: 100% 50%; }
    100% { background-position: -100% 50%; }
  }
  #subs-cta-note {
    text-align: center;
    font-size: 12px;
    color: #9CA3AF;
    margin: 10px 0 0;
  }

  /* mobile */
  @media (max-width: 480px) {
    #subs-widget-root { bottom: 20px; right: 16px; }
    #subs-popup { width: 92vw; }
    #subs-popup-title { font-size: 19px; }
  }
  `;

  /* ── HTML ──────────────────────────────────────────────── */
  /* Inline gift SVG (button idle state) */
  var GIFT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="20 12 20 22 4 22 4 12"/>' +
    '<rect x="2" y="7" width="20" height="5"/>' +
    '<line x1="12" y1="22" x2="12" y2="7"/>' +
    '<path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>' +
    '<path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>' +
    '</svg>';

  function buildHTML() {
    var giftIcon = GIFT_SVG;
    var tgSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 240 240">' +
      '<defs><linearGradient id="subs-tg-grad" x1="120" y1="240" x2="120" y2="0" gradientUnits="userSpaceOnUse">' +
      '<stop stop-color="#1D93D2"/><stop offset="1" stop-color="#38B0E3"/></linearGradient></defs>' +
      '<circle cx="120" cy="120" r="120" fill="url(#subs-tg-grad)"/>' +
      '<path d="m98 175-3-42 84-75c4-3 0-5-4-2l-104 66-44-14c-10-3-10-9 2-13l161-62c8-3 16 2 13 14l-27 127c-2 9-8 11-15 7l-44-32-21 20c-2 2-5 3-8 3z" fill="#fff"/>' +
      '</svg>';

    return (
      '<div id="subs-widget-root">' +
        '<div id="subs-badge" role="button" tabindex="0" aria-label="Открыть QA Starter Pack">' +
          '<span>Забери QA Starter Pack</span>' +
        '</div>' +
        '<div id="subs-btn" role="button" tabindex="0" aria-label="QA Starter Pack">' +
          '<div class="subs-icon-wrap" id="subs-icon-gift">' + giftIcon + '</div>' +
          '<div class="subs-icon-wrap" id="subs-icon-tg">' + tgSVG + '</div>' +
        '</div>' +
      '</div>' +

      '<div id="subs-overlay" aria-hidden="true"></div>' +

      '<div id="subs-popup" role="dialog" aria-modal="true" aria-labelledby="subs-popup-title">' +
        '<div id="subs-popup-header">' +
          '<h2 id="subs-popup-title">QA Starter Pack</h2>' +
          '<button id="subs-close-btn" aria-label="Закрыть">' +
            '<svg width="14" height="14" viewBox="0 0 14 14" fill="none">' +
              '<path d="M1 1l12 12M13 1L1 13" stroke="#374151" stroke-width="2" stroke-linecap="round"/>' +
            '</svg>' +
          '</button>' +
        '</div>' +
        '<div class="subs-divider"></div>' +
        '<div id="subs-items">' +
          buildItem('#EFF6FF', CONFIG.icon1, 'Честный Roadmap', 'Пошаговый алгоритм, чтобы не тратить время на лишнее.') +
          buildItem('#F0FDF4', CONFIG.icon2, 'QA Шпаргалки', 'Теория тестирования, тестирование API, запросы SQL и т.д.') +
          buildItem('#FFF7ED', CONFIG.icon3, 'QA Тренажёры', 'Доступ к симуляторам реальных задач.') +
        '</div>' +
        '<div class="subs-divider"></div>' +
        '<div id="subs-cta-section">' +
          '<a id="subs-cta-btn" href="' + CONFIG.tgLink + '" target="_blank" rel="noopener noreferrer">Получить QA Starter Pack</a>' +
          '<p id="subs-cta-note">За подписку на TG-канал</p>' +
        '</div>' +
      '</div>'
    );
  }

  function buildItem(bg, iconSrc, title, desc) {
    return (
      '<div class="subs-item">' +
        '<div class="subs-item-icon" style="background:' + bg + '">' +
          '<img src="' + iconSrc + '" alt="" aria-hidden="true"/>' +
        '</div>' +
        '<div class="subs-item-text">' +
          '<p class="subs-item-title">' + title + '</p>' +
          '<p class="subs-item-desc">' + desc + '</p>' +
        '</div>' +
      '</div>'
    );
  }

  /* ── ANIMATIONS ─────────────────────────────────────────── */
  function initAnimations() {
    var gsap = window.gsap;
    var btn      = document.getElementById('subs-btn');
    var badge    = document.getElementById('subs-badge');
    var overlay  = document.getElementById('subs-overlay');
    var popup    = document.getElementById('subs-popup');
    var closeBtn = document.getElementById('subs-close-btn');
    var iconGift = document.getElementById('subs-icon-gift');
    var iconTg   = document.getElementById('subs-icon-tg');
    var ctaBtn   = document.getElementById('subs-cta-btn');

    /* ── IDLE: icon swap + micro-bounce ── */
    var idleTl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
    idleTl
      .to(btn, { y: -5, duration: 0.35, ease: 'power2.out', yoyo: true, repeat: 3 }, 0)
      .to(btn, { scale: 1.06, duration: 0.15, ease: 'power2.out', yoyo: true, repeat: 1 }, 0.7)
      .to(iconGift, { opacity: 0, scale: 0.6, duration: 0.22, ease: 'power2.in' }, 2.5)
      .to(iconTg,   { opacity: 1, scale: 1,   duration: 0.28, ease: 'back.out(1.5)' }, 2.75)
      .to(iconTg,   { opacity: 0, scale: 0.6, duration: 0.22, ease: 'power2.in' }, 4.8)
      .to(iconGift, { opacity: 1, scale: 1,   duration: 0.28, ease: 'back.out(1.5)' }, 5.05);

    /* ── HOVER badge (desktop only) ── */
    var isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (!isMobile) {
      btn.addEventListener('mouseenter', function () {
        gsap.to(badge, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(badge, { opacity: 0, x: 16, duration: 0.22, ease: 'power2.in' });
      });
      badge.addEventListener('mouseenter', function () {
        gsap.to(badge, { opacity: 1, x: 0, duration: 0.1 });
      });
      badge.addEventListener('mouseleave', function () {
        gsap.to(badge, { opacity: 0, x: 16, duration: 0.22, ease: 'power2.in' });
      });
    }

    /* ── OPEN popup ── */
    function openPopup() {
      idleTl.pause();
      overlay.style.display = 'block';
      popup.style.display   = 'block';

      var tl = gsap.timeline();
      tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
        .fromTo(popup,
          { opacity: 0, scale: 0.82, y: 18 },
          { opacity: 1, scale: 1,    y: 0,  duration: 0.42, ease: 'back.out(1.7)' },
          '-=0.1'
        );

      /* stagger items */
      gsap.fromTo(
        '.subs-item',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.08, delay: 0.3 }
      );
    }

    /* ── CLOSE popup ── */
    function closePopup() {
      var tl = gsap.timeline({ onComplete: function () {
        overlay.style.display = 'none';
        popup.style.display   = 'none';
        idleTl.resume();
      }});
      tl.to(popup,   { opacity: 0, scale: 0.88, y: 10, duration: 0.25, ease: 'power2.in' })
        .to(overlay, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.1');
    }

    /* ── EVENT LISTENERS ── */
    btn.addEventListener('click', openPopup);
    badge.addEventListener('click', openPopup);
    closeBtn.addEventListener('click', function (e) { e.stopPropagation(); closePopup(); });
    overlay.addEventListener('click', closePopup);

    /* keyboard */
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPopup(); }
    });
    badge.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPopup(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closePopup(); }
    });

    /* prevent popup close when clicking inside */
    popup.addEventListener('click', function (e) { e.stopPropagation(); });

    /* CTA click closes popup after small delay */
    ctaBtn.addEventListener('click', function () {
      setTimeout(closePopup, 300);
    });

    /* ── initial entrance ── */
    gsap.fromTo(
      '#subs-widget-root',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)', delay: 0.8 }
    );
  }

  /* ── INIT ──────────────────────────────────────────────── */
  function init() {
    /* inject styles */
    var style = document.createElement('style');
    style.id  = 'subs-widget-styles';
    style.textContent = CSS;
    document.head.appendChild(style);

    /* inject html */
    var tmp = document.createElement('div');
    tmp.innerHTML = buildHTML();
    while (tmp.firstChild) { document.body.appendChild(tmp.firstChild); }

    /* load GSAP then animate */
    loadGSAP(initAnimations);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
