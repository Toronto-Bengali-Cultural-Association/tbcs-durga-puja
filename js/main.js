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
      setStatus('Thanks — your message has been sent.', 'ok');
      return;
    }

    // No endpoint configured — hand off to the visitor's mail client. Say so out
    // loud: if they have no mail app registered, setting location.href does
    // nothing visible, and silence reads as a broken form.
    if (!endpoint) {
      const body = `${value('Message')}\n\n— ${value('Name')} (${value('Email')})`;
      setStatus('Opening your email app… if nothing happens, please write to tbcscanada@gmail.com directly.', '');
      window.location.href =
        `mailto:tbcscanada@gmail.com?subject=${encodeURIComponent(value('Subject') || 'Message from tbcscanada.org')}` +
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
      .then(() => {
        form.reset();
        setStatus('Thanks — we got your message and will reply by email.', 'ok');
      })
      .catch(() => {
        setStatus('Sorry, that didn’t go through. Please email tbcscanada@gmail.com directly.', 'error');
      })
      .finally(() => { button.disabled = false; });
  });
}

/* Gallery lightbox */
function initLightbox() {
  const items = document.querySelectorAll('[data-lightbox]');
  const lightbox = document.querySelector('.lightbox');
  if (!items.length || !lightbox) return;

  const labelEl = lightbox.querySelector('[data-lightbox-label]');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const photoEl = lightbox.querySelector('[data-lightbox-photo]');
  const placeholderEl = lightbox.querySelector('[data-lightbox-placeholder]');

  function open(item) {
    const imgSrc = item.getAttribute('data-lightbox-img');
    const label = item.getAttribute('data-lightbox-label') || 'Photo';
    labelEl.textContent = label;
    if (imgSrc && photoEl) {
      photoEl.src = imgSrc;
      photoEl.alt = label;
      photoEl.style.display = 'block';
      if (placeholderEl) placeholderEl.style.display = 'none';
    } else {
      if (photoEl) { photoEl.style.display = 'none'; photoEl.src = ''; }
      if (placeholderEl) placeholderEl.style.display = '';
    }
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((item) => item.addEventListener('click', () => open(item)));
  closeBtn && closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}
