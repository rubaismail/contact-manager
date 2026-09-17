<?php

// Shared request, response, error, and authentication helpers.

set_exception_handler(function (Throwable $exception): void {
    error_log(sprintf(
        'Unhandled API exception: %s in %s:%d',
        $exception->getMessage(),
        $exception->getFile(),
        $exception->getLine()
    ));

    sendError('Internal server error', 500);
    exit();
});

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function sendJson(array $data, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
}

function sendSuccess(
    $data = null,
    ?string $message = null,
    int $statusCode = 200,
    array $metadata = []
): void {
    $response = [
        'success' => true,
        'data' => $data
    ];

    if ($message !== null) {
        $response['message'] = $message;
    }

    foreach ($metadata as $key => $value) {
        $response[$key] = $value;
    }

    sendJson($response, $statusCode);
}

function sendError(string $message, int $statusCode = 400): void
{
    sendJson([
        'success' => false,
        'error' => $message
    ], $statusCode);
}

function getRequestInfo(): array
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'POST';
    if ($method !== 'POST') {
        header('Allow: POST');
        sendError('Method not allowed', 405);
        exit();
    }

    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($contentType, 'application/json') === false) {
        sendError('Content-Type must be application/json', 415);
        exit();
    }

    $rawBody = file_get_contents('php://input');
    if ($rawBody === false || trim($rawBody) === '') {
        sendError('Request body must contain JSON', 400);
        exit();
    }

    try {
        $decodedBody = json_decode($rawBody, false, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException $exception) {
        sendError('Request body contains invalid JSON', 400);
        exit();
    }

    if (!is_object($decodedBody)) {
        sendError('JSON request body must be an object', 400);
        exit();
    }

    return (array) $decodedBody;
}

function getRequiredString(
    array $request,
    string $field,
    bool $trimValue = true,
    bool $allowEmpty = false
): string {
    if (!array_key_exists($field, $request) || !is_string($request[$field])) {
        sendError("Missing or invalid field: {$field}", 400);
        exit();
    }

    $value = $trimValue ? trim($request[$field]) : $request[$field];
    if (!$allowEmpty && $value === '') {
        sendError("Missing or invalid field: {$field}", 400);
        exit();
    }

    return $value;
}

function getRequiredPositiveInt(array $request, string $field): int
{
    if (!array_key_exists($field, $request)) {
        sendError("Missing or invalid field: {$field}", 400);
        exit();
    }

    $value = filter_var(
        $request[$field],
        FILTER_VALIDATE_INT,
        ['options' => ['min_range' => 1]]
    );

    if ($value === false) {
        sendError("Missing or invalid field: {$field}", 400);
        exit();
    }

    return $value;
}

function getAuthenticatedUserID(): ?int
{
    if (!empty($_SESSION['valid']) && isset($_SESSION['userId'])) {
        return (int) $_SESSION['userId'];
    }

    return null;
}

function requireAuth(): int
{
    $userID = getAuthenticatedUserID();
    if (!$userID) {
        sendError('Not logged in', 401);
        exit();
    }

    return $userID;
}
