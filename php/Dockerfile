FROM php:fpm-alpine 

COPY php.ini /usr/local/etc/php/

COPY --from=composer:2.0 /usr/bin/composer /usr/bin/composer

WORKDIR /app
