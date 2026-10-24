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
      prefilled: 'Good day, Sisters of St. Clare Monastery Nigeria. I found your website and I would like to enquire about your candles and altar bread.'
    },
    particles: { count: 42, maxSize: 3.2, minSize: 0.8, riseSpeed: 0.35, flickerSpeed: 0.0022, glowRadius: 26 }
  };

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const rand = (min, max) => Math.random() * (max - min) + min;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* CANDLE-FLAME PARTICLE CANVAS */
  function initFlameCanvas() {
    if (prefersReduced) return;
    let canvas = $('#flameCanvas');
    if (!canvas) { canvas = document.createElement('canvas'); canvas.id = 'flameCanvas'; document.body.appendChild(canvas); }
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() { W = window.innerWidth; H = window.innerHeight; canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    resize();
    window.addEventListener('resize', resize);
    const palette = ['#FFE9B8', '#F4C430', '#E08B2A', '#D2B48C', '#8B5A2B'];
    const particles = Array.from({ length: CONFIG.particles.count }).map(() => spawn(true));
    function spawn(initial = false) { return { x: rand(0, W), y: initial ? rand(0, H) : H + rand(10, 80), size: rand(CONFIG.particles.minSize, CONFIG.particles.maxSize), speed: rand(0.2, CONFIG.particles.riseSpeed + 0.4), drift: rand(-0.15, 0.15), flicker: rand(0, Math.PI * 2), hue: palette[Math.floor(rand(0, palette.length))], alpha: rand(0.35, 0.85) }; }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.flicker += CONFIG.particles.flickerSpeed; p.x += p.drift + Math.sin(p.flicker) * 0.35; p.y -= p.speed;
        if (p.y < -20 || p.x < -40 || p.x > W + 40) { particles[i] = spawn(false); continue; }
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, CONFIG.particles.glowRadius);
        glow.addColorStop(0, hexToRgba(p.hue, p.alpha)); glow.addColorStop(1, hexToRgba(p.hue, 0));
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(p.x, p.y, CONFIG.particles.glowRadius, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = hexToRgba(p.hue, 0.95); ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(draw);
    }
    draw();
  }

  function hexToRgba(hex, a) { const h = hex.replace('#', ''); const r = parseInt(h.substring(0,2),16); const g = parseInt(h.substring(2,4),16); const b = parseInt(h.substring(4,6),16); return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; }

  /* TOAST */
  function showToast(message, duration) {
    duration = duration || 2600;
    let t = document.querySelector('.st-clare-toast');
    if (!t) { t = document.createElement('div'); t.className = 'st-clare-toast'; document.body.appendChild(t); }
    t.textContent = message;
    requestAnimationFrame(function () { t.classList.add('show'); });
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('show'); }, duration);
  }

  function initOrderLinks() { $$('.btn-order').forEach(function (el) { el.addEventListener('click', function () { showToast('Opening WhatsApp to complete your order…'); }); }); }
  function initBulkQuote() { $$('.btn-bulk').forEach(function (el) { el.addEventListener('click', function () { showToast('Opening WhatsApp for your bulk quote request…', 3200); }); }); }

  /* SCROLL REVEAL */
  function initScrollReveal() {
    const targets = $$('.reveal, section, .card, .product');
    if (!targets.length) return;
    if (!('IntersectionObserver' in window) || prefersReduced) { targets.forEach(function (t) { t.classList.add('in'); }); return; }
    const io = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(function (t) { if (!t.classList.contains('reveal')) t.classList.add('reveal'); io.observe(t); });
  }

  /* NAV TOGGLE */
  function initNavToggle() {
    const toggle = $('.nav-toggle'); const links = $('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () { toggle.classList.toggle('open'); links.classList.toggle('open'); toggle.setAttribute('aria-expanded', toggle.classList.contains('open') ? 'true' : 'false'); });
    $$('.nav-links a').forEach(function (a) { a.addEventListener('click', function () { toggle.classList.remove('open'); links.classList.remove('open'); }); });
  }

  /* ACTIVE NAV */
  function initActiveNav() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $$('.nav-links a').forEach(function (a) { const href = (a.getAttribute('href') || '').toLowerCase(); if (href === path || (path === '' && href === 'index.html')) a.classList.add('active'); });
  }

  /* SMOOTH ANCHORS */
  function initSmoothAnchors() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const id = a.getAttribute('href'); if (!id || id === '#') return;
        const target = document.querySelector(id); if (!target) return;
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  }

  /* IMAGE FALLBACK */
  function initImageFallback() {
    $$('img').forEach(function (img) {
      img.addEventListener('error', function () {
        const fallback = document.createElement('div');
        fallback.style.cssText = 'width:' + (img.width || 44) + 'px;height:' + (img.height || 44) + 'px;border-radius:50%;background:conic-gradient(from 0deg,#D2B48C,#F4C430,#8B5A2B,#D2B48C);box-shadow:0 0 32px rgba(244,196,48,0.55);';
        img.replaceWith(fallback);
        console.warn('[St. Clare] Image failed to load:', img.src);
      });
    });
  }

  /* HERO LOGO PARALLAX */
  function initHeroLogoParallax() {
    if (prefersReduced) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const logo = $('.hero-logo'); if (!logo) return;
    window.addEventListener('mousemove', function (e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      logo.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(1.02)';
    });
  }

  /* BUTTON RIPPLE */
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
     /* GALLERY — Tabs + Advent + Paschal + Lightbox */
  function initGallery() {
    const tabs = $$('.gallery-tab');
    const items = $$('.gallery-item');
    const galleryGrid = $('#mainGallery');
    const adventPanel = $('#adventPanel');
    const paschalPanel = $('#paschalPanel');
    if (!items.length) return;

    if (tabs.length) {
      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          const filter = tab.dataset.filter;
          tabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          if (adventPanel) { if (filter === 'advent') adventPanel.classList.add('show'); else adventPanel.classList.remove('show'); }
          if (paschalPanel) { if (filter === 'paschal') paschalPanel.classList.add('show'); else paschalPanel.classList.remove('show'); }
          if (galleryGrid) galleryGrid.classList.add('filtering');
          setTimeout(() => {
            items.forEach((item) => {
              const cat = item.dataset.category || 'all';
              if (filter === 'all' || cat === filter) item.classList.remove('hidden');
              else item.classList.add('hidden');
            });
            if (galleryGrid) galleryGrid.classList.remove('filtering');
            let target = galleryGrid;
            if (adventPanel && adventPanel.classList.contains('show')) target = adventPanel;
            if (paschalPanel && paschalPanel.classList.contains('show')) target = paschalPanel;
            if (target) { const y = target.getBoundingClientRect().top + window.pageYOffset - 120; window.scrollTo({ top: y, behavior: 'smooth' }); }
          }, 250);
        });
      });
    }

    const hash = (window.location.hash || '').replace('#', '');
    if (hash && tabs.length) { const targetTab = tabs.find((t) => t.dataset.filter === hash); if (targetTab) setTimeout(() => targetTab.click(), 200); }
    else { items.forEach((item) => { if (item.dataset.category === 'advent' || item.dataset.category === 'paschal') item.classList.add('hidden'); }); }

    updateLiturgicalWeek();

    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightboxImg');
    const lightboxCaption = $('#lightboxCaption');
    const btnClose = $('#lightboxClose');
    const btnPrev = $('#lightboxPrev');
    const btnNext = $('#lightboxNext');
    if (!lightbox || !lightboxImg) return;

    let currentIndex = 0;
    let visibleItems = items;
    function updateVisible() { visibleItems = items.filter((i) => !i.classList.contains('hidden')); }
    function openLightbox(index) {
      updateVisible(); currentIndex = index;
      const item = visibleItems[currentIndex]; if (!item) return;
      const img = item.querySelector('img'); const cap = item.querySelector('figcaption');
      lightboxImg.src = img.src; lightboxImg.alt = img.alt;
      lightboxCaption.textContent = cap ? cap.textContent : '';
      lightbox.classList.add('show'); document.body.style.overflow = 'hidden';
    }
    function closeLightbox() { lightbox.classList.remove('show'); document.body.style.overflow = ''; }
    function showPrev() { updateVisible(); currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; openLightbox(currentIndex); }
    function showNext() { updateVisible(); currentIndex = (currentIndex + 1) % visibleItems.length; openLightbox(currentIndex); }

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
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('show')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }

  /* LIGHTBOX-ONLY — for pages without tabs (e.g., Profession.html) */
  function initLightboxOnly() {
    const items = $$('.gallery-item');
    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightboxImg');
    const lightboxCaption = $('#lightboxCaption');
    const btnClose = $('#lightboxClose');

    if (!items.length || !lightbox || !lightboxImg) return;
    if ($$('.gallery-tab').length > 0) return;

    items.forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const cap = item.querySelector('figcaption');
        if (!img) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
        lightboxCaption.textContent = cap ? cap.textContent : '';
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('show');
      document.body.style.overflow = '';
    }

    if (btnClose) btnClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('show')) {
        closeLightbox();
      }
    });
  }

  /* LITURGICAL WEEK COUNTER */
  function updateLiturgicalWeek() {
    const weekEl = document.getElementById('weekNumber');
    if (!weekEl) return;
    const anchorDate = new Date('2026-09-27T00:00:00');
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor((today - anchorDate) / msPerDay);
    const weeksSince = Math.floor(diffDays / 7);
    let currentWeek = 26 + weeksSince;
    if (currentWeek > 34) currentWeek = ((currentWeek - 34 - 1) % 34) + 1;
    if (currentWeek < 1) currentWeek = 1;
    weekEl.textContent = currentWeek + getOrdinalSuffix(currentWeek);
  }

  function getOrdinalSuffix(n) { const s = ['th','st','nd','rd']; const v = n % 100; return s[(v - 20) % 10] || s[v] || s[0]; }

  /* WHATSAPP AUTO-LAUNCH */
  function initWhatsAppAutoLaunch() {
    const body = document.body;
    if (!body || body.dataset.autoWhatsapp !== 'true') return;
    const num = CONFIG.whatsapp.number;
    const msg = encodeURIComponent(CONFIG.whatsapp.prefilled);
    const url = 'https://wa.me/' + num + '?text=' + msg;
    const overlay = document.createElement('div');
    overlay.className = 'wa-launch-overlay';
    overlay.innerHTML =
      '<div class="wa-launch-inner"><div class="wa-halo"><img src="logoaltarbread.png" alt="St. Clare Monastery Nigeria logo"></div>' +
      '<p class="wa-launch-title">Connecting you to the Sisters…</p>' +
      '<p class="wa-launch-sub">St. Clare Monastery Nigeria</p>' +
      '<div class="wa-bar"><span></span></div>' +
      '<button type="button" class="btn btn-wa btn-sm wa-launch-skip">Open WhatsApp Now</button></div>';
    document.body.appendChild(overlay);
    const style = document.createElement('style');
    style.textContent =
      '.wa-launch-overlay{position:fixed;inset:0;background:rgba(255,255,255,0.96);backdrop-filter:blur(20px);z-index:9999;display:grid;place-items:center;opacity:0;pointer-events:none;transition:opacity 0.5s cubic-bezier(0.16,1,0.3,1);}' +
      '.wa-launch-overlay.show{opacity:1;pointer-events:auto;}' +
      '.wa-launch-inner{text-align:center;padding:24px;}' +
      '.wa-halo{width:120px;height:120px;margin:0 auto 22px;border-radius:50%;padding:4px;background:conic-gradient(from 0deg,#D2B48C,#F4C430,#8B5A2B,#D2B48C);animation:synapse-spin 4s linear infinite;box-shadow:0 0 60px rgba(244,196,48,0.55);}' +
      '.wa-halo img{width:100%;height:100%;border-radius:50%;object-fit:contain;background:#fff;padding:6px;}' +
      '.wa-launch-title{font-family:Georgia,serif;font-size:1.25rem;color:#3E2412;margin-bottom:6px;}' +
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

  /* PROFESSION BANNER — Auto-updates for Sister Maria Hope (Simple) and Sister Agatha (Solemn) */
  function initProfessionBanner() {
    const banner = document.getElementById('professionBanner');
    if (!banner) return;
    const messageEl = document.getElementById('professionMessage');
    const readMoreEl = document.getElementById('professionReadMore');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Simple Profession — Sister Maria Hope Ehizojie — 24 October 2026
    const simpleProfession = new Date('2026-10-24T10:00:00');
    simpleProfession.setHours(0, 0, 0, 0);

    // Solemn Profession — Sister Agatha — 27 February 2027
    const solemnProfession = new Date('2027-02-27T10:00:00');
    solemnProfession.setHours(0, 0, 0, 0);

    const msPerDay = 24 * 60 * 60 * 1000;

    /* --- SIMPLE PROFESSION DAY (24 October 2026) --- */
    if (today.getTime() === simpleProfession.getTime()) {
      banner.classList.add('celebration');
      if (messageEl) messageEl.innerHTML = '🌸 Today is the Day! 🌸 Simple Profession of Sister Maria Hope Ehizojie · St. Clare Monastery Nigeria · 10:00 AM · Let us rejoice and give thanks to God!';
      if (readMoreEl) { readMoreEl.style.display = 'inline-block'; readMoreEl.textContent = '🌸 See Photos'; }
      createFlowerPetals();
      return;
    }

    /* --- SOLEMN PROFESSION DAY (27 February 2027) --- */
    if (today.getTime() === solemnProfession.getTime()) {
      banner.classList.add('celebration');
      if (messageEl) messageEl.innerHTML = '🌸 Today is the Day! 🌸 Solemn Profession of Sister Agatha · St. Clare Monastery Nigeria · 10:00 AM · Let us rejoice and give thanks to God!';
      if (readMoreEl) { readMoreEl.style.display = 'inline-block'; readMoreEl.textContent = '🌸 See Photos'; }
      createFlowerPetals();
      return;
    }

    /* --- AFTER SIMPLE, BEFORE SOLEMN --- */
    if (today > simpleProfession && today < solemnProfession) {
      const daysSinceSimple = Math.floor((today - simpleProfession) / msPerDay);
      const daysUntilSolemn = Math.ceil((solemnProfession - today) / msPerDay);

      if (messageEl) {
        if (daysSinceSimple <= 30) {
          // Within a month after Sister Maria Hope's profession
          messageEl.innerHTML = '<strong>Congratulations to Sister Maria Hope Ehizojie</strong>, now professed at St. Clare Monastery Nigeria · <strong>' + daysUntilSolemn + ' days</strong> until the Solemn Profession of Sister Agatha · 27 February 2027';
        } else if (daysUntilSolemn <= 30) {
          // Final month before Sister Agatha's Solemn Profession
          messageEl.innerHTML = '<strong>' + daysUntilSolemn + ' days</strong> until the Solemn Profession of Sister Agatha · 27 February 2027 · Please remember her in your prayers.';
        } else if (daysUntilSolemn <= 90) {
          // Preparing for Solemn Profession
          messageEl.innerHTML = '<strong>Solemn Profession of Sister Agatha</strong> · 27 February 2027 · <strong>' + daysUntilSolemn + ' days</strong> to go. Please pray for her.';
        } else {
          // Far out
          messageEl.innerHTML = 'Next: <strong>Solemn Profession of Sister Agatha</strong> · 27 February 2027 · Please pray for her preparation.';
        }
      }

      if (readMoreEl) {
        if (daysSinceSimple <= 30) {
          readMoreEl.style.display = 'inline-block';
          readMoreEl.textContent = '🌸 See Sister Maria Hope\'s Photos';
        } else {
          readMoreEl.style.display = 'none';
        }
      }
      return;
    }

    /* --- AFTER SOLEMN (after 27 Feb 2027) --- */
    if (today > solemnProfession) {
      const daysSinceSolemn = Math.floor((today - solemnProfession) / msPerDay);
      if (messageEl) {
        if (daysSinceSolemn <= 30) {
          messageEl.innerHTML = '<strong>Congratulations to Sister Agatha</strong>, now solemnly professed at St. Clare Monastery Nigeria · <a href="Profession.html" style="color:#B8860B; text-decoration:underline;">See Photos</a>';
        } else {
          messageEl.innerHTML = 'Thank you for your prayers for the Sisters of St. Clare Monastery Nigeria. 🙏';
        }
      }
      if (readMoreEl && daysSinceSolemn <= 30) {
        readMoreEl.style.display = 'inline-block';
        readMoreEl.textContent = '🌸 See Photos';
      }
      return;
    }
  }

  function createFlowerPetals() {
    if (document.querySelector('.flower-petals')) return;
    const container = document.createElement('div');
    container.className = 'flower-petals';
    document.body.appendChild(container);
    const flowers = ['🌸', '🌺', '🌼', '🌻', '🌷', '💮', '🏵️'];
    for (let i = 0; i < 20; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.textContent = flowers[Math.floor(Math.random() * flowers.length)];
      petal.style.left = Math.random() * 100 + '%';
      petal.style.animationDuration = (8 + Math.random() * 8) + 's';
      petal.style.animationDelay = (Math.random() * 8) + 's';
      petal.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
      container.appendChild(petal);
    }
  }

  function signConsole() {
    console.log('%c🕯️ St. Clare Monastery Nigeria — Candle and Altar Bread Enterprise', 'color:#8B5A2B;font-size:14px;font-weight:bold;');
    console.log('%c© 2026 All Rights Reserved. Ijebu-Ode, Ogun State, Nigeria.', 'color:#3E2412;font-size:12px;');
    console.log('%c"Handcrafted for the Altar. Made for the Church."', 'color:#F4C430;font-style:italic;');
  }

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
    initLightboxOnly();
    initWhatsAppAutoLaunch();
    initProfessionBanner();
    signConsole();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
