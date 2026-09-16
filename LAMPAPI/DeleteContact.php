<?php

require_once 'config.php';
require_once 'api_utils.php';

$userID = requireAuth();

$request = getRequestInfo();

if (!isset($request['ID'])) {
    sendError("Missing ID");
    exit();
}

$contactID = $request['ID'];

// Check if contact exists and belongs to the user
$stmt = $conn->prepare(
    "SELECT ID FROM Contacts WHERE ID = ? AND UserID = ?"
);
if (!$stmt) {
    sendError("Database error", 500);
    exit();
}

$stmt->bind_param("ii", $contactID, $userID);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    $stmt->close();
    sendError("No results found", 404);
    exit();
}

$stmt->close();

// Delete the contact
$stmt = $conn->prepare(
    "DELETE FROM Contacts WHERE ID = ? AND UserID = ?"
);

if (!$stmt) {
    sendError("Database error", 500);
    exit();
}

$stmt->bind_param("ii", $contactID, $userID);

if ($stmt->execute()) {
    sendJson([
        "success" => true,
        "message" => "Contact deleted successfully"
    ]);
} else {
    sendError("Failed to delete contact", 500);
}

$stmt->close();

?>