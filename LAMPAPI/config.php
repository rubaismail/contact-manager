<?php

declare(strict_types=1);

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$envFile = dirname(__DIR__, 2) . '/.env';
$fileEnv = [];

if (is_readable($envFile)) {
    $parsed = parse_ini_file($envFile, false, INI_SCANNER_RAW);

    if (is_array($parsed)) {
        $fileEnv = $parsed;
    }
}

$getEnv = static function (string $key, ?string $default = null) use ($fileEnv): ?string {
    $value = getenv($key);

    if ($value !== false) {
        return $value;
    }

    if (array_key_exists($key, $_ENV)) {
        return (string) $_ENV[$key];
    }

    if (array_key_exists($key, $_SERVER)) {
        return (string) $_SERVER[$key];
    }

    if (array_key_exists($key, $fileEnv)) {
        return (string) $fileEnv[$key];
    }

    return $default;
};

$databaseError = static function (string $internalMessage): void {
    error_log($internalMessage);

    http_response_code(500);

    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
    }

    echo json_encode([
        'success' => false,
        'error' => 'Database connection unavailable'
    ]);

    exit();
};

$dbHost = $getEnv('DB_HOST');
$dbPort = $getEnv('DB_PORT', '3306');
$dbName = $getEnv('DB_DATABASE');
$dbUser = $getEnv('DB_USERNAME');
$dbPassword = $getEnv('DB_PASSWORD');

foreach ([
    'DB_HOST' => $dbHost,
    'DB_DATABASE' => $dbName,
    'DB_USERNAME' => $dbUser,
    'DB_PASSWORD' => $dbPassword
] as $name => $value) {
    if ($value === null || $value === '') {
        $databaseError("Missing required environment variable: {$name}");
    }
}

if ($dbPort === null || !ctype_digit($dbPort)) {
    $databaseError('DB_PORT must be a number');
}

try {
    $conn = new mysqli(
        $dbHost,
        $dbUser,
        $dbPassword,
        $dbName,
        (int) $dbPort
    );

    $conn->set_charset('utf8mb4');
} catch (Throwable $exception) {
    $databaseError(
        'Database connection failed: ' . $exception->getMessage()
    );
}
