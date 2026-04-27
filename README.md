# [Note-Management-System]

> **Lưu ý:** Đây là đồ án môn học [Lập trình web] tại [Trường Đại học Tôn Đức Thắng]. Dự án tập trung vào việc xây dựng hệ thống quản lý thông tin hiện đại, hỗ trợ đồng bộ hóa dữ liệu thời gian thực.

[![Architecture: Decoupled](https://img.shields.io/badge/Architecture-Decoupled-orange.svg)](https://en.wikipedia.org/wiki/Multitier_architecture)
[![Backend: Laravel 11](https://img.shields.io/badge/Backend-Laravel_11-red.svg)](https://laravel.com/)
[![Frontend: React](https://img.shields.io/badge/Frontend-React_Vite-blue.svg)](https://react.dev/)
[![DevOps: Docker](https://img.shields.io/badge/DevOps-Docker_Render-blue.svg)](https://render.com/)

## Giới thiệu

**[Note-Management-System]** là một ứng dụng Fullstack hiện đại, được thiết kế theo mô hình **Decoupled Architecture**. Hệ thống sử dụng **Inertia.js** để kết nối mượt mà giữa phía Client (React) và Server (Laravel), mang lại trải nghiệm của một Single Page Application (SPA) nhưng vẫn giữ được sức mạnh của Laravel SEO và routing.

Dự án đã được tối ưu hóa để triển khai trên các nền tảng PaaS như **Render** hoặc **Railway** thông qua Dockerfile đơn tầng (Single-stage Docker build), tích hợp sẵn Nginx, PHP-FPM và Node.js trong một container duy nhất.

## Nhóm phát triển (Team Members)

- **Trần Gia Phát** - [52400148] - [Vai trò: Backend Developer & DevOps]
- **Ngô Khánh Bình** - [52400005] - [Vai trò: Frontend Developer & UI/UX]
- **Giảng viên hướng dẫn:** [Ths.Dương Hữu Phước]

## Các tính năng kỹ thuật chuyên sâu

- **Triển khai Đám mây (Cloud Native):** Cấu hình Docker tối ưu, tự động nhận diện Port từ Render/Railway, hỗ trợ Trust Proxy để xử lý lỗi HTTPS Mixed Content.
- **Xác thực OTP qua Email:** Tích hợp hệ thống gửi mã xác thực 6 số qua Gmail SMTP (Google App Password) khi người dùng đăng ký tài khoản mới.
- **Database đồng bộ:** Sử dụng MySQL (Aiven Cloud) đảm bảo dữ liệu luôn được lưu trữ an toàn và có thể truy cập từ bất cứ đâu.
- **Vite-Powered Frontend:** Tối ưu hóa tốc độ build, giao diện Responsive hoàn toàn với CSS hiện đại và các micro-animations.

## Hướng dẫn cài đặt

### Điều kiện tiên quyết:

- Máy tính đã cài đặt **Docker** và **Docker Desktop**.

### Các bước thực hiện:

1. **Clone dự án:**
    ```bash
    git clone [https://github.com/phatgia/Note_Management_App.git]
    cd [Note_Management_App]
    ```
2. **Khởi động các Container:**

    ```bash
    docker-compose up -d
    ```

3. Thiết lập Backend:
    ```bash
    docker-compose exec app cp .env.example .env
    docker-compose exec app composer install
    docker-compose exec app php artisan key:generate
    ```
4. Tạo cơ sở dữ liệu và dữ liệu mẫu
    ```bash
    docker-compose exec app php artisan migrate --seed
    ```
5. Mở khóa thư mục lưu trữ ảnh (Bắt buộc để hiện Avatar)

    ```bash
    docker-compose exec app php artisan storage:link
    ```

6. Thiết lập Frontend:
    ```bash
    docker-compose exec node npm install
    docker-compose exec node npm run dev
    ```
7. Truy cập ứng dụng:
   Truy cập: http://localhost:8000

---

## Online Preview (Demo Trực Tuyến)

Dự án đã được triển khai sẵn trên **Render**. Bạn có thể truy cập và trải nghiệm trực tiếp tại:

👉 **Link:** [https://note-management-app-1aam.onrender.com](https://note-management-app-1aam.onrender.com)

> [!IMPORTANT]
> **Lưu ý cho lần truy cập đầu tiên:** Vì dự án sử dụng gói **Render Free**, server sẽ tự động "đi ngủ" sau một thời gian không có người truy cập. Ở lần đầu tiên bạn click vào link, vui lòng đợi khoảng **30 - 50 giây** để server khởi động lại (Wake up). Các lần truy cập sau đó sẽ diễn ra mượt mà và tức thì.
