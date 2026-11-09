/* ============================================================
   NOORI WARIS — Portfolio interactions
   1. Mobile menu
   2. Scroll progress bar + nav background on scroll
   3. Staggered scroll-reveal animations
   4. Active-section highlighting in the nav
   5. Footer year
   ============================================================ */

(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  var progress = document.getElementById('scrollProgress');

  /* ---------- 1. Mobile menu ---------- */
  function setMenu(open) {
    links.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    nav.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function () {
    setMenu(!links.classList.contains('open'));
  });

  // Close after choosing a link, on Escape, or when resizing up to desktop
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', function (mq) {
    if (mq.matches) setMenu(false);
  });

  /* ---------- 2. Scroll progress + nav state ---------- */
  var ticking = false;
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    progress.style.transform = 'scaleX(' + ratio + ')';
    nav.classList.toggle('scrolled', window.scrollY > 20);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- 3. Scroll reveal (staggered) ----------
     Siblings that reveal together get a small incremental delay
     so cards in a grid cascade in rather than appearing at once. */
  var revealEls = document.querySelectorAll('.reveal');

  revealEls.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
      return c.classList.contains('reveal');
    });
    el.style.setProperty('--d', (siblings.indexOf(el) * 90) + 'ms');
  });

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 4. Active section in nav ----------
     A section counts as "current" when it crosses the middle band
     of the viewport, which works for both short and tall sections. */
  var navLinkMap = {};
  links.querySelectorAll('a[href^="#"]').forEach(function (a) {
    navLinkMap[a.getAttribute('href').slice(1)] = a;
  });

  function setActive(id) {
    Object.keys(navLinkMap).forEach(function (key) {
      var isActive = key === id;
      navLinkMap[key].classList.toggle('active', isActive);
      if (isActive) navLinkMap[key].setAttribute('aria-current', 'true');
      else navLinkMap[key].removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('main section[id]').forEach(function (s) {
      sectionObserver.observe(s);
    });
  }

  /* ---------- 5. Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
