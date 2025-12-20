// Google Apps Script endpoint URL (thay bằng URL script của bạn)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzYe-pO5kQ5UX-09LZAkdT7tEmI5SM2LXTFD4nqmtqmpnQbv72Oy4MSayJerWISUOROvQ/exec';

document.addEventListener('DOMContentLoaded', function(){
  // ...existing code...

  // Simple client-side validation UX & gửi Google Sheet
  const form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', async (ev)=>{
      const required = form.querySelectorAll('[required]');
      let ok = true;
      required.forEach(f => {
        if(!f.value.trim()){ ok = false; f.style.outline = '2px solid rgba(255,92,92,0.18)'; setTimeout(()=> f.style.outline = '', 1200); }
      });
      if(!ok){
        ev.preventDefault();
        alert('Vui lòng điền đầy đủ các trường bắt buộc.');
        return;
      }
      ev.preventDefault();
      const data = new FormData(form);
      const obj = {};
      data.forEach((v, k) => obj[k] = v);
      try {
        const res = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(obj)
        });
        if(res.ok){
          alert('Gửi thành công! Chúng tôi sẽ liên hệ lại sớm.');
          form.reset();
        } else {
          alert('Có lỗi khi gửi. Vui lòng thử lại hoặc email trực tiếp.');
        }
      } catch(e){
        alert('Không thể gửi. Vui lòng kiểm tra kết nối hoặc email trực tiếp.');
      }
    });
  }
});
