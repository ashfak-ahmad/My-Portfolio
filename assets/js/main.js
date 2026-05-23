/* ============================================================
   main.js — Ashfak Ahmad Portfolio
   Pure JavaScript — no frameworks, no libraries.

   1.  goTo()            — smooth scroll to section
   2.  toggleMenu()      — mobile hamburger open/close
   3.  closeMenu()       — close mobile menu
   4.  Navbar scroll     — frosted glass + active link highlight
   5.  switchTab()       — legacy stub (tabs removed; credentials
                           section now uses a static 2-column layout)
   6.  openModal()       — project case study modals
   7.  closeModal()      — close modal on backdrop click
   8.  forceCloseModal() — close modal on X button
   9.  Skill bars        — animate on scroll into view
   10. Scroll reveal     — fade-in sections on scroll
   11. Typing animation  — hero role titles
   12. Writeup pages     — navbar scroll state
============================================================ */


/* ── 1. SMOOTH SCROLL ──────────────────────────────────────
   Named goTo (not scrollTo) to avoid clashing with the
   native window.scrollTo browser method.
─────────────────────────────────────────────────────────── */
function goTo(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var navH = document.getElementById('navbar').offsetHeight;
  var top  = el.getBoundingClientRect().top + window.pageYOffset - navH;
  window.scrollTo({ top: top, behavior: 'smooth' });
}


/* ── 2 & 3. MOBILE MENU ────────────────────────────────────
─────────────────────────────────────────────────────────── */
function toggleMenu() {
  var menu = document.getElementById('mob-menu');
  var btn  = document.getElementById('ham');
  if (!menu || !btn) return;
  menu.classList.toggle('open');
  btn.classList.toggle('open');
}

function closeMenu() {
  var menu = document.getElementById('mob-menu');
  var btn  = document.getElementById('ham');
  if (!menu || !btn) return;
  menu.classList.remove('open');
  btn.classList.remove('open');
}


/* ── 4. NAVBAR — SCROLL STATE + ACTIVE LINK ───────────────
─────────────────────────────────────────────────────────── */
(function () {
  var navbar   = document.getElementById('navbar');
  if (!navbar) return;

  var sections = ['hero', 'about', 'experience', 'skills', 'credentials', 'projects', 'writeups', 'contact'];
  var navLinks = document.querySelectorAll('.nav-links .nav-link');

  window.addEventListener('scroll', function () {
    /* frosted glass on scroll */
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    /* active link highlight */
    var navH = navbar.offsetHeight + 80;
    var cur  = 'hero';
    sections.forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec && sec.getBoundingClientRect().top <= navH) cur = id;
    });
    navLinks.forEach(function (link, i) {
      link.classList.toggle('active', sections[i + 1] === cur);
    });
  }, { passive: true });
})();


/* ── 5. CREDENTIAL TABS ────────────────────────────────────
   Handles Education / Cybersecurity / Cloud / Licenses tabs.
   Adds "active" class to the clicked tab button and shows
   the matching panel; hides all others.
─────────────────────────────────────────────────────────── */
function switchTab(e, name) {
  document.querySelectorAll('.cred-panel').forEach(function (p) {
    p.classList.remove('active');
  });
  document.querySelectorAll('.cred-tab').forEach(function (t) {
    t.classList.remove('active');
  });
  var panel = document.getElementById('tab-' + name);
  if (panel) panel.classList.add('active');
  if (e && e.currentTarget) e.currentTarget.classList.add('active');
}


/* ── 6, 7, 8. MODALS ───────────────────────────────────────
─────────────────────────────────────────────────────────── */
function openModal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e, id) {
  /* only close when clicking the dark backdrop itself */
  if (e.target === document.getElementById(id)) {
    forceCloseModal(id);
  }
}

function forceCloseModal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  document.body.style.overflow = '';
}

/* close any open modal with Escape key */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(function (m) {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
});


/* ── 9. SKILL BAR ANIMATION ────────────────────────────────
   Bars animate in once when #skills scrolls into view.
─────────────────────────────────────────────────────────── */
(function () {
  var skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  var animated = false;

  new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      document.querySelectorAll('.skill-fill').forEach(function (bar) {
        bar.style.width = bar.getAttribute('data-w');
      });
    }
  }, { threshold: 0.2 }).observe(skillsSection);
})();


/* ── 10. SCROLL REVEAL ─────────────────────────────────────
   Adds .in to every .reveal element as it enters viewport.
─────────────────────────────────────────────────────────── */
(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
})();


/* ── 11. TYPING ANIMATION ──────────────────────────────────
   Cycles through hero role titles one character at a time.
─────────────────────────────────────────────────────────── */
(function () {
  var el = document.getElementById('typed-role');
  if (!el) return;

  var roles    = ['SOC Analyst', 'Threat Detection', 'Cloud Security'];
  var ri       = 0;   /* role index    */
  var ci       = 0;   /* char index    */
  var deleting = false;
  var pause    = 0;   /* tick counter  */

  function tick() {
    var word = roles[ri];

    if (pause > 0) {
      pause--;
      setTimeout(tick, 80);
      return;
    }

    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; pause = 22; }
      setTimeout(tick, 95);
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
        pause = 5;
      }
      setTimeout(tick, 48);
    }
  }

  /* slight delay so the page has settled before typing starts */
  setTimeout(tick, 900);
})();


/* ── 12. WRITEUP PAGE NAV ──────────────────────────────────
   On writeup pages there are no sections to track,
   just apply the scrolled class to the navbar.
─────────────────────────────────────────────────────────── */
(function () {
  if (!document.body.classList.contains('wup-body')) return;
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();
