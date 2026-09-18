<?php

require_once __DIR__ . '/api_utils.php';
require_once __DIR__ . '/config.php';

$request = getRequestInfo();

$firstName = getRequiredString($request, 'FirstName');
$lastName = getRequiredString($request, 'LastName');
$username = getRequiredString($request, 'Username');
$password = getRequiredString($request, 'Password', false);

$stmt = $conn->prepare('SELECT ID FROM Users WHERE Username = ?');
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->close();
    sendError('Username already exists', 409);
    exit();
}

$stmt->close();

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
if ($hashedPassword === false) {
    throw new RuntimeException('Password hashing failed');
}

$stmt = $conn->prepare(
    'INSERT INTO Users (FirstName, LastName, Username, Password)
     VALUES (?, ?, ?, ?)'
);
$stmt->bind_param('ssss', $firstName, $lastName, $username, $hashedPassword);
$stmt->execute();
$userID = (int) $stmt->insert_id;
$stmt->close();

sendSuccess(
    ['ID' => $userID],
    'User registered successfully',
    201
);
