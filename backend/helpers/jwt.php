<?php
declare(strict_types=1);

final class Jwt
{
    public static function encode(array $payload, string $secret): string
    {
        $header  = ['alg' => 'HS256', 'typ' => 'JWT'];
        $h = self::b64(json_encode($header, JSON_UNESCAPED_SLASHES));
        $p = self::b64(json_encode($payload, JSON_UNESCAPED_SLASHES));
        $sig = hash_hmac('sha256', "$h.$p", $secret, true);
        return "$h.$p." . self::b64($sig);
    }

    public static function decode(string $token, string $secret): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;
        [$h, $p, $s] = $parts;
        $expected = self::b64(hash_hmac('sha256', "$h.$p", $secret, true));
        if (!hash_equals($expected, $s)) return null;

        $payload = json_decode(self::b64d($p), true);
        if (!is_array($payload)) return null;
        if (isset($payload['exp']) && time() >= $payload['exp']) return null;

        return $payload;
    }

    private static function b64(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function b64d(string $data): string
    {
        $pad = 4 - (strlen($data) % 4);
        if ($pad < 4) $data .= str_repeat('=', $pad);
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
