FROM php:8.4-fpm-alpine

# Install minimal dependencies
RUN apk add --no-cache \
    bash \
    mysql-client \
    $PHPIZE_DEPS

# Install PHP extensions (only essentials)
RUN docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    opcache

# Install PCOV for code coverage (lightweight alternative to Xdebug)
RUN pecl install pcov \
    && docker-php-ext-enable pcov

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy PHP config
COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini

USER www-data

EXPOSE 9000

CMD ["php-fpm"]
