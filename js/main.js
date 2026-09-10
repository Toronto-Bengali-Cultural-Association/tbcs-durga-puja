// ===========================================================
// TBCS Durga Pujo — shared site interactivity
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initNavToggle();
  initActiveNavLink();
  initScrollReveal();
  initCountdown();
  initLightbox();
  initContactForm();
  initSponsorShow();
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
});

/* Sticky header shadow on scroll */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* Mobile nav toggle */
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    links.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
}

/* Highlight nav link matching current page */
function initActiveNavLink() {
  const current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* Scroll-triggered reveal animations */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  targets.forEach((t) => observer.observe(t));
}

/* Countdown timer to the Pujo date (data-countdown="YYYY-MM-DDTHH:mm:ss") */
function initCountdown() {
  const el = document.querySelector('[data-countdown]');
  if (!el) return;
  const target = new Date(el.getAttribute('data-countdown')).getTime();
  const dEl = el.querySelector('[data-days]');
  const hEl = el.querySelector('[data-hours]');
  const mEl = el.querySelector('[data-minutes]');
  const sEl = el.querySelector('[data-seconds]');

  function tick() {
    const diff = target - Date.now();
    if (isNaN(target) || diff <= 0) {
      [dEl, hEl, mEl, sEl].forEach((n) => n && (n.textContent = '00'));
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    dEl && (dEl.textContent = String(days).padStart(2, '0'));
    hEl && (hEl.textContent = String(hours).padStart(2, '0'));
    mEl && (mEl.textContent = String(minutes).padStart(2, '0'));
    sEl && (sEl.textContent = String(seconds).padStart(2, '0'));
  }
  tick();
  setInterval(tick, 1000);
}

/* Contact form — posts to the Google Apps Script endpoint in data-endpoint */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  const endpoint = (form.getAttribute('data-endpoint') || '').trim();
  const value = (name) => (form.elements[name] ? form.elements[name].value : '');

  function setStatus(message, kind) {
    if (!status) return;
    status.textContent = message;
    status.className = 'form-status' + (kind ? ' is-' + kind : '');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    // Honeypot — hidden from people, so anything in it is a bot. Pretend it worked.
    if (value('Website')) {
      form.reset();
      setStatus('Thanks, your message has been sent.', 'ok');
      return;
    }

    // No endpoint configured — hand off to the visitor's mail client. Say so out
    // loud: if they have no mail app registered, setting location.href does
    // nothing visible, and silence reads as a broken form.
    if (!endpoint) {
      const body = `${value('message')}\n\nFrom ${value('fullName')} (${value('email')})`;
      setStatus('Opening your email app… if nothing happens, please write to tbcscanada@gmail.com directly.', '');
      window.location.href =
        `mailto:tbcscanada@gmail.com?subject=${encodeURIComponent(value('subject') || 'Message from tbcscanada.org')}` +
        `&body=${encodeURIComponent(body)}`;
      return;
    }

    button.disabled = true;
    setStatus('Sending…', '');
    // URLSearchParams posts as application/x-www-form-urlencoded. That is a
    // CORS-safelisted type, so the browser skips the preflight Apps Script does
    // not answer — and Apps Script only fills e.parameter reliably for this
    // encoding, not for the multipart body FormData would send.
    fetch(endpoint, { method: 'POST', body: new URLSearchParams(new FormData(form)) })
      .then((res) => res.text())
      .then((text) => {
        // Apps Script reports script errors as an HTML page with HTTP 200, so a
        // resolved fetch proves nothing. Only trust an explicit success.
        let ok = false;
        try { ok = JSON.parse(text).status === 'success'; } catch (err) { ok = false; }
        if (!ok) throw new Error('endpoint did not report success');
        form.reset();
        setStatus('Thanks, we got your message and will reply by email.', 'ok');
      })
      .catch(() => {
        setStatus('Sorry, that didn’t go through. Please email tbcscanada@gmail.com directly.', 'error');
      })
      .finally(() => { button.disabled = false; });
  });
}

/* Sponsor row — a plain horizontal scroller. No auto-scroll by design: the row
   is browsed by dragging, swiping, or the arrows. */
