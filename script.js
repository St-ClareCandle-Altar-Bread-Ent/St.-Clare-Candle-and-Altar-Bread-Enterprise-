/* ============================================================
   SCRIPT.JS — St. Clare Monastery Nigeria
   © 2026 St. Clare Candle and Altar Bread Enterprise.
   All Rights Reserved. Ijebu-Ode, Ogun State, Nigeria.

   CONTENTS
   1. Auto Banner Rotation
   2. Christ the King — Rose Petal Rain (ONLY 22 Nov 2026)
   3. Navigation Toggle
   4. Reveal on Scroll
   5. WhatsApp Toast
   6. Gallery Lightbox + Filters
   7. Auto WhatsApp (Contact page)
   ============================================================ */

/* ============================================================
   1. AUTO BANNER ROTATION
   - Up to 24 Oct 2026 23:59 → Profession of Sister Maria Hope
   - From 25 Oct 2026 00:00 → Christ the King (22 Nov 2026)
   - After 22 Nov 2026 23:59 → Thank you message
   ============================================================ */
(function () {
  'use strict';

  function applyBanner() {
    var banner = document.getElementById('professionBanner');
    var msg    = document.getElementById('professionMessage');
    var link   = document.getElementById('professionReadMore');
    if (!banner || !msg) return;

    var now = new Date();

    var professionEnd   = new Date('2026-10-24T23:59:59');
    var christKingStart = new Date('2026-10-25T00:00:00');
    var christKingEnd   = new Date('2026-11-22T23:59:59');

    // Christ the King window (25 Oct → 22 Nov 2026)
    if (now >= christKingStart && now <= christKingEnd) {
      msg.innerHTML = '👑 Solemnity of Christ the King · Sunday, 22 November 2026 · Adoration at St. Clare Monastery Nigeria · All are welcome.';
      if (link) {
        link.textContent = '👑 See Details';
        link.href = 'News.html';
        link.style.display = 'inline-block';
      }
      banner.classList.add('celebration');
      return;
    }

    // Profession window (up to 24 Oct 2026 23:59)
    if (now <= professionEnd) {
      return;
    }

    // Post-event (after 22 Nov 2026 23:59)
    msg.innerHTML = '✦ Thank you for celebrating with us · St. Clare Monastery Nigeria ✦';
    if (link) {
      link.textContent = '📰 View News';
      link.href = 'News.html';
      link.style.display = 'inline-block';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBanner);
  } else {
    applyBanner();
  }
})();

/* ============================================================
   2. CHRIST THE KING — ROSE PETAL RAIN
   ONLY on 22 November 2026 (00:00 → 23:59:59)
   Petals appear at midnight, fall all day, auto-removed at midnight after.
   ============================================================ */
(function () {
  'use strict';

  function initPetalRain() {
    var now = new Date();

    // 🎯 ONLY the day of Christ the King — 22 Nov 2026
    var petalStart = new Date('2026-11-22T00:00:00');
    var petalEnd   = new Date('2026-11-22T23:59:59');

    if (now < petalStart || now > petalEnd) return;

    var layer = document.querySelector('.ctk-petal-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'ctk-petal-layer';
      layer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(layer);
    }

    var petalSVG = [
      '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">',
      '<path d="M20,2 C28,2 36,10 38,20 C39,25 37,31 33,35 C29,39 24,39 20,37',
      'C16,39 11,39 7,35 C3,31 1,25 2,20 C4,10 12,2 20,2 Z"/>',
      '<path d="M20,6 C26,6 32,12 33,19 C34,23 32,27 29,30 C26,33 22,33 20,31',
      'C18,33 14,33 11,30 C8,27 6,23 7,19 C8,12 14,6 20,6 Z" opacity="0.55"/>',
      '<path d="M20,10 C24,10 28,14 29,19 C30,22 28,25 26,27 C24,29 21,29 20,27',
      'C19,29 16,29 14,27 C12,25 10,22 11,19 C12,14 16,10 20,10 Z" opacity="0.35"/>',
      '</svg>'
    ].join('');

    var isMobile = window.matchMedia('(max-width: 720px)').matches;
    var COUNT = isMobile ? 25 : 40;

    for (var i = 0; i < COUNT; i++) {
      (function () {
        var petal = document.createElement('div');
        var isRed = Math.random() < 0.55;
        petal.className = 'ctk-petal ' + (isRed ? 'ctk-petal--red' : 'ctk-petal--white');
        petal.innerHTML = petalSVG;

        var size = 14 + Math.random() * 22;
        petal.style.width  = size + 'px';
        petal.style.height = size + 'px';

        var left = Math.random() * 100;
        petal.style.left = left + 'vw';

        var duration = 9 + Math.random() * 8;
        petal.style.animationDuration = duration + 's';
        petal.style.animationDelay = (-Math.random() * duration) + 's';
        petal.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
        petal.style.opacity = (0.55 + Math.random() * 0.35).toFixed(2);

        layer.appendChild(petal);
      })();
    }

    // Auto-remove at midnight after 22 Nov 2026
    function cleanup() {
      if (new Date() > petalEnd) {
        if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
        clearInterval(checker);
      }
    }
    var checker = setInterval(cleanup, 60 * 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPetalRain);
  } else {
    initPetalRain();
  }
})();

