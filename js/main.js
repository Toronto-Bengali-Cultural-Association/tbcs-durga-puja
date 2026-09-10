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
  const marquee = document.querySelector('[data-sponsor-marquee]');
  if (!marquee) return;
  const track = marquee.querySelector('.sponsor-track');
  if (!track || !track.children.length) return;

  const wrap = marquee.closest('.sponsor-marquee-wrap');
  if (wrap) {
    const step = () => Math.max(220, marquee.clientWidth * 0.7);
    wrap.querySelector('.prev').addEventListener('click', () =>
      marquee.scrollBy({ left: -step(), behavior: 'smooth' }));
    wrap.querySelector('.next').addEventListener('click', () =>
      marquee.scrollBy({ left: step(), behavior: 'smooth' }));
  }

  // Drag to scroll — a mouse cannot swipe, and a trackpad user may not think to.
  let down = false, startX = 0, startScroll = 0, dragged = false;
  marquee.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return;      // native touch scrolling is better
    down = true; dragged = false;
    startX = e.clientX; startScroll = marquee.scrollLeft;
  });
  marquee.addEventListener('pointermove', (e) => {
    if (!down) return;
    // Only a drag past a few pixels, so a slightly shaky click on a banner still
    // opens it rather than being swallowed as a swipe.
    if (!dragged && Math.abs(e.clientX - startX) > 4) {
      dragged = true;
      marquee.classList.add('is-dragging');
      // Capture only once it is genuinely a drag: capturing on pointerdown
      // retargets the click that follows a plain tap, and the banner would
      // never receive it.
      try { marquee.setPointerCapture(e.pointerId); } catch (err) { /* not capturable */ }
    }
    if (!dragged) return;
    e.preventDefault();
    marquee.scrollLeft = startScroll - (e.clientX - startX);
  });
  function release(e) {
    if (!down) return;
    down = false;
    marquee.classList.remove('is-dragging');
    try { marquee.releasePointerCapture(e.pointerId); } catch (err) { /* already gone */ }
  }
  marquee.addEventListener('pointerup', release);
  marquee.addEventListener('pointercancel', release);

  // Click a banner to see it full size.
  marquee.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img || !lightboxOpen) return;
    if (dragged) { dragged = false; return; }   // that click ended a swipe
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
