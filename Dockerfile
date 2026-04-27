# ===== Single-stage: PHP 8.2 + Node 20 + Nginx =====
FROM php:8.2-fpm

# --- System dependencies ---
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev \
    zip unzip git curl nginx supervisor \
    && rm -rf /var/lib/apt/lists/*

# --- PHP extensions ---
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd sockets

# --- Node.js 20 ---
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# --- Composer ---
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# --- Copy source ---
COPY . .

# --- PHP dependencies ---
RUN composer install --no-dev --optimize-autoloader --no-interaction

# --- Frontend build (PHP is available here for wayfinder/laravel-vite-plugin) ---
RUN cp .env.example .env \
    && php artisan key:generate \
    && npm ci \
    && npm run build \
    && rm .env

# --- Permissions ---
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# --- Nginx + Supervisor config ---
COPY docker/nginx.conf /etc/nginx/sites-available/default
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# --- Startup script ---
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

EXPOSE 80

CMD ["/usr/local/bin/start.sh"]
