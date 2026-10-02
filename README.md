# 🎄 Merry Christmas - Thiệp Giáng Sinh Tương Tác 3D 🎅✨

<p align="center">
  <a href="README.md"><b>🇻🇳 Tiếng Việt</b></a> &nbsp;|&nbsp; 
  <a href="README_EN.md"><b>🇺🇸 English</b></a>
</p>

<p align="center">
  <a href="https://dungautomation-dev.github.io/thiepgiangsinh/"><img src="https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-00e5ff?style=for-the-badge&logo=githubpages&logoColor=black" alt="Live Demo"></a>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Responsive-Mobile%20%26%20Desktop-success?style=for-the-badge" alt="Responsive">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
</p>

<p align="center">
  🌐 <strong>Trải nghiệm trực tuyến tại:</strong><br>
  👉 <a href="https://dungautomation-dev.github.io/thiepgiangsinh/"><strong>https://dungautomation-dev.github.io/thiepgiangsinh/</strong></a>
</p>

<p align="center">
  <strong>Trang web thiệp Giáng sinh tương tác 3D lãng mạn — Tích hợp hiệu ứng mở quà, tuyết rơi canvas, bức thư gõ chữ tự động, playlist âm nhạc đĩa than và bộ công cụ cá nhân hóa dành tặng người yêu thương! 💙🎁</strong>
</p>

---

## 🌟 Tính Năng Nổi Bật

- 🎁 **Hộp quà 3D tương tác (Surprise Unboxing)**: Mở màn với hộp quà lơ lửng, click mở bung pháo hoa confetti và âm thanh chuông ngân mở ra thiệp 3D kính mờ (Glassmorphism).
- 💌 **Thư tay gõ chữ tự động (Typewriter Effect)**: Lời chúc xuất hiện từng ký tự mềm mại, hỗ trợ đổi lời chúc ngẫu nhiên hoặc soạn lời chúc riêng.
- ❄️ **Động cơ tuyết rơi Canvas vật lý**: Hiệu ứng tuyết rơi 60fps mượt mà, lượn theo hướng di chuột, tích hợp chế độ **Bão tuyết Bắc Cực (❄️)**.
- 🎶 **Trình phát nhạc đĩa than (Festive Music Dock)**: Danh sách phát các bản nhạc Giáng sinh du dương, đĩa than xoay tròn theo nhịp điệu, hỗ trợ tua bài và đổi bài linh hoạt.
- 🎨 **Tùy biến thông tin người nhận (Customizer)**: Tự do đổi họ tên, biệt danh, upload ảnh đại diện từ máy tính, đổi link Facebook, Instagram.
- 🔗 **Tạo Link Tặng Thông Minh (Shareable URL)**: Mã hóa thông tin thành đường link có tham số (`?name=...&msg=...`) để gửi tặng trực tiếp qua tin nhắn.
- ⏰ **Đồng hồ đếm ngược Giáng sinh**: Đếm ngược thời gian chính xác từng giây tới đêm Noel (24/12).
- 📱 **100% Responsive**: Tối ưu hiển thị hoàn hảo trên điện thoại di động, máy tính bảng và màn hình máy tính.

---

## 📂 Cấu Trúc Dự Án (Project Structure)

Dự án được tổ chức theo chuẩn kiến trúc Frontend modular, phân tách rõ ràng giữa cấu trúc (HTML), giao diện (CSS), tài nguyên đa phương tiện (Images/Audio) và các module xử lý (JavaScript):

