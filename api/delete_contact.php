<?php
// api/delete_contact.php
header('Content-Type: application/json');
require_once __DIR__ . '/db_connect.php';

// TODO: replace this with real auth once login/session is confirmed.
// For now, assumes UserID is sent by the client — INSECURE, temporary only.
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['ContactID']) || !isset($data['UserID'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing ContactID or UserID"]);
    exit;
}

$contactId = (int) $data['ContactID'];
$userId    = (int) $data['UserID'];

$conn = getDbConnection();

// Only delete if the contact belongs to this user
$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserID = ?");
$stmt->bind_param("ii", $contactId, $userId);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Contact deleted"]);
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "error" => "Contact not found or not yours"]);
}

$stmt->close();
$conn->close();