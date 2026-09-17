<?php

require_once __DIR__ . '/api_utils.php';
require_once __DIR__ . '/config.php';

$userID = requireAuth();
$request = getRequestInfo();

$contactID = getRequiredPositiveInt($request, 'ID');
$firstName = getRequiredString($request, 'FirstName');
$lastName = getRequiredString($request, 'LastName');
$phone = getRequiredString($request, 'Phone');
$email = getRequiredString($request, 'Email');

$stmt = $conn->prepare(
    'SELECT ID FROM Contacts WHERE ID = ? AND UserID = ?'
);
$stmt->bind_param('ii', $contactID, $userID);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    $stmt->close();
    sendError('Contact not found', 404);
    exit();
}

$stmt->close();

$stmt = $conn->prepare(
    'UPDATE Contacts
     SET FirstName = ?, LastName = ?, Phone = ?, Email = ?
     WHERE ID = ? AND UserID = ?'
);
$stmt->bind_param(
    'ssssii',
    $firstName,
    $lastName,
    $phone,
    $email,
    $contactID,
    $userID
);
$stmt->execute();
$stmt->close();

sendSuccess(null, 'Contact updated successfully');