```text
thiepgiangsinh/
├── assets/
│   ├── audio/
│   │   └── your_music.mp3       # Nhạc nền Giáng sinh chất lượng cao
│   ├── css/
│   │   └── style.css            # Stylesheet toàn bộ giao diện, animations & responsive
│   ├── images/
│   │   ├── avatar.png           # Ảnh đại diện mặc định
│   │   ├── christmas_card.png   # Ảnh nền không gian đêm Noel
│   │   ├── christmas_tree.png   # Cây thông trang trí
│   │   ├── fb.png               # Icon Facebook
│   │   ├── ig.png               # Icon Instagram
│   │   └── new_gift_box_image.png # Hộp quà 3D mở màn
│   └── js/
│       ├── app.js               # Logic điều khiển chính, modal, typewriter & countdown
│       ├── audio.js             # Quản lý trình phát nhạc & hiệu ứng âm thanh Web Audio API
│       └── snow.js              # Động cơ vật lý tuyết rơi canvas & pháo hoa confetti
├── .gitignore                   # Cấu hình bỏ qua các file tạm/hệ thống
├── index.html                   # Trang chủ hiển thị thiệp Giáng sinh
├── LICENSE                      # Giấy phép mã nguồn mở MIT
└── README.md                    # Tài liệu giới thiệu & hướng dẫn sử dụng
```

---

## 🚀 Hướng Dẫn Sử Dụng

### 1. Chạy trực tiếp trên máy tính
1. Clone dự án về máy:
   ```bash
   git clone https://github.com/Dungauto/thiepgiangsinh.git
   ```
2. Mở trực tiếp file `index.html` bằng bất kỳ trình duyệt nào (Chrome, Edge, Safari, Firefox).

---

### 2. Triển khai Web Online Miễn Phí (GitHub Pages)
1. Đẩy mã nguồn lên repository GitHub của bạn.
2. Truy cập **Settings** > **Pages** trên repository.
3. Tại phần **Branch**, chọn nhánh **`main`** và thư mục **`/ (root)`**, sau đó bấm **Save**.
4. Website sẽ online tại địa chỉ:
   ```
   https://<username>.github.io/thiepgiangsinh/
   ```

---

## 💌 Bảng Tham Số Tùy Biến Qua URL (URL Parameters)

Bạn có thể tạo nhanh link thiệp cá nhân hóa bằng cách thêm các tham số vào URL:

| Tham số | Ý nghĩa | Ví dụ |
| :--- | :--- | :--- |
| `name` | Họ tên người nhận | `?name=Hương%20Giang` |
| `nick` | Biệt danh | `&nick=Giang%20Milk` |
| `msg` | Lời chúc Giáng sinh | `&msg=Chúc%20em%20Noel%20ấm%20áp!` |
| `fb` | Link Facebook cá nhân | `&fb=https://facebook.com/...` |
| `ig` | Link Instagram | `&ig=https://instagram.com/...` |
| `track` | Số thứ tự bài hát (0 - 3) | `&track=0` |

👉 **Ví dụ đường link hoàn chỉnh**:
```
https://dungauto.github.io/thiepgiangsinh/?name=Hương%20Giang&nick=Công%20Chúa&msg=Noel%20ấm%20áp%20nhé%20em!
```

---

## 🛠️ Công Nghệ Phát Triển

- **Semantic HTML5**: Chuẩn SEO và tối ưu hóa trải nghiệm người dùng.
- **Modern CSS3**: Glassmorphism, CSS Grid, Flexbox, Keyframe Animations, CSS Variables.
- **Vanilla JavaScript (ES6+)**: Xử lý Canvas 2D Physics, Web Audio API Sound Synthesis, LocalStorage & URLSearchParams.
- **Font Awesome 6 & Google Fonts**: Phông chữ nghệ thuật `Dancing Script`, `Playfair Display`, `Montserrat`.

---

## 👨‍💻 Tác Giả & Bản Quyền

- **Tác giả**: [Dung Automation](https://github.com/Dungauto)
- **Email**: dungautomation@gmail.com
- **Giấy phép**: Phát hành theo giấy phép [MIT License](LICENSE).

<p align="center">
  💙 <em>Chúc bạn và gia đình một mùa Giáng Sinh an lành, ấm áp và hạnh phúc!</em> ❄️🎄
</p>
