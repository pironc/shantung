#!/bin/sh
set -e
cd /opt/drupal

# Install only once: the database lives in the postgres volume, so later boots skip this.
if ! drush status --field=bootstrap 2>/dev/null | grep -q Successful; then
  if [ -f config/sync/core.extension.yml ]; then
    # Config was exported to the repo: rebuild the exact same structure from it.
    drush site:install --existing-config -y --account-pass=admin
  else
    # Nothing exported yet: plain install, plus the JSON:API the BFF reads.
    drush site:install standard -y --site-name=Shantung --account-pass=admin
    drush pm:install -y jsonapi
  fi
fi

chown -R www-data:www-data web/sites/default/files
exec docker-php-entrypoint "$@"
