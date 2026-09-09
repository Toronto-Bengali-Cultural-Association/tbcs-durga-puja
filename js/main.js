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
      setStatus('Thanks — your message has been sent.', 'ok');
      return;
    }

    // No endpoint configured — hand off to the visitor's mail client. Say so out
    // loud: if they have no mail app registered, setting location.href does
    // nothing visible, and silence reads as a broken form.
    if (!endpoint) {
      const body = `${value('message')}\n\n— ${value('fullName')} (${value('email')})`;
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
        setStatus('Thanks — we got your message and will reply by email.', 'ok');
      })
      .catch(() => {
        setStatus('Sorry, that didn’t go through. Please email tbcscanada@gmail.com directly.', 'error');
      })
      .finally(() => { button.disabled = false; });
  });
}

/* Sponsor marquee — auto-scrolls, and stays draggable/swipeable while it does.
   Driven by scrollLeft rather than a CSS transform so that the automatic motion
   and the visitor's own scrolling are the same mechanism and cannot fight. */
function initSponsorShow() {
  const marquee = document.querySelector('[data-sponsor-marquee]');
  if (!marquee) return;
  const track = marquee.querySelector('.sponsor-track');
  if (!track || !track.children.length) return;

  const wrap = marquee.closest('.sponsor-marquee-wrap');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // How fast the sponsor row drifts, in pixels per second.
  // Lower = slower. 30 is a gentle drift, 60 is brisk.
  const SCROLL_SPEED = 30;

  let half = 0;                    // width of one copy of the row
  let paused = true;
  let idleTimer = null;
  let frame = null;
  let lastFrame = 0;

  // Both the auto-scroll and the scroll listener can hit the seam on the same
  // frame; without this flag they take turns wrapping each other and the row
  // ping-pongs. The wrap is announced here and the listener skips that event.
  let selfWrapped = false;

  function loop(now) {
    // Advance by elapsed time, not by a fixed step per frame — otherwise the row
    // moves twice as fast on a 120Hz screen as on a 60Hz one.
    const elapsed = lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0;
    lastFrame = now;
    if (!paused && half > 0 && elapsed) {
      marquee.scrollLeft += SCROLL_SPEED * elapsed;
      if (marquee.scrollLeft >= half) {
        selfWrapped = true;
        marquee.scrollLeft -= half;   // identical copy, so the jump is invisible
      }
    }
    frame = requestAnimationFrame(loop);
  }

  // Any manual interaction wins; auto resumes once they stop.
  function nudge(ms) {
    paused = true;
    clearTimeout(idleTimer);
    if (!still) idleTimer = setTimeout(() => { paused = false; }, ms);
  }

  function begin() {
    if (track.dataset.cloned) return;
    [...track.children].forEach((node) => {
      const copy = node.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');   // duplicates are decorative
      track.appendChild(copy);
    });
    track.dataset.cloned = '1';
    half = track.scrollWidth / 2;
    paused = still;
    if (!frame) frame = requestAnimationFrame(loop);
  }

  // Let the visitor scroll backwards past the start and come out at the end.
  marquee.addEventListener('scroll', () => {
    if (!half) return;
    if (selfWrapped) { selfWrapped = false; return; }
    if (marquee.scrollLeft <= 0) {
      selfWrapped = true;
      marquee.scrollLeft = half;
    }
  }, { passive: true });

  marquee.addEventListener('mouseenter', () => { paused = true; });
  marquee.addEventListener('mouseleave', () => { if (!still) paused = false; });
  marquee.addEventListener('focusin', () => { paused = true; });
  marquee.addEventListener('focusout', () => { if (!still) paused = false; });
  marquee.addEventListener('wheel', () => nudge(1500), { passive: true });
  marquee.addEventListener('touchstart', () => { paused = true; }, { passive: true });
  marquee.addEventListener('touchend', () => nudge(2500), { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) paused = true; else if (!still) paused = false;
  });

  if (wrap) {
    const step = () => Math.max(220, marquee.clientWidth * 0.7);
    wrap.querySelector('.prev').addEventListener('click', () => {
      marquee.scrollBy({ left: -step(), behavior: 'smooth' }); nudge(2500);
    });
    wrap.querySelector('.next').addEventListener('click', () => {
      marquee.scrollBy({ left: step(), behavior: 'smooth' }); nudge(2500);
    });
  }

  // Desktop drag — a mouse cannot swipe, and a trackpad user may not think to.
  let down = false, startX = 0, startScroll = 0;
  marquee.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return;      // native touch scrolling is better
    down = true; startX = e.clientX; startScroll = marquee.scrollLeft;
    paused = true;
    marquee.classList.add('is-dragging');
    marquee.setPointerCapture(e.pointerId);
  });
  marquee.addEventListener('pointermove', (e) => {
    if (!down) return;
    e.preventDefault();
    marquee.scrollLeft = startScroll - (e.clientX - startX);
  });
  function release(e) {
    if (!down) return;
    down = false;
    marquee.classList.remove('is-dragging');
    try { marquee.releasePointerCapture(e.pointerId); } catch (err) { /* already gone */ }
    nudge(2500);
  }
  marquee.addEventListener('pointerup', release);
  marquee.addEventListener('pointercancel', release);

  // Widths are only real once the lazy-loaded banners are on screen and decoded.
  function whenLoaded() {
    const pending = [...track.querySelectorAll('img')].filter((i) => !i.complete);
    if (!pending.length) { begin(); return; }
    let left = pending.length;
    pending.forEach((img) => {
      const done = () => { if (--left === 0) begin(); };
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
    setTimeout(() => begin(), 5000);   // never let one stuck image hold the row
  }

  if (!('IntersectionObserver' in window)) { whenLoaded(); return; }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      whenLoaded();
    });
  }, { rootMargin: '200px' });
  observer.observe(marquee);
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