function initSponsorShow() {
  const show = document.querySelector('[data-sponsor-show]');
  if (!show) return;
  const strip = show.querySelector('.sponsor-strip');
  const roll = show.querySelector('.sponsor-roll');
  const stageImgs = show.querySelectorAll('.sponsor-stage img');
  if (!strip || !roll || !roll.children.length || stageImgs.length < 2) return;

  const originals = Array.from(roll.children);

  /* The roll is one set of banners followed by an identical copy, and the
     keyframe shifts it by exactly -50%. That lands on a frame identical to the
     start, so the loop never shows a seam or a jump back. The copy is hidden
     from screen readers, which should hear the list once. */
  originals.forEach((img) => {
    const twin = img.cloneNode(true);
    twin.setAttribute('aria-hidden', 'true');
    twin.dataset.twin = '1';
    roll.appendChild(twin);
  });

  /* Pace is set per banner rather than in pixels per second. Every slot is the
     same width and one loop is exactly one set, so each banner holds the stage
     for the same stretch no matter what shape its artwork is, and adding a
     sponsor later lengthens the loop instead of speeding everything up. */
  const SECONDS_EACH = 7;
  roll.style.animationDuration = (originals.length * SECONDS_EACH) + 's';

  /* Start somewhere random in the loop so the same sponsors are not always the
     ones a visitor sees first. A negative delay drops straight into the middle
     of the animation, and snapping it to a whole banner means it lands on one
     squarely instead of mid-slide. */
  const startAt = Math.floor(Math.random() * originals.length);
  roll.style.animationDelay = '-' + (startAt * SECONDS_EACH) + 's';

  // Whichever banner is passing the middle of the strip is the one blown up
  // above it. Two stage images swapped back and forth give the crossfade.
  let frontIsA = true;
  let currentSrc = '';
  let firstPick = true;
  function feature(img) {
    const src = img.currentSrc || img.src;
    if (!src || src === currentSrc) return;
    currentSrc = src;

    /* The markup names a banner so the stage is not blank without JS, but the
       roll now starts at a random point, so that is rarely the right one.
       Write over it in place the first time rather than crossfading, which
       would show the markup's banner fading out on every load. */
    if (firstPick) {
      firstPick = false;
      stageImgs[0].src = src;
      stageImgs[0].alt = img.alt || 'Sponsor banner';
      img.classList.add('is-featured');
      return;
    }

    const incoming = frontIsA ? stageImgs[1] : stageImgs[0];
    const outgoing = frontIsA ? stageImgs[0] : stageImgs[1];
    incoming.src = src;
    incoming.alt = img.alt || 'Sponsor banner';
    incoming.removeAttribute('aria-hidden');
    incoming.classList.add('is-current');
    outgoing.classList.remove('is-current');
    outgoing.setAttribute('aria-hidden', 'true');
    frontIsA = !frontIsA;

    roll.querySelectorAll('.is-featured').forEach((el) => el.classList.remove('is-featured'));
    img.classList.add('is-featured');
  }

  let queued = false;
  function pickCentre() {
    queued = false;
    const box = strip.getBoundingClientRect();
    if (!box.width) return;
    const mid = box.left + box.width / 2;
    let best = null, bestGap = Infinity;
    for (const img of roll.children) {
      const r = img.getBoundingClientRect();
      // Skip anything parked off to the side; only the visible run matters.
      if (r.right < box.left || r.left > box.right) continue;
      const gap = Math.abs(r.left + r.width / 2 - mid);
      if (gap < bestGap) { bestGap = gap; best = img; }
    }
    if (best) feature(best);
  }

  // Sampled on a timer rather than every frame: the banner under the middle
  // changes every few seconds, so 60fps of getBoundingClientRect is wasted work.
  let timer = 0;
  function start() {
    if (timer) return;
    timer = setInterval(() => {
      if (document.hidden || queued) return;
      queued = true;
      requestAnimationFrame(pickCentre);
    }, 250);
  }
  function stop() { clearInterval(timer); timer = 0; }

  if (window.IntersectionObserver) {
    new IntersectionObserver((entries) => {
      entries[0].isIntersecting ? start() : stop();
    }).observe(show);
  } else {
    start();
  }
  pickCentre();

  // Click any banner, in the strip or on the stage, to see it full size.
  show.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img || !lightboxOpen) return;
    lightboxOpen(img.currentSrc || img.src, 'Sponsor banner');
  });
}

/* Shared lightbox. Wired whenever the markup is present, so the gallery tiles and
   the sponsor banners can both call it instead of shipping two implementations. */
let lightboxOpen = null;

function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const closeBtn = lightbox.querySelector('.lightbox-close');
  const photoEl = lightbox.querySelector('[data-lightbox-photo]');

  function open(src, label) {
    if (!src || !photoEl) return;
    photoEl.src = src;
    photoEl.alt = label || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }
  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // removeAttribute, not src='': an empty src makes some browsers re-request the page
    if (photoEl) photoEl.removeAttribute('src');
  }

  lightboxOpen = open;

  document.querySelectorAll('[data-lightbox]').forEach((item) => {
    item.addEventListener('click', () => open(
      item.getAttribute('data-lightbox-img'),
      item.getAttribute('data-lightbox-label') || 'Photo'
    ));
  });
  closeBtn && closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
  });
}
