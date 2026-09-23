<?php

require_once __DIR__ . '/api_utils.php';
require_once __DIR__ . '/config.php';

$request = getRequestInfo();

$username = getRequiredString($request, 'Username');
$password = getRequiredString($request, 'Password', false);

$stmt = $conn->prepare(
    'SELECT ID, FirstName, LastName, Password
     FROM Users
     WHERE Username = ?'
);
$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$stmt->close();

if (!$row || !password_verify($password, $row['Password'])) {
    sendError('Invalid username or password', 401);
    exit();
}

if (!session_regenerate_id(true)) {
    throw new RuntimeException('Unable to regenerate session ID');
}

$_SESSION['valid'] = true;
$_SESSION['userId'] = (int) $row['ID'];
replaceSessionCookie();

sendSuccess([
    'ID' => (int) $row['ID'],
    'FirstName' => $row['FirstName'],
    'LastName' => $row['LastName']
], 'Login successful');
