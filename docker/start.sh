#!/bin/bash
set -e

cd /var/www

# Tạo .env trống nếu chưa có (để Laravel lấy 100% biến từ Render)
if [ ! -f .env ]; then
    touch .env
fi

# Ghi các biến môi trường vào cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Chạy migrations
php artisan migrate --force

# Tạo storage symlink nếu chưa có
php artisan storage:link || true

# Thay đổi port của Nginx theo biến môi trường PORT của Railway
if [ -n "$PORT" ]; then
    sed -i "s/listen 80;/listen ${PORT};/g" /etc/nginx/sites-available/default
    sed -i "s/listen \[::\]:80;/listen \[::\]:${PORT};/g" /etc/nginx/sites-available/default
fi

# Khởi động supervisor (quản lý PHP-FPM + Nginx)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
