#!/bin/bash
set -e

cd /var/www

# Tạo .env từ biến môi trường Railway nếu chưa có
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Ghi các biến Railway vào .env (Railway inject qua env vars)
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
