<?php

// Everything comes from the environment (docker-compose.yml), so this file holds no secrets.
$databases['default']['default'] = [
  'driver' => 'pgsql',
  'namespace' => 'Drupal\\pgsql\\Driver\\Database\\pgsql',
  'autoload' => 'core/modules/pgsql/src/Driver/Database/pgsql/',
  'host' => getenv('DB_HOST'),
  'port' => 5432,
  'database' => getenv('DB_NAME'),
  'username' => getenv('DB_USER'),
  'password' => getenv('DB_PASSWORD'),
  'prefix' => '',
];

$settings['hash_salt'] = getenv('DRUPAL_HASH_SALT');

// Exported YAML config lives in the repo (apps/cms/config/sync), bind-mounted to /opt/drupal/config.
$settings['config_sync_directory'] = '../config/sync';

// localhost = browser on the host, cms = the BFF calling over the compose network.
$settings['trusted_host_patterns'] = ['^localhost$', '^cms$'];
