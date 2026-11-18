# Official image ships PHP 8.4, Apache, Composer and pdo_pgsql. No php8.3 variant exists for Drupal 11.4.
FROM drupal:11.4-php8.4-apache-bookworm

# Drush shells out to psql for some database commands
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/drupal
RUN COMPOSER_ALLOW_SUPERUSER=1 composer require drush/drush:^13 --no-interaction
ENV PATH="/opt/drupal/vendor/bin:${PATH}"

COPY settings.php web/sites/default/settings.php
COPY seed seed
COPY entrypoint.sh /usr/local/bin/shantung-entrypoint
ENTRYPOINT ["shantung-entrypoint"]
CMD ["apache2-foreground"]
