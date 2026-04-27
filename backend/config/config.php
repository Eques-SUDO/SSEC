<?php
declare(strict_types=1);

(static function (): void {
    $envFile = dirname(__DIR__) . '/.env';
    if (!is_file($envFile)) return;
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if ($line === '' || $line[0] === '#') continue;
        [$k, $v] = array_pad(explode('=', $line, 2), 2, '');
        $k = trim($k); $v = trim($v);
        if ($k === '' || getenv($k) !== false) continue;
        putenv("$k=$v");
        $_ENV[$k] = $v;
    }
})();

return [
    'db' => [
        'host'    => getenv('DB_HOST') ?: '127.0.0.1',
        'port'    => getenv('DB_PORT') ?: '3306',
        'name'    => getenv('DB_NAME') ?: 'ssec',
        'user'    => getenv('DB_USER') ?: 'root',
        'pass'    => getenv('DB_PASS') ?: '',
        'charset' => 'utf8mb4',
    ],
    'jwt' => [
        'secret'      => getenv('JWT_SECRET') ?: 'CHANGE_ME_IN_ENV',
        'issuer'      => 'ssec.api',
        'audience'    => 'ssec.web',
        'ttl_seconds' => 60 * 60 * 8,
    ],
    'cors' => [
        'allowed_origins' => [getenv('FRONTEND_ORIGIN') ?: 'http://localhost:5173'],
    ],
];
