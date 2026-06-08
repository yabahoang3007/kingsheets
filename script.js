const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxbQW_27YIjrEzcqq9CnS4c7o1ls1DEwG73r0eQDwfbGMleBx0R8YNs6QDl-CoHUFnC8g/exec';

// Capture UTM params từ URL quảng cáo
function getUTMs() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source:   p.get('utm_source')   || '',
    utm_medium:   p.get('utm_medium')   || '',
    utm_campaign: p.get('utm_campaign') || '',
    utm_content:  p.get('utm_content')  || '',
    source_url:   window.location.href,
  };
}

function fillUTMFields() {
  const utms = getUTMs();
  document.querySelectorAll('input[name="utm_source"]').forEach(el => el.value = utms.utm_source);
  document.querySelectorAll('input[name="utm_medium"]').forEach(el => el.value = utms.utm_medium);
  document.querySelectorAll('input[name="utm_campaign"]').forEach(el => el.value = utms.utm_campaign);
  document.querySelectorAll('input[name="utm_content"]').forEach(el => el.value = utms.utm_content);
  document.querySelectorAll('input[name="source_url"]').forEach(el => el.value = utms.source_url);
}

async function submitContact(formData) {
  await fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name:         formData.name || '',
      phone:        formData.phone || '',
      need_type:    formData.need_type || '',
      need:         formData.need || '',
      utm_source:   formData.utm_source || '',
      utm_campaign: formData.utm_campaign || ''
    })
  });
}

function setupForm(formId, successId) {
  const form = document.getElementById(formId);
  const successEl = document.getElementById(successId);
  if (!form || !successEl) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameEl  = form.querySelector('[name="name"]');
    const phoneEl = form.querySelector('[name="phone"]');
    let valid = true;

    [nameEl, phoneEl].forEach(el => {
      if (!el || !el.value.trim()) {
        valid = false;
        el.style.borderColor = '#e74c3c';
        setTimeout(() => el.style.borderColor = '', 2000);
      }
    });
    if (!valid) {
      nameEl && !nameEl.value.trim() && nameEl.focus();
      return;
    }

    const data = {};
    new FormData(form).forEach((v, k) => data[k] = v);

    const btn = form.querySelector('.btn-submit');
    const btnText    = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    btn.disabled = true;
    if (btnText)    btnText.hidden = true;
    if (btnLoading) btnLoading.hidden = false;

    try {
      await submitContact(data);
    } catch (err) {
      console.error('Submit error:', err);
    }

    form.hidden = true;
    successEl.hidden = false;
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (typeof fbq === 'function') fbq('track', 'Lead');
    // if (typeof gtag === 'function') gtag('event', 'conversion', { send_to: 'AW-XXXXXXXXX/XXXXX' });
  });
}

// Sticky header: thêm class khi scroll
function setupStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// Hamburger menu
function setupHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Đóng menu khi click vào link
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// Sticky bar: ẩn khi form đang trong viewport
function setupStickyBar() {
  const bar     = document.getElementById('sticky-bar');
  const formTop = document.getElementById('form-top');
  if (!bar || !formTop) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bar.classList.remove('visible');
      } else {
        bar.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });
  io.observe(formTop);
}

// Back to top button
function setupBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Smooth scroll cho anchor links
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// Reveal on scroll (sections + stagger grids)
function setupReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  document.querySelectorAll('.reveal-stagger').forEach(el => io.observe(el));
}

// Progress bar animation (triggered when who-section is visible)
function setupProgressBars() {
  const fills = document.querySelectorAll('.progress-bar-fill');
  if (!fills.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fills.forEach(fill => {
          const w = fill.getAttribute('data-width') || '0';
          fill.style.width = w + '%';
        });
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const section = document.querySelector('.who-section');
  if (section) io.observe(section);
}

// Counter animation
function animateCounter(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.round(start);
    if (start >= target) clearInterval(timer);
  }, 16);
}

function setupCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          animateCounter(el, target, 2000);
        });
        io.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const section = document.querySelector('.stats-section');
  if (section) io.observe(section);
}

// FAQ Accordion
function setupAccordion() {
  document.querySelectorAll('.accordion-item').forEach(item => {
    const btn = item.querySelector('.accordion-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Đóng tất cả
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      // Mở item này nếu trước đó đóng
      if (!isActive) item.classList.add('active');
    });
  });
}

// Active nav link khi scroll
function setupActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id="top"]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
}

document.addEventListener('DOMContentLoaded', () => {
  fillUTMFields();
  setupForm('lead-form', 'form-success');
  setupStickyHeader();
  setupHamburger();
  setupStickyBar();
  setupBackToTop();
  setupSmoothScroll();
  setupReveal();
  setupProgressBars();
  setupCounters();
  setupAccordion();
  setupActiveNav();
});
