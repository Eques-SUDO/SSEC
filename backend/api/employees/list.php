<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/jwt.php';
require_once __DIR__ . '/../../helpers/http.php';
require_once __DIR__ . '/../../helpers/auth_middleware.php';

$cfg = require __DIR__ . '/../../config/config.php';

applyCors($cfg['cors']['allowed_origins']);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    jsonResponse(405, ['error' => 'method_not_allowed']);
}

requireAuth($cfg, ['direction', 'admin_it']);

try {
    $stmt = Database::connection()->query(
        'SELECT id, nom, prenom, email, telephone, role, statut, date_embauche
         FROM employee
         ORDER BY date_embauche DESC, id DESC'
    );
    $rows = $stmt->fetchAll();
    foreach ($rows as &$r) { $r['id'] = (int)$r['id']; }
    jsonResponse(200, ['data' => $rows]);
} catch (Throwable $e) {
    jsonResponse(500, ['error' => 'server_error']);
}
