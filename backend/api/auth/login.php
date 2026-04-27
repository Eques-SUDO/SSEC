<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/jwt.php';
require_once __DIR__ . '/../../helpers/http.php';

$cfg = require __DIR__ . '/../../config/config.php';

applyCors($cfg['cors']['allowed_origins']);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    jsonResponse(405, ['error' => 'method_not_allowed']);
}

$input    = readJsonBody();
$email    = trim((string)($input['email']    ?? ''));
$password = (string)($input['password'] ?? '');

if ($email === '' || $password === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(400, ['error' => 'invalid_input']);
}

try {
    $stmt = Database::connection()->prepare(
        'SELECT id, nom, prenom, email, password, role, statut
         FROM employee WHERE email = :email LIMIT 1'
    );
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();
} catch (Throwable $e) {
    jsonResponse(500, ['error' => 'server_error']);
}

if (!$user || !password_verify($password, $user['password'])) {
    jsonResponse(401, ['error' => 'invalid_credentials']);
}

if ($user['statut'] !== 'actif') {
    jsonResponse(403, ['error' => 'account_disabled']);
}

$now = time();
$token = Jwt::encode([
    'iss'  => $cfg['jwt']['issuer'],
    'aud'  => $cfg['jwt']['audience'],
    'sub'  => (int)$user['id'],
    'role' => $user['role'],
    'iat'  => $now,
    'exp'  => $now + $cfg['jwt']['ttl_seconds'],
], $cfg['jwt']['secret']);

jsonResponse(200, [
    'token' => $token,
    'user'  => [
        'id'     => (int)$user['id'],
        'nom'    => $user['nom'],
        'prenom' => $user['prenom'],
        'email'  => $user['email'],
        'role'   => $user['role'],
    ],
]);
