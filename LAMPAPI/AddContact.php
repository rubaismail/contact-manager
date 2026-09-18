<?php

require_once __DIR__ . '/api_utils.php';
require_once __DIR__ . '/config.php';

$userID = requireAuth();
$request = getRequestInfo();

$firstName = getRequiredString($request, 'FirstName');
$lastName = getRequiredString($request, 'LastName');
$phone = getRequiredString($request, 'Phone');
$email = getRequiredString($request, 'Email');

$stmt = $conn->prepare(
    'INSERT INTO Contacts (UserID, FirstName, LastName, Phone, Email)
     VALUES (?, ?, ?, ?, ?)'
);
$stmt->bind_param('issss', $userID, $firstName, $lastName, $phone, $email);
$stmt->execute();
$contactID = (int) $stmt->insert_id;
$stmt->close();

sendSuccess(
    ['ID' => $contactID],
    'Contact added successfully',
    201
);
