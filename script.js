/* ============================================================
   ST. CLARE CANDLE AND ALTAR BREAD ENTERPRISE
   script.js — Physics × Biology Interaction Engine

   Copyright © 2026 St. Clare Candle and Altar Bread Enterprise.
   All Rights Reserved. Ijebu-Ode, Ogun State, Nigeria.

   Contact: stclarecandlealtarent8@gmail.com
   Phone  : 09031805281
   ============================================================ */

(function () {
  'use strict';

  const CONFIG = {
    whatsapp: {
      number: '2349031805281',
      prefilled: 'Good day, Sisters of St. Clare. I found your website and I would like to enquire about your candles and altar bread.'
    },
    particles: {
      count: 42,
      maxSize: 3.2,
      minSize: 0.8,
      riseSpeed: 0.35,
      flickerSpeed: 0.0022,
      glowRadius: 26
    }
  };

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const rand = (min, max) => Math.random() * (max - min) + min;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. CANDLE-FLAME PARTICLE CANVAS
     ============================================================ */
  function initFlameCanvas() {
    if (prefersReduced) return;

    let canvas = $('#flameCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'flameCanvas';
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const palette = ['#FFE9B8', '#F4C430', '#E08B2A', '#D2B48C', '#8B5A2B'];
    const particles = Array.from({ length: CONFIG.particles.count }).map(() => spawn(true));

    function spawn(initial = false) {
      return {
        x: rand(0, W),
        y: initial ? rand(0, H) : H + rand(10, 80),
        size: rand(CONFIG.particles.minSize, CONFIG.particles.maxSize),
        speed: rand(0.2, CONFIG.particles.riseSpeed + 0.4),
        drift: rand(-0.15, 0.15),
        flicker: rand(0, Math.PI * 2),
        hue: palette[Math.floor(rand(0, palette.length))],
        alpha: rand(0.35, 0.85)
      };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.flicker += CONFIG.particles.flickerSpeed;
        p.x += p.drift + Math.sin(p.flicker) * 0.35;
        p.y -= p.speed;

        if (p.y < -20 || p.x < -40 || p.x > W + 40) {
          particles[i] = spawn(false);
          continue;
        }

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, CONFIG.particles.glowRadius);
        glow.addColorStop(0, hexToRgba(p.hue, p.alpha));
        glow.addColorStop(1, hexToRgba(p.hue, 0));

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, CONFIG.particles.glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = hexToRgba(p.hue, 0.95);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(draw);
    }
    draw();
  }

  function hexToRgba(hex, a) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  /* ============================================================
     2. TOAST FEEDBACK
     ============================================================ */
  function showToast(message, duration) {
    duration = duration || 2600;
    let t = document.querySelector('.st-clare-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'st-clare-toast';
      document.body.appendChild(t);
    }
    t.textContent = message;
    requestAnimationFrame(function () { t.classList.add('show'); });
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('show'); }, duration);
  }

  /* ============================================================
     3. ORDER-NOW TOAST CONFIRMATION
     ============================================================ */
  function initOrderLinks() {
    $$('.btn-order').forEach(function (el) {
      el.addEventListener('click', function () {
        showToast('Opening WhatsApp to complete your order…');
      });
    });
  }

  /* ============================================================
     3b. BULK QUOTE TOAST CONFIRMATION
     ============================================================ */
  function initBulkQuote() {
    $$('.btn-bulk').forEach(function (el) {
      el.addEventListener('click', function () {
        showToast('Opening WhatsApp for your bulk quote request…', 3200);
      });
    });
  }

  /* ============================================================
     4. SCROLL REVEAL
     ============================================================ */
  function initScrollReveal() {
    const targets = $$('.reveal, section, .card, .product');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window) || prefersReduced) {
      targets.forEach(function (t) { t.classList.add('in'); });
      return;
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(function (t) {
      if (!t.classList.contains('reveal')) t.classList.add('reveal');
      io.observe(t);
    });
  }

  /* ============================================================
     5. MOBILE NAV TOGGLE
     ============================================================ */
  function initNavToggle() {
    const toggle = $('.nav-toggle');
    const links  = $('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
      toggle.setAttribute(
        'aria-expanded',
        toggle.classList.contains('open') ? 'true' : 'false'
      );
    });

    $$('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  /* ============================================================
     6. ACTIVE NAV HIGHLIGHT
     ============================================================ */
  function initActiveNav() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $$('.nav-links a').forEach(function (a) {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* ============================================================
     7. SMOOTH ANCHOR SCROLL
     ============================================================ */
  function initSmoothAnchors() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  }

  /* ============================================================
     8. IMAGE FALLBACK
     ============================================================ */
  function initImageFallback() {
    $$('img').forEach(function (img) {
      img.addEventListener('error', function () {
        const fallback = document.createElement('div');
        fallback.style.cssText =
          'width:' + (img.width || 44) + 'px;' +
          'height:' + (img.height || 44) + 'px;' +
          'border-radius:50%;' +
          'background:conic-gradient(from 0deg,#D2B48C,#F4C430,#8B5A2B,#D2B48C);' +
          'box-shadow:0 0 32px rgba(244,196,48,0.55);';
        img.replaceWith(fallback);
        console.warn('[St. Clare] Image failed to load:', img.src);
      });
    });
  }

  /* ============================================================
     9. HERO LOGO PARALLAX
     ============================================================ */
  function initHeroLogoParallax() {
    if (prefersReduced) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const logo = $('.hero-logo');
    if (!logo) return;

    window.addEventListener('mousemove', function (e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      logo.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(1.02)';
    });
  }

  /* ============================================================
     10. BUTTON RIPPLE COORDINATES
     ============================================================ */
  function initButtonRipple() {
    if (prefersReduced) return;
    $$('.btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--x', ((e.clientX - r.left) / r.width) * 100 + '%');
        btn.style.setProperty('--y', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
      }
     /* ============================================================
     11. GALLERY — Tabs filter (scroll + glow) + Lightbox
     ============================================================ */
  function initGallery() {
    const tabs = $$('.gallery-tab');
    const items = $$('.gallery-item');
    if (!items.length) return;

    const galleryGrid = $('#mainGallery');

    // 11a. Tab filtering + fade + scroll
    if (tabs.length) {
      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          const filter = tab.dataset.filter;

          tabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');

          if (galleryGrid) galleryGrid.classList.add('filtering');

          setTimeout(() => {
            items.forEach((item) => {
              const cat = item.dataset.category || 'all';
              if (filter === 'all' || cat === filter) {
                item.classList.remove('hidden');
              } else {
                item.classList.add('hidden');
              }
            });

            if (galleryGrid) galleryGrid.classList.remove('filtering');

            if (galleryGrid) {
              const y = galleryGrid.getBoundingClientRect().top + window.pageYOffset - 120;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }, 250);
        });
      });
    }

    // 11b. Auto-open tab from URL hash (e.g. Gallery.html#candles)
    const hash = (window.location.hash || '').replace('#', '');
    if (hash && tabs.length) {
      const targetTab = tabs.find((t) => t.dataset.filter === hash);
      if (targetTab) {
        setTimeout(() => targetTab.click(), 200);
      }
    }

    // 11c. Lightbox
    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightboxImg');
    const lightboxCaption = $('#lightboxCaption');
    const btnClose = $('#lightboxClose');
    const btnPrev = $('#lightboxPrev');
    const btnNext = $('#lightboxNext');

    if (!lightbox || !lightboxImg) return;

    let currentIndex = 0;
    let visibleItems = items;

    function updateVisible() {
      visibleItems = items.filter((i) => !i.classList.contains('hidden'));
    }

    function openLightbox(index) {
      updateVisible();
      currentIndex = index;
      const item = visibleItems[currentIndex];
      if (!item) return;
      const img = item.querySelector('img');
      const cap = item.querySelector('figcaption');

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = cap ? cap.textContent : '';
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('show');
      document.body.style.overflow = '';
    }

    function showPrev() {
      updateVisible();
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      openLightbox(currentIndex);
    }

    function showNext() {
      updateVisible();
      currentIndex = (currentIndex + 1) % visibleItems.length;
      openLightbox(currentIndex);
    }

    items.forEach((item) => {
      item.addEventListener('click', () => {
        updateVisible();
        const idx = visibleItems.indexOf(item);
        if (idx >= 0) openLightbox(idx);
      });
    });

    if (btnClose) btnClose.addEventListener('click', closeLightbox);
    if (btnPrev)  btnPrev.addEventListener('click', showPrev);
    if (btnNext)  btnNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('show')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }

  /* ============================================================
     12. WHATSAPP AUTO-LAUNCH (Contact page)
     ============================================================ */
  function initWhatsAppAutoLaunch() {
    const body = document.body;
    if (!body || body.dataset.autoWhatsapp !== 'true') return;

    const num = CONFIG.whatsapp.number;
    const msg = encodeURIComponent(CONFIG.whatsapp.prefilled);
    const url = 'https://wa.me/' + num + '?text=' + msg;

    const overlay = document.createElement('div');
    overlay.className = 'wa-launch-overlay';
    overlay.innerHTML =
      '<div class="wa-launch-inner">' +
        '<div class="wa-halo">' +
          '<img src="logoaltarbread.png" alt="St. Clare logo">' +
        '</div>' +
        '<p class="wa-launch-title">Connecting you to the Sisters…</p>' +
        '<p class="wa-launch-sub">St. Clare Candle and Altar Bread Enterprise</p>' +
        '<div class="wa-bar"><span></span></div>' +
        '<button type="button" class="btn btn-wa btn-sm wa-launch-skip">Open WhatsApp Now</button>' +
      '</div>';
    document.body.appendChild(overlay);

    const style = document.createElement('style');
    style.textContent =
      '.wa-launch-overlay{position:fixed;inset:0;background:rgba(255,255,255,0.96);backdrop-filter:blur(20px);z-index:9999;display:grid;place-items:center;opacity:0;pointer-events:none;transition:opacity 0.5s cubic-bezier(0.16,1,0.3,1);}' +
      '.wa-launch-overlay.show{opacity:1;pointer-events:auto;}' +
      '.wa-launch-inner{text-align:center;padding:24px;}' +
      '.wa-halo{width:120px;height:120px;margin:0 auto 22px;border-radius:50%;padding:4px;background:conic-gradient(from 0deg,#D2B48C,#F4C430,#8B5A2B,#D2B48C);animation:synapse-spin 4s linear infinite;box-shadow:0 0 60px rgba(244,196,48,0.55);}' +
      '.wa-halo img{width:100%;height:100%;border-radius:50%;object-fit:contain;background:#fff;padding:6px;}' +
      '.wa-launch-title{font-family:Georgia,serif;font-size:1.25rem;color:#3E2412;margin-bottom:6px;letter-spacing:0.4px;}' +
      '.wa-launch-sub{font-family:Courier New,monospace;font-size:0.78rem;color:#8B5A2B;letter-spacing:2.6px;text-transform:uppercase;margin-bottom:22px;}' +
      '.wa-bar{width:220px;height:4px;margin:0 auto 24px;background:rgba(210,180,140,0.35);border-radius:4px;overflow:hidden;}' +
      '.wa-bar span{display:block;height:100%;width:0%;background:linear-gradient(90deg,#8B5A2B,#F4C430);animation:wa-bar-fill 3s linear forwards;}' +
      '@keyframes wa-bar-fill{to{width:100%;}}' +
      '@keyframes synapse-spin{to{transform:rotate(360deg);}}';
    document.head.appendChild(style);

    requestAnimationFrame(function () { overlay.classList.add('show'); });

    let launched = false;
    function launch() {
      if (launched) return;
      launched = true;
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(function () { overlay.classList.remove('show'); }, 400);
    }

    overlay.querySelector('.wa-launch-skip').addEventListener('click', launch);
    setTimeout(launch, 3000);
  }

  /* ============================================================
     13. CONSOLE SIGNATURE
     ============================================================ */
  function signConsole() {
    const style1 = 'color:#8B5A2B;font-size:14px;font-weight:bold;';
    const style2 = 'color:#3E2412;font-size:12px;';
    const style3 = 'color:#F4C430;font-style:italic;';
    console.log('%c🕯️ St. Clare Candle and Altar Bread Enterprise', style1);
    console.log('%c© 2026 All Rights Reserved. Ijebu-Ode, Ogun State, Nigeria.', style2);
    console.log('%c"Lumen Christi — Light for the Altar, Bread for the Soul."', style3);
  }

  /* ============================================================
     BOOTSTRAP
     ============================================================ */
  function boot() {
    initFlameCanvas();
    initOrderLinks();
    initBulkQuote();
    initScrollReveal();
    initNavToggle();
    initActiveNav();
    initSmoothAnchors();
    initImageFallback();
    initHeroLogoParallax();
    initButtonRipple();
    initGallery();
    initWhatsAppAutoLaunch();
    signConsole();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
