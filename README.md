# [Note-Management-System]

> **Lưu ý:** Đây là đồ án môn học [Lập trình web] tại [Trường Đại học Tôn Đức Thắng]. Dự án tập trung vào việc xây dựng hệ thống quản lý thông tin hiện đại, hỗ trợ đồng bộ hóa dữ liệu thời gian thực.

[![Architecture: Decoupled](https://img.shields.io/badge/Architecture-Decoupled-orange.svg)](https://en.wikipedia.org/wiki/Multitier_architecture)
[![Backend: Laravel 10](https://img.shields.io/badge/Backend-Laravel_10-red.svg)](https://laravel.com/)
[![Frontend: React](https://img.shields.io/badge/Frontend-React_Vite-blue.svg)](https://react.dev/)
[![DevOps: Docker](https://img.shields.io/badge/DevOps-Docker_Compose-blue.svg)](https://www.docker.com/)

## Giới thiệu

**[Note-Management-System]** là một ứng dụng Fullstack hiện đại, được thiết kế theo mô hình **Decoupled Architecture**. Hệ thống tách biệt hoàn toàn giữa phía Client (React) và Server (Laravel API), giúp tối ưu hóa hiệu năng và khả năng mở rộng.

Dự án áp dụng quy trình phát triển chuyên nghiệp, sử dụng **Docker** để chuẩn hóa môi trường triển khai, giúp giảng viên và người phát triển có thể khởi chạy hệ thống chỉ với một vài câu lệnh đơn giản mà không lo ngại về xung đột phiên bản phần mềm.

## Nhóm phát triển (Team Members)

- **Thành viên 1:** [Trần Gia Phát] - [52400148] - [Vai trò: Backend Developer & DevOps]
- **Thành viên 2:** [Ngô Khánh Bình] - [52400005] - [Vai trò: Frontend Developer & UI/UX]
- **Giảng viên hướng dẫn:** [Ths.Dương Hữu Phước]

Không chỉ dừng lại ở các chức năng CRUD cơ bản, hệ thống tích hợp các kỹ thuật xử lý Web chuyên sâu:

- **Môi trường Docker hóa toàn diện :** Đóng gói toàn bộ PHP-FPM, Nginx, MySQL và Node.js qua `Docker Compose`. Đảm bảo tính nhất quán 100% giữa máy phát triển và máy chấm bài của giảng viên.
- **Xác thực Stateless với Laravel Sanctum:** Hệ thống sử dụng Token-based Authentication để quản lý phiên làm việc, đảm bảo tính bảo mật và tối ưu hóa tài nguyên server so với cách dùng Session truyền thống.
- **Bảo mật dữ liệu :** Tích hợp Middleware kiểm soát truy cập, sử dụng `FormRequest` để validate dữ liệu chặt chẽ và cơ chế auto-escaping của React để ngăn chặn lỗi bảo mật **XSS**.
- **Vite-Powered Frontend:** Tối ưu hóa tốc độ build và Hot Module Replacement, mang lại trải nghiệm mượt mà cho người dùng cuối với kiến trúc Component-based của React.
- **RESTful API Design:** Hệ thống Endpoint được thiết kế chuẩn hóa, hỗ trợ trả về dữ liệu JSON đồng nhất, dễ dàng tích hợp thêm các nền tảng khác trong tương lai.

## Kiến trúc Hệ thống

Hệ thống tuân thủ mô hình 4-Container:

1. **Container `app` (Laravel):** Xử lý Logic nghiệp vụ và các API Endpoint.
2. **Container `node` (React):** Chạy môi trường Node.js để biên dịch và phục vụ giao diện người dùng.
3. **Container `db` (MySQL):** Lưu trữ dữ liệu hệ thống bền vững.
4. **Container `web` (Nginx):** Làm Proxy ngược điều phối yêu cầu giữa Client và API.

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
    docker-compose exec app php artisan migrate --seed
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
   Hệ thống sẽ mô phỏng gửi email. Vui lòng truy cập Hộp thư giả lập (Mailpit) tại: http://localhost:8025
