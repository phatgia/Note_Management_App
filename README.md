# Note Management System

> **Lưu ý:** Đây là đồ án môn học **Lập trình Web** tại Trường Đại học Tôn Đức Thắng. Dự án tập trung vào việc xây dựng hệ thống quản lý ghi chú hiện đại, hỗ trợ cộng tác và đồng bộ hóa dữ liệu thời gian thực.

[![Backend: Laravel 11](https://img.shields.io/badge/Backend-Laravel_11-red.svg)](https://laravel.com/)
[![Frontend: React + Inertia](https://img.shields.io/badge/Frontend-React_Inertia-blue.svg)](https://inertiajs.com/)
[![DevOps: Docker](https://img.shields.io/badge/DevOps-Docker-2496ED.svg)](https://www.docker.com/)
[![Deploy: Render](https://img.shields.io/badge/Deploy-Render-46E3B7.svg)](https://render.com/)

## Giới thiệu

**Note Management System** là ứng dụng Fullstack hiện đại, được xây dựng theo mô hình **Monolith + Inertia.js**. Inertia.js đóng vai trò "cầu nối" mượt mà giữa phía Client (React) và Server (Laravel), mang lại trải nghiệm SPA nhưng vẫn tận dụng được toàn bộ sức mạnh của Laravel (routing, auth, middleware...).

Dự án được đóng gói bằng **Docker** và triển khai thực tế trên **Render (PaaS)**, sử dụng **MySQL** trên Aiven Cloud và **WebSockets** (Laravel Reverb) cho tính năng cộng tác thời gian thực.

## Nhóm phát triển

| MSSV | Họ và Tên | Vai trò |
|---|---|---|
| 52400148 | Trần Gia Phát | Backend Developer & DevOps |
| 52400005 | Ngô Khánh Bình | Frontend Developer & UI/UX |

**Giảng viên hướng dẫn:** ThS. Dương Hữu Phước

## Tính năng nổi bật

- 📝 **Quản lý ghi chú:** Tạo, sửa, xóa, ghim ghi chú với trình soạn thảo văn bản phong phú (Rich Text Editor)
- 🔒 **Bảo vệ bằng mật khẩu:** Khóa/mở khóa ghi chú riêng tư với mật khẩu được mã hóa bằng Bcrypt
- 🤝 **Chia sẻ & Phân quyền:** Chia sẻ ghi chú với người khác theo vai trò Viewer / Editor
- ⚡ **Cộng tác thời gian thực:** Nhiều người cùng chỉnh sửa một ghi chú với WebSockets (Laravel Reverb)
- 🏷️ **Nhãn & Tìm kiếm:** Phân loại ghi chú bằng nhãn màu sắc và lọc theo nhãn
- 📱 **Responsive & PWA:** Giao diện tương thích mọi thiết bị, hỗ trợ cài đặt như ứng dụng native và hoạt động offline
- 📧 **Xác thực OTP:** Gửi mã OTP 6 số qua email khi đăng ký tài khoản

## Hướng dẫn cài đặt (Local - Docker)

### Điều kiện tiên quyết

- Máy tính đã cài đặt **Docker Desktop**

### Các bước thực hiện

**Bước 1: Clone dự án**
```bash
git clone https://github.com/phatgia/Note_Management_App.git
cd Note_Management_App
```

**Bước 2: Tạo file cấu hình môi trường**
```bash
# Windows (PowerShell)
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

**Bước 3: Cài đặt thư viện PHP (vendor)**
```bash
docker-compose run --rm app composer install
```

**Bước 4: Tạo Application Key**
```bash
docker-compose run --rm app php artisan key:generate
```

**Bước 5: Sinh các file TypeScript cho Wayfinder (routing)**
```bash
docker-compose run --rm app php artisan wayfinder:generate --with-form
```

**Bước 6: Khởi động toàn bộ hệ thống**
```bash
docker-compose up -d
```

**Bước 7: Chạy Migration và Seed dữ liệu mẫu**
```bash
docker-compose exec app php artisan migrate --seed
```

**Bước 8: Tạo Storage Symlink (để hiển thị ảnh đính kèm)**
```bash
docker-compose exec app php artisan storage:link
```

**Bước 9: Truy cập ứng dụng**

| Dịch vụ | URL |
|---|---|
| 🌐 Ứng dụng chính | http://localhost:8000 |
| 📬 Hộp thư giả lập (Mailpit) | http://localhost:8025 |

**Tài khoản mặc định (sau khi seed):**
- Email: `test@example.com`
- Mật khẩu: `password`

> [!NOTE]
> **Lần đầu khởi động:** Container `laravel_node` cần tải `npm install` (~2-5 phút). Frontend sẽ sẵn sàng sau khi log hiện `VITE ready in ... ms`.

---

## Demo Trực Tuyến (Online Preview)

Dự án đã được triển khai sẵn trên **Render**. Bạn có thể truy cập và trải nghiệm trực tiếp tại:

👉 **[https://note-management-app-1aam.onrender.com](https://note-management-app-1aam.onrender.com)**

> [!IMPORTANT]
> **Lưu ý lần truy cập đầu tiên:** Vì dự án sử dụng gói **Render Free**, server sẽ tự động "ngủ" sau khi không có lượt truy cập. Lần đầu vào link, vui lòng đợi khoảng **30 - 60 giây** để server khởi động lại. Các lần sau sẽ mượt mà và tức thì.

## Công nghệ sử dụng

| Hạng mục | Công nghệ |
|---|---|
| Backend | Laravel 11, PHP 8.2 |
| Frontend | React 19, TypeScript, Inertia.js |
| Styling | Tailwind CSS v4, Shadcn UI |
| Realtime | Laravel Reverb (WebSockets) |
| Database | MySQL (Aiven Cloud) |
| DevOps | Docker, Nginx, Supervisor |
| Deploy | Render (PaaS) |
| PWA | Service Worker, IndexedDB |
