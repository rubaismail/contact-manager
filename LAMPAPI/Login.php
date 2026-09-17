<?php

require_once __DIR__ . '/api_utils.php';
require_once __DIR__ . '/config.php';

$request = getRequestInfo();

if (
    !isset($request['Username'], $request['Password']) ||
    !is_string($request['Username']) ||
    !is_string($request['Password'])
) {
    sendError("One or more of the fields are missing");
    exit();
}

$username = trim($request['Username']);
$password = $request['Password'];

if ($username === "" || $password === "") {
    sendError("One or more of the fields are missing");
    exit();
}

$stmt = $conn->prepare(
    "SELECT ID, FirstName, LastName, Password
     FROM Users
     WHERE Username = ?"
);

if (!$stmt) {
    sendError("Database error", 500);
    exit();
}

$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$stmt->close();

if (!$row || !password_verify($password, $row['Password'])) {
    sendError("Invalid username or password", 401);
    exit();
}

session_regenerate_id(true);
$_SESSION['valid'] = true;
$_SESSION['userId'] = (int) $row['ID'];

sendJson([
    "success" => true,
    "ID" => (int) $row['ID'],
    "FirstName" => $row['FirstName'],
    "LastName" => $row['LastName']
]);
