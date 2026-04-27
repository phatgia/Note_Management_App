# ===== Single-stage: PHP 8.2 + Node 20 + Nginx =====
FROM php:8.2-fpm

# --- System dependencies ---
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev libsqlite3-dev \
    zip unzip git curl nginx supervisor \
    && rm -rf /var/lib/apt/lists/*

# --- PHP extensions (pdo_sqlite for build-time artisan calls) ---
RUN docker-php-ext-install pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd sockets

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

# --- Frontend build ---
# Use SQLite so artisan/wayfinder can run without a real DB during build
RUN cp .env.example .env \
    && sed -i 's|DB_CONNECTION=mysql|DB_CONNECTION=sqlite|' .env \
    && echo "DB_DATABASE=/var/www/database/database.sqlite" >> .env \
    && touch database/database.sqlite \
    && php artisan key:generate \
    && npm ci \
    && npm run build \
    && rm -f .env database/database.sqlite

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
