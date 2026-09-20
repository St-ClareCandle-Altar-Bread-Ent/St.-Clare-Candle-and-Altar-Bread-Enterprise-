/* ============================================================
   ST. CLARE CANDLE AND ALTAR BREAD ENTERPRISE
   script.js — Physics × Biology Interaction Engine

   Copyright © 2026 St. Clare Candle and Altar Bread Enterprise.
   All Rights Reserved.

   Proprietary & Confidential.
   Unauthorized copying, reproduction, distribution, modification,
   or use of this script, in whole or in part, via any medium,
   is strictly prohibited without the express written permission of
   St. Clare Candle and Altar Bread Enterprise,
   Ijebu-Ode, Ogun State, Nigeria.

   Contact: stclarecandlealtarent8@gmail.com
   Phone  : 09031805281

   Built for the Nuns of St. Clare, Ijebu-Ode.
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     0. CONFIG — Central constants for the whole engine
     ============================================================ */
  const CONFIG = {
    whatsapp: {
      number: '2349031805281',
      prefilled:
        'Good day, Sisters of St. Clare. I found your website and I would like to enquire about your candles and altar bread.'
    },
    particles: {
      count: 42,
      maxSize: 3.2,
      minSize: 0.8,
      riseSpeed: 0.35,
      flickerSpeed: 0.0022,
      glowRadius: 26
    },
    synapse: {
      maxLinks: 3,
      triggerRadius: 260,
      lineLife: 1400
    },
    magnet: {
      strength: 0.22,
      radius: 140
    }
  };

  /* ============================================================
     1. UTILITIES — small physics/biology helpers
     ============================================================ */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (min, max) => Math.random() * (max - min) + min;
  const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     2. CANDLE-FLAME PARTICLE ENGINE
        Physics : Brownian rise + flicker modulation
        Biology : Ember like spores/pollen drifting upward
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
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

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

        // Brownian drift + rise
        p.flicker += CONFIG.particles.flickerSpeed;
        p.x += p.drift + Math.sin(p.flicker) * 0.35;
        p.y -= p.speed;

        // Recycle
        if (p.y < -20 || p.x < -40 || p.x > W + 40) {
          particles[i] = spawn(false);
          continue;
        }

        // Glow halo (radial gradient)
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, CONFIG.particles.glowRadius);
        glow.addColorStop(0, hexToRgba(p.hue, p.alpha));
        glow.addColorStop(1, hexToRgba(p.hue, 0));

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, CONFIG.particles.glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Core
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
    return `rgba(${r},${g},${b},${a})`;
  }

  /* ============================================================
     3. NEURON SYNAPSE LAYER
        Draws animated SVG lines between .btn elements
        Physics : Spring-like attraction
        Biology : Dendrite axon firing
     ============================================================ */
  function initSynapseLayer() {
    if (prefersReduced) return;

    const buttons = $$('.btn');
    if (buttons.length < 2) return;

    // Create overlay SVG
    const svgNS = 'http://www.w3.org/2000/svg';
    let svg = $('#synapseLayer');
    if (!svg) {
      svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('id', 'synapseLayer');
      svg.setAttribute('class', 'synapse-layer');
      svg.style.position = 'fixed';
      svg.style.pointerEvents = 'none';
      svg.style.zIndex = '5';
      svg.style.inset = '0';
      svg.style.width = '100%';
      svg.style.height = '100%';
      document.body.appendChild(svg);
    }

    // Gradient defs
    const defs = document.createElementNS(svgNS, 'defs');
    defs.innerHTML = `
      <linearGradient id="brownGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"  stop-color="#D2B48C" stop-opacity="0.15"/>
        <stop offset="50%" stop-color="#8B5A2B" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#D2B48C" stop-opacity="0.15"/>
      </linearGradient>
    `;
    svg.appendChild(defs);

    const paths = new Map();
    let mouse = { x: -9999, y: -9999 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    function rebuild() {
      svg.querySelectorAll('path').forEach(n => n.remove());
      paths.clear();

      const centers = buttons.map((b) => {
        const r = b.getBoundingClientRect();
        return { el: b, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
      });

      centers.forEach((a, i) => {
        // Nearest N neighbours
        const others = centers
          .map((b, j) => ({ b, j, d: dist(a.cx, a.cy, b.cx, b.cy) }))
          .filter(o => o.j !== i)
          .sort((x, y) => x.d - y.d)
          .slice(0, CONFIG.synapse.maxLinks);

        others.forEach(({ b, j, d }) => {
          if (d > 520) return;
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (paths.has(key)) return;

          const p = document.createElementNS(svgNS, 'path');
          p.setAttribute('stroke', 'url(#brownGrad)');
          p.setAttribute('stroke-width', '1.2');
          p.setAttribute('fill', 'none');
          p.setAttribute('stroke-dasharray', '5 9');
          p.style.opacity = '0.55';
          svg.appendChild(p);
          paths.set(key, { node: p, a: i, b: j });
        });
      });
    }

    function draw() {
      const centers = buttons.map((b) => {
        const r = b.getBoundingClientRect();
        return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
      });

      paths.forEach(({ node, a, b }) => {
        const A = centers[a];
        const B = centers[b];
        if (!A || !B) return;

        // Quadratic bezier bowing slightly outward
        const mx = (A.cx + B.cx) / 2;
        const my = (A.cy + B.cy) / 2;
        const dx = B.cx - A.cx;
        const dy = B.cy - A.cy;
        const len = Math.hypot(dx, dy) || 1;
        const bow = 14;
        const nx = -dy / len;
        const ny = dx / len;
        const ctrlX = mx + nx * bow;
        const ctrlY = my + ny * bow;

        node.setAttribute(
          'd',
          `M ${A.cx} ${A.cy} Q ${ctrlX} ${ctrlY} ${B.cx} ${B.cy}`
        );

        // Brighten if mouse nearby
        const md = Math.min(
          dist(mouse.x, mouse.y, A.cx, A.cy),
          dist(mouse.x, mouse.y, B.cx, B.cy)
        );
        node.style.opacity = md < CONFIG.synapse.triggerRadius ? '0.95' : '0.45';
        node.style.strokeWidth = md < CONFIG.synapse.triggerRadius ? '1.9' : '1.2';
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', rebuild);
    window.addEventListener('scroll', rebuild, { passive: true });
    setTimeout(rebuild, 300);
    rebuild();
    draw();
  }

  /* ============================================================
     4. MAGNETIC BUTTONS
        Physics : Coulomb-like attraction between cursor & button
        Biology : Chemotaxis — cells moving toward a stimulus
     ============================================================ */
  function initMagneticButtons() {
    if (prefersReduced) return;

    const btns = $$('.btn');
    btns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${mx * CONFIG.magnet.strength}px, ${my * CONFIG.magnet.strength - 4}px) scale(1.05)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });

      // Ripple coordinates for ::after gradient
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--x', ((e.clientX - r.left) / r.width) * 100 + '%');
        btn.style.setProperty('--y', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* ============================================================
     5. SCROLL REVEAL
        Biology : Photosynthesis — content "grows" into light
     ============================================================ */
  function initScrollReveal() {
    const targets = $$('.reveal, section, .card, .product, .stat, .quote');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window) || prefersReduced) {
      targets.forEach(t => t.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    targets.forEach((t) => {
      if (!t.classList.contains('reveal')) t.classList.add('reveal');
      io.observe(t);
    });
  }

  /* ============================================================
     6. MOBILE NAV TOGGLE
     ============================================================ */
  function initNavToggle() {
    const toggle = $('.nav-toggle');
    const links  = $('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
      toggle.setAttribute(
        'aria-expanded',
        toggle.classList.contains('open') ? 'true' : 'false'
      );
    });

    // Close on link click
    $$('.nav-links a').forEach((a) => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  /* ============================================================
     7. ACTIVE NAV HIGHLIGHT
     ============================================================ */
  function initActiveNav() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $$('.nav-links a').forEach((a) => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (
        href === path ||
        (path === '' && href === 'index.html') ||
        (path === 'index.html' && href === 'index.html')
      ) {
        a.classList.add('active');
      }
    });
  }

  /* ============================================================
     8. ANIMATED COUNTERS (Stats)
        Biology : Cell division — numbers bloom upward
     ============================================================ */
  function initCounters() {
    const nums = $$('[data-count]');
    if (!nums.length) return;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      nums.forEach((n) => (n.textContent = n.dataset.count));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });

    nums.forEach((n) => io.observe(n));
  }

  /* ============================================================
     9. WHATSAPP AUTO-LAUNCH (Contact page)
        Triggered when body carries data-auto-whatsapp="true"
        - Shows a sacred 3-second "Connecting to the Sisters…" overlay
        - Then opens wa.me deep-link in a new tab
     ============================================================ */
  function initWhatsAppAutoLaunch() {
    const body = document.body;
    if (!body || body.dataset.autoWhatsapp !== 'true') return;

    const num = CONFIG.whatsapp.number;
    const msg = encodeURIComponent(CONFIG.whatsapp.prefilled);
    const url = `https://wa.me/${num}?text=${msg}`;

    // Build the sacred overlay
    const overlay = document.createElement('div');
    overlay.className = 'wa-launch-overlay';
    overlay.innerHTML = `
      <div class="wa-launch-inner">
        <div class="wa-halo">
          <img src="logoaltarbread.png" alt="St. Clare Candle and Altar Bread Enterprise logo">
        </div>
        <p class="wa-launch-title">Connecting you to the Sisters…</p>
        <p class="wa-launch-sub">St. Clare Candle and Altar Bread Enterprise</p>
        <div class="wa-bar"><span></span></div>
        <button type="button" class="btn btn-wa btn-sm wa-launch-skip">Open WhatsApp Now</button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Inject minimal styles inline (keeps CSS file clean)
    const style = document.createElement('style');
    style.textContent = `
      .wa-launch-overlay {
        position: fixed; inset: 0;
        background: rgba(255,255,255,0.96);
        backdrop-filter: blur(20px);
        z-index: 9999;
        display: grid; place-items: center;
        opacity: 0; pointer-events: none;
        transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1);
      }
      .wa-launch-overlay.show { opacity: 1; pointer-events: auto; }
      .wa-launch-inner { text-align: center; padding: 24px; }
      .wa-halo {
        width: 120px; height: 120px; margin: 0 auto 22px;
        border-radius: 50%; padding: 4px;
        background: conic-gradient(from 0deg, #D2B48C, #F4C430, #8B5A2B, #D2B48C);
        animation: synapse-spin 4s linear infinite;
        box-shadow: 0 0 60px rgba(244,196,48,0.55);
      }
      .wa-halo img {
        width: 100%; height: 100%; border-radius: 50%;
        object-fit: cover; background: #fff;
      }
      .wa-launch-title {
        font-family: Georgia, serif; font-size: 1.25rem;
        color: #3E2412; margin-bottom: 6px; letter-spacing: 0.4px;
      }
      .wa-launch-sub {
        font-family: 'Courier New', monospace; font-size: 0.78rem;
        color: #8B5A2B; letter-spacing: 2.6px; text-transform: uppercase;
        margin-bottom: 22px;
      }
      .wa-bar {
        width: 220px; height: 4px; margin: 0 auto 24px;
        background: rgba(210,180,140,0.35); border-radius: 4px;
        overflow: hidden;
      }
      .wa-bar span {
        display: block; height: 100%; width: 0%;
        background: linear-gradient(90deg, #8B5A2B, #F4C430);
        animation: wa-bar-fill 3s linear forwards;
      }
      @keyframes wa-bar-fill { to { width: 100%; } }
    `;
    document.head.appendChild(style);

    // Fade in overlay
    requestAnimationFrame(() => overlay.classList.add('show'));

    let launched = false;
    function launch() {
      if (launched) return;
      launched = true;
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => overlay.classList.remove('show'), 400);
    }

    // Skip button
    overlay.querySelector('.wa-launch-skip').addEventListener('click', launch);

    // Auto-launch after 3s
    setTimeout(launch, 3000);
  }

  /* ============================================================
     10. WHATSAPP FLOATING BUTTON (all pages)
        Ensures the .wa-float href is always correct
     ============================================================ */
  function initWhatsAppFloat() {
    const wa = $('.wa-float');
    if (!wa) return;
    const num = CONFIG.whatsapp.number;
    const msg = encodeURIComponent(CONFIG.whatsapp.prefilled);
    wa.setAttribute('href', `https://wa.me/${num}?text=${msg}`);
    wa.setAttribute('target', '_blank');
    wa.setAttribute('rel', 'noopener noreferrer');
    wa.setAttribute('aria-label', 'Chat with St. Clare Candle and Altar Bread Enterprise on WhatsApp');
  }

  /* ============================================================
     11. PARALLAX LOGO GLOW (subtle)
     ============================================================ */
  function initLogoParallax() {
    if (prefersReduced) return;
    const logo = $('.brand-logo');
    if (!logo) return;
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      logo.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  /* ============================================================
     12. SMOOTH ANCHOR SCROLL
     ============================================================ */
  function initSmoothAnchors() {
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
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
     13. CONSOLE SIGNATURE — a small monastic blessing
     ============================================================ */
  function signConsole() {
    const style1 = 'color:#8B5A2B;font-size:14px;font-weight:bold;';
    const style2 = 'color:#3E2412;font-size:12px;';
    console.log('%c🕯️ St. Clare Candle and Altar Bread Enterprise', style1);
    console.log('%c© 2
