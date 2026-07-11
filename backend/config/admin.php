<?php

// Ce fichier centralise la lecture des identifiants admin depuis le .env.
// IMPORTANT : ne jamais appeler env('ADMIN_EMAIL') directement ailleurs
// dans le code (ex: dans le Seeder) — une fois que "php artisan config:cache"
// est exécuté (c'est le cas en production, voir docker-entrypoint.sh),
// les appels à env() en dehors des fichiers config/*.php renvoient null.
// On passe donc toujours par config('admin.email') / config('admin.password').

return [
    'email' => env('ADMIN_EMAIL', 'admin@minigarage.com'),
    'password' => env('ADMIN_PASSWORD', 'admin1234'),
];