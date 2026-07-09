#!/bin/sh
set -e

# APP_KEY est fourni directement via les variables d'environnement Render
# (pas de fichier .env en production, donc pas de "php artisan key:generate" ici).

# Met en cache la config et les routes (performance)
php artisan config:cache
php artisan route:cache

# Applique les migrations sur la base de données de production (Postgres fourni par Render)
php artisan migrate --force

# Peuple la base si elle est vide (sans danger si déjà peuplée, voir DatabaseSeeder.php)
php artisan db:seed --force

exec "$@"