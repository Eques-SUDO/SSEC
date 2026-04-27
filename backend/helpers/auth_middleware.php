<?php
declare(strict_types=1);

require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/http.php';

function requireAuth(array $cfg, array $allowedRoles = []): array
{
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (stripos($auth, 'Bearer ') !== 0) {
        jsonResponse(401, ['error' => 'missing_token']);
    }
    $token = substr($auth, 7);
    $payload = Jwt::decode($token, $cfg['jwt']['secret']);
    if ($payload === null) {
        jsonResponse(401, ['error' => 'invalid_token']);
    }
    if ($allowedRoles && !in_array($payload['role'] ?? '', $allowedRoles, true)) {
        jsonResponse(403, ['error' => 'forbidden']);
    }
    return $payload;
}
