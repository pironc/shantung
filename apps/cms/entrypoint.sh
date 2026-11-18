#!/bin/sh
set -e
cd /opt/drupal

# Install only once: the database lives in the postgres volume, so later boots skip this.
# The site's whole structure comes from the YAML in config/sync (export changes with `drush config:export`).
if ! drush status --field=bootstrap 2>/dev/null | grep -q Successful; then
  drush site:install --existing-config -y --account-pass=admin
fi

# Sample content: only writes what is missing.
drush php:script seed/seed.php

chown -R www-data:www-data web/sites/default/files
exec docker-php-entrypoint "$@"
