#!/bin/sh
set -e

# Génère la clé d'application si elle n'est pas déjà définie (via les variables d'env de Render)
if [ -z "$APP_KEY" ]; then
  php artisan key:generate --force
fi

# Met en cache la config et les routes (performance)
php artisan config:cache
php artisan route:cache

# Applique les migrations sur la base de données de production (Postgres fourni par Render)
php artisan migrate --force

exec "$@"
