/* ==========================================================================
   Sidra Ghulam Hussain — portfolio behaviour
   Every feature lives in its own init function so nothing leaks into the
   global scope and each piece can be read on its own.

   01 Theme switch          06 Skill meters
   02 Mobile menu           07 Project filters
   03 Scroll spy + progress 08 Contact form validation
   04 Back to top           09 Footer year
   05 Hero peer mesh
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 01 THEME SWITCH ------------------------------------------
     Remembers the visitor's choice, and falls back to their system setting
     the first time they arrive. */
  function initTheme() {
    var root = document.documentElement;
    var button = document.getElementById('themeToggle');
    if (!button) return;

    var icon = button.querySelector('i');
    var saved = null;

    try {
      saved = localStorage.getItem('theme');
    } catch (err) {
      saved = null; // private browsing can block storage; the page still works
    }

    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    apply(saved || (prefersDark ? 'dark' : 'light'));

    button.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try {
        localStorage.setItem('theme', next);
      } catch (err) { /* nothing to do — the theme still applies for this visit */ }
    });

    function apply(theme) {
      root.setAttribute('data-theme', theme);
      var dark = theme === 'dark';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  /* ---------- 02 MOBILE MENU ------------------------------------------- */
  function initMenu() {
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      setOpen(links.classList.contains('is-open') === false);
    });

    // Tapping a link on a phone should close the panel behind it.
    links.addEventListener('click', function (event) {
      if (event.target.closest('.nav__link')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 720) setOpen(false);
    });

    function setOpen(open) {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  }

  /* ---------- 03 SCROLL SPY + READING PROGRESS -------------------------
     Highlights the section you are reading and draws a hairline across the
     bottom of the navigation bar showing how far down the page you are. */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
    var bar = document.getElementById('navProgress');
    var sections = links
      .map(function (link) { return document.querySelector(link.getAttribute('href')); })
      .filter(Boolean);

    if (!sections.length) return;

    var ticking = false;

    function update() {
      var scrolled = window.scrollY;
      var height = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + '%';

      var marker = scrolled + window.innerHeight * 0.3;
      var current = sections[0];

      sections.forEach(function (section) {
        if (section.offsetTop <= marker) current = section;
      });

      links.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + current.id);
      });

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  /* ---------- 04 BACK TO TOP ------------------------------------------- */
  function initBackToTop() {
    var button = document.getElementById('toTop');
    if (!button) return;

    window.addEventListener('scroll', function () {
      var show = window.scrollY > window.innerHeight * 0.8;
      button.hidden = !show;
      button.classList.toggle('is-visible', show);
    }, { passive: true });

    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 05 HERO PEER MESH ----------------------------------------
     A small canvas sketch of a peer-to-peer network: nodes drift, and a line
     is drawn between any two that are close enough to "connect". The cursor
     acts as an extra peer, so the mesh reshapes around it. It is decorative,
     so it is skipped entirely when the visitor prefers reduced motion. */
  function initMesh() {
    var canvas = document.getElementById('mesh');
    if (!canvas || reduceMotion) return;

    var ctx = canvas.getContext('2d');
    var nodes = [];
    var pointer = { x: -999, y: -999 };
    var width = 0;
    var height = 0;

    function resize() {
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      var rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      build();
    }

    function build() {
      var count = Math.round(Math.min(46, Math.max(14, width / 34)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.6 + 1
        });
      }
    }

    function themeColours() {
      var styles = getComputedStyle(document.documentElement);
      return {
        line: styles.getPropertyValue('--signal').trim(),
        node: styles.getPropertyValue('--accent').trim()
      };
    }

    function frame() {
      var colours = themeColours();
      var reach = Math.min(160, width / 6);

      ctx.clearRect(0, 0, width, height);

      nodes.forEach(function (node) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      // Connections between peers
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < reach) {
            ctx.globalAlpha = (1 - dist / reach) * 0.16;
            ctx.strokeStyle = colours.line;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Connections to the cursor, drawn brighter
      nodes.forEach(function (node) {
        var dx = node.x - pointer.x;
        var dy = node.y - pointer.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < reach * 1.5) {
          ctx.globalAlpha = (1 - dist / (reach * 1.5)) * 0.5;
          ctx.strokeStyle = colours.line;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }

        ctx.globalAlpha = 0.5;
        ctx.fillStyle = colours.node;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      window.requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', function (event) {
      var rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    }, { passive: true });
    window.addEventListener('pointerleave', function () {
      pointer.x = -999;
      pointer.y = -999;
    });

    resize();
    frame();
  }

  /* ---------- 06 SKILL METERS ------------------------------------------
     Bars stay at zero until the section is actually on screen, so the fill
     reads as a response to arriving there rather than a loop. */
  function initMeters() {
    var bars = Array.prototype.slice.call(document.querySelectorAll('.meter span'));
    if (!bars.length) return;

    function fill(bar) {
      bar.style.width = bar.dataset.level + '%';
    }

    if (!('IntersectionObserver' in window)) {
      bars.forEach(fill);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          fill(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    bars.forEach(function (bar) { observer.observe(bar); });
  }

  /* ---------- 07 PROJECT FILTERS ---------------------------------------- */
  function initFilters() {
    var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
    var empty = document.getElementById('gridEmpty');
    if (!chips.length) return;

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var filter = chip.dataset.filter;
        var shown = 0;

        chips.forEach(function (other) { other.classList.toggle('is-active', other === chip); });

        cards.forEach(function (card) {
          var match = filter === 'all' || card.dataset.tags.split(' ').indexOf(filter) !== -1;
          card.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });

        if (empty) empty.hidden = shown !== 0;
      });
    });
  }

  /* ---------- 08 CONTACT FORM VALIDATION --------------------------------
     Validated in JavaScript rather than left to the browser, so the wording
     of every error is written for the person reading it. */
  function initForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var status = document.getElementById('formStatus');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

    var rules = {
      name: function (value) {
        if (!value) return 'Add your name so I know who I am replying to.';
        if (value.length < 2) return 'That looks too short to be a name.';
        return '';
      },
      email: function (value) {
        if (!value) return 'An email address is how I get back to you.';
        if (!emailPattern.test(value)) return 'Check the address — it is missing an @ or a domain.';
        return '';
      },
      message: function (value) {
        if (!value) return 'Tell me a little about the project.';
        if (value.length < 20) return 'A sentence or two helps — ' + value.length + ' of 20 characters so far.';
        return '';
      }
    };

    Object.keys(rules).forEach(function (key) {
      var input = document.getElementById(key);
      // Re-check as they type, but only after the field has already failed once.
      input.addEventListener('input', function () {
        if (input.closest('.field').classList.contains('has-error')) validate(key);
      });
      input.addEventListener('blur', function () {
        if (input.value.trim()) validate(key);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var valid = true;
      var firstBroken = null;

      Object.keys(rules).forEach(function (key) {
        if (!validate(key)) {
          valid = false;
          if (!firstBroken) firstBroken = document.getElementById(key);
        }
      });

      if (!valid) {
        status.style.color = 'var(--danger)';
        status.textContent = 'Three small fixes above and this is ready to send.';
        firstBroken.focus();
        return;
      }

      // No backend is attached to this page, so the message is confirmed
      // locally. Connect a form service here to deliver it to an inbox.
      status.style.color = 'var(--accent)';
      status.textContent = 'Thank you — your message is ready. I reply within 24 hours.';
      form.reset();
    });

    function validate(key) {
      var input = document.getElementById(key);
      var error = document.getElementById(key + 'Error');
      var problem = rules[key](input.value.trim());

      input.closest('.field').classList.toggle('has-error', Boolean(problem));
      error.textContent = problem;
      input.setAttribute('aria-invalid', String(Boolean(problem)));

      return !problem;
    }
  }

  /* ---------- 09 FOOTER YEAR -------------------------------------------- */
  function initYear() {
    var slot = document.getElementById('year');
    if (slot) slot.textContent = new Date().getFullYear();
  }

  /* ---------- START ------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initMenu();
    initScrollSpy();
    initBackToTop();
    initMesh();
    initMeters();
    initFilters();
    initForm();
    initYear();
  });
})();
