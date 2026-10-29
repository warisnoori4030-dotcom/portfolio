/* ============================================================
   NOORI WARIS — Portfolio interactions
   Handles: mobile menu, scroll progress, nav scroll state,
   scroll-reveal animations, active-section highlighting,
   and skill gauge rendering.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. Mobile menu toggle ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close menu when a link is tapped (mobile)
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 2. Scroll progress bar + nav scrolled state ---------- */
  var progress = document.getElementById('scrollProgress');
  var nav = document.getElementById('nav');

  function onScroll() {
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    progress.style.width = pct + '%';
    // Add solid background to nav once scrolled past threshold
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Scroll-reveal via IntersectionObserver ----------
     Adds .in to .reveal elements when they enter the viewport,
     producing the fade-up animation defined in CSS. */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger siblings slightly for a cascading feel
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: just show everything
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 4. Active section highlighting in nav ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinkMap = {};
  links.querySelectorAll('a').forEach(function (a) {
    navLinkMap[a.getAttribute('href').slice(1)] = a;
  });

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        Object.keys(navLinkMap).forEach(function (key) {
          navLinkMap[key].classList.toggle('active', key === id);
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ---------- 5. Render skill proficiency gauges ----------
     Each .gauge has data-level (1-5); we fill that many cells. */
  document.querySelectorAll('.gauge').forEach(function (g) {
    var level = parseInt(g.getAttribute('data-level'), 10) || 0;
    for (var i = 0; i < 5; i++) {
      var cell = document.createElement('span');
      if (i < level) cell.classList.add('on');
      g.appendChild(cell);
    }
  });

  /* ---------- 6. Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
