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

  /* ============================================================
     CONFIG
     ============================================================ */
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
     3. ORDER-NOW LINKS — toast confirmation on click
     ============================================================ */
  function initOrderLinks() {
    $$('.btn-order').forEach(function (el) {
      el.addEventListener('click', function () {
        showToast('Opening WhatsApp to complete your order…');
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
     9. PARALLAX HERO LOGO (subtle, desktop only)
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
     11. CONSOLE SIGNATURE
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
    initScrollReveal();
    initNavToggle();
    initActiveNav();
    initSmoothAnchors();
    initImageFallback();
    initHeroLogoParallax();
    initButtonRipple();
    signConsole();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
