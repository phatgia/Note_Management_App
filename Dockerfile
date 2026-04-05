FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd


COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
# Chạy lệnh này để tạo bảng DB và bật server web Laravel lên
CMD sh -c "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"