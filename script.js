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

// Điền UTM vào các hidden fields của cả hai form
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
      message:      formData.message || '',
      utm_source:   formData.utm_source || '',
      utm_campaign: formData.utm_campaign || ''
    })
  });
  // no-cors không đọc được response — coi như thành công
}

// Xử lý submit cho một form
function setupForm(formId, successId) {
  const form = document.getElementById(formId);
  const successEl = document.getElementById(successId);
  if (!form || !successEl) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate
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

    // Collect data
    const data = {};
    new FormData(form).forEach((v, k) => data[k] = v);

    // Loading state
    const btn = form.querySelector('.btn-submit');
    const btnText    = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    btn.disabled = true;
    if (btnText)    btnText.hidden = true;
    if (btnLoading) btnLoading.hidden = false;
    if (!btnText && !btnLoading) btn.textContent = 'Đang gửi...';

    try {
      await submitContact(data);
    } catch (e) {
      console.error('Submit error:', e);
    }

    form.hidden = true;
    successEl.hidden = false;
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Facebook Pixel — fire Lead event nếu có pixel
    if (typeof fbq === 'function') fbq('track', 'Lead');

    // Google Ads conversion — thay CONVERSION_ID nếu có
    // if (typeof gtag === 'function') gtag('event', 'conversion', { send_to: 'AW-XXXXXXXXX/XXXXX' });
  });
}

// Sticky bar: ẩn khi form đang trong viewport
function setupStickyBar() {
  const bar     = document.getElementById('sticky-bar');
  const formTop = document.getElementById('form-top');
  if (!bar || !formTop) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      bar.style.opacity    = entry.isIntersecting ? '0' : '1';
      bar.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
    });
  }, { threshold: 0.3 });
  io.observe(formTop);
}

// Smooth scroll cho anchor links
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72; // header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// Reveal on scroll
function setupReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  fillUTMFields();
  setupForm('lead-form',   'form-success');
  setupForm('lead-form-2', 'form-success-2');
  setupStickyBar();
  setupSmoothScroll();
  setupReveal();
});
