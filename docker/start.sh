#!/bin/bash
set -e

cd /var/www

# Tạo .env trống nếu chưa có (để Laravel lấy 100% biến từ Render)
if [ ! -f .env ]; then
    touch .env
fi

# Xóa config cache cũ để Laravel đọc trực tiếp từ biến môi trường của Render
# (Không dùng config:cache vì có thể gây lỗi nếu thiếu biến môi trường)
php artisan config:clear
php artisan route:cache
php artisan view:cache

# Chạy migrations
php artisan migrate --force

# Tạo storage symlink nếu chưa có
php artisan storage:link || true

# Thay đổi port của Nginx theo biến môi trường PORT của Render
if [ -n "$PORT" ]; then
    sed -i "s/listen 80;/listen ${PORT};/g" /etc/nginx/sites-available/default
    sed -i "s/listen \[::\]:80;/listen [::]:${PORT};/g" /etc/nginx/sites-available/default
fi

# Khởi động Reverb WebSocket server ở background (nếu BROADCAST_CONNECTION=reverb)
if [ "$BROADCAST_CONNECTION" = "reverb" ]; then
    echo "==> Starting Reverb WebSocket server..."
    php artisan reverb:start --host=0.0.0.0 --port=${REVERB_PORT:-8080} &
fi

# Khởi động supervisor (quản lý PHP-FPM + Nginx)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
