<?php

require_once __DIR__ . '/api_utils.php';
require_once __DIR__ . '/config.php';

$userID = requireAuth();
$request = getRequestInfo();
$contactID = getRequiredPositiveInt($request, 'ID');

$stmt = $conn->prepare(
    'DELETE FROM Contacts WHERE ID = ? AND UserID = ?'
);
$stmt->bind_param('ii', $contactID, $userID);
$stmt->execute();
$deletedRows = $stmt->affected_rows;
$stmt->close();

if ($deletedRows === 0) {
    sendError('Contact not found', 404);
    exit();
}

sendSuccess(null, 'Contact deleted successfully');
