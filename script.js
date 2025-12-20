// Minimal JS: mobile nav toggle, reveal on scroll, simple validation UX
document.addEventListener('DOMContentLoaded', function(){
  // Mobile nav toggle
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  toggle && toggle.addEventListener('click', ()=> {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    if(nav.style.display === 'flex'){ nav.style.display = ''; }
    else { nav.style.display = 'flex'; nav.style.flexDirection = 'column'; nav.style.gap = '0.6rem'; }
  });

  // Reveal on scroll using IntersectionObserver
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, {threshold: 0.12});

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const target = document.querySelector(a.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        // close mobile nav if open
        if(window.innerWidth < 800 && nav.style.display === 'flex'){
          nav.style.display = 'none';
          toggle && toggle.setAttribute('aria-expanded', 'false');
        }
      }
    })
  });

  // Simple client-side validation UX
  const form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', (ev)=>{
      const required = form.querySelectorAll('[required]');
      let ok = true;
      required.forEach(f => {
        if(!f.value.trim()){ ok = false; f.style.outline = '2px solid rgba(255,92,92,0.18)'; setTimeout(()=> f.style.outline = '', 1200); }
      });
      if(!ok){
        ev.preventDefault();
        alert('Vui lòng điền đầy đủ các trường bắt buộc.');
      } else {
        // Form will open email client
        alert('Cảm ơn! Email client sẽ mở để gửi yêu cầu tư vấn.');
      }
    });
  }
});