/* ============================================================
   3. NAVIGATION TOGGLE (mobile menu)
   ============================================================ */
(function () {
  'use strict';

  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links  = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();

/* ============================================================
   4. REVEAL ON SCROLL
   ============================================================ */
(function () {
  'use strict';

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }
})();

/* ============================================================
   5. WHATSAPP TOAST
   ============================================================ */
(function () {
  'use strict';

  function initToast() {
    if (!document.querySelector('[href*="wa.me"]')) return;

    function showToast(text) {
      var toast = document.createElement('div');
      toast.className = 'st-clare-toast';
      toast.textContent = text || 'Opening WhatsApp…';
      document.body.appendChild(toast);
      requestAnimationFrame(function () { toast.classList.add('show'); });
      setTimeout(function () {
        toast.classList.remove('show');
        setTimeout(function () { toast.remove(); }, 400);
      }, 2200);
    }

    document.querySelectorAll('[href*="wa.me"]').forEach(function (el) {
      el.addEventListener('click', function () { showToast('Opening WhatsApp…'); });
    });
    document.querySelectorAll('[href^="mailto:"]').forEach(function (el) {
      el.addEventListener('click', function () { showToast('Opening email…'); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToast);
  } else {
    initToast();
  }
})();

/* ============================================================
   6. GALLERY LIGHTBOX + FILTERS
   ============================================================ */
(function () {
  'use strict';

  function initGallery() {
    var gallery = document.getElementById('mainGallery');
    if (!gallery) return;

    var items    = gallery.querySelectorAll('.gallery-item');
    var tabs     = document.querySelectorAll('.gallery-tab');
    var lightbox = document.getElementById('lightbox');
    var lbImg    = document.getElementById('lightboxImg');
    var lbCap    = document.getElementById('lightboxCaption');
    var lbClose  = document.getElementById('lightboxClose');
    var lbPrev   = document.getElementById('lightboxPrev');
    var lbNext   = document.getElementById('lightboxNext');

    var visibleItems = [];
    var currentIndex = 0;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        var filter = tab.getAttribute('data-filter');
        items.forEach(function (item) {
          var cat = item.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });

        var adventPanel  = document.getElementById('adventPanel');
        var paschalPanel = document.getElementById('paschalPanel');
        if (adventPanel)  adventPanel.classList.toggle('show', filter === 'advent');
        if (paschalPanel) paschalPanel.classList.toggle('show', filter === 'paschal');
      });
    });

    function rebuildVisible() {
      visibleItems = [];
      items.forEach(function (item) {
        if (!item.classList.contains('hidden')) visibleItems.push(item);
      });
    }

    function openLightbox(index) {
      rebuildVisible();
      if (!visibleItems.length) return;
      currentIndex = ((index % visibleItems.length) + visibleItems.length) % visibleItems.length;
      var item = visibleItems[currentIndex];
      var img  = item.querySelector('img');
      var cap  = item.querySelector('figcaption');
      if (!img || !lightbox) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt || '';
      lbCap.textContent = cap ? cap.textContent : '';
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove('show');
      document.body.style.overflow = '';
    }

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        rebuildVisible();
        var idx = visibleItems.indexOf(item);
        openLightbox(idx >= 0 ? idx : 0);
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev)  lbPrev.addEventListener('click', function () { openLightbox(currentIndex - 1); });
    if (lbNext)  lbNext.addEventListener('click', function () { openLightbox(currentIndex + 1); });

    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (!lightbox || !lightbox.classList.contains('show')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft')  openLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();

/* ============================================================
   7. AUTO WHATSAPP (Contact page only)
   ============================================================ */
(function () {
  'use strict';

  function initAutoWhatsApp() {
    if (document.body.getAttribute('data-auto-whatsapp') !== 'true') return;
    // Reserved — intentional no-op for now
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoWhatsApp);
  } else {
    initAutoWhatsApp();
  }
})();

/* ============================================================
   END OF SCRIPT.JS
   © 2026 St. Clare Candle and Altar Bread Enterprise.
   ============================================================ */
