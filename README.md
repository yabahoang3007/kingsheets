# Kingsheets — Giao diện landing page (phiên bản nâng cấp)

Mô tả: Phiên bản giao diện thu hút, hiện đại cho Kingsheets — dịch vụ xử lý dữ liệu lớn. Thiết kế responsive, animation nhẹ, không cần tài nguyên ngoài (SVG inline).

Tệp:
- index.html — trang landing (brand: Kingsheets, chủ sở hữu: Phạm Nhật Hoàng).
- styles.css — giao diện mới, responsive.
- script.js — JS cho menu mobile, reveal animation, form UX.
  
Cách dùng:
1. Tạo thư mục dự án, thêm 3 file trên.
2. Mở `index.html` trên trình duyệt hoặc chạy static server:
   - `python -m http.server 8000`
   - `npx serve .`
3. Cập nhật email / action form:
   - Thay `action="https://formspree.io/f/your-form-id"` bằng Formspree ID hoặc endpoint backend.
4. Tùy chỉnh logo / text / testimonial theo nhu cầu.

Gợi ý tối ưu tiếp theo (mình có thể làm cho bạn):
- Thêm logo SVG chính thức (nếu bạn cung cấp) và favicon.
- Thêm OpenGraph meta tags (og:image, og:title) để chia sẻ đẹp trên LinkedIn/Facebook.
- Chuyển sang Next.js + TypeScript để hỗ trợ SEO, page-level meta, và blog.
- Tạo GitHub Pages / Netlify deploy config và CI (workflow).

Muốn mình chỉnh màu sắc, font, hoặc thêm animation/case-study chi tiết nào nữa không? Nếu có assets (logo, ảnh), upload hoặc gửi link mình sẽ tích hợp luôn.

LICENSE:
MIT License

Copyright (c) 2025 Pham Nhat Hoang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

(The full MIT license text continues...)
