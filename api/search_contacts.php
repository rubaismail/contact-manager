<?php
// api/search_contacts.php
header('Content-Type: application/json');
require_once __DIR__ . '/db_connect.php';

// TODO: replace with real auth once login/session is confirmed.
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['UserID']) || !isset($data['query'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing UserID or query"]);
    exit;
}

$userId = (int) $data['UserID'];
$query  = trim($data['query']);

$conn = getDbConnection();

// Partial match on FirstName, LastName, Phone, or Email — server-side, per rubric requirement
$searchTerm = "%" . $query . "%";

$stmt = $conn->prepare(
    "SELECT ID, FirstName, LastName, Phone, Email, DateCreated
     FROM Contacts
     WHERE UserID = ?
       AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)
     ORDER BY LastName, FirstName"
);
$stmt->bind_param("issss", $userId, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

$contacts = [];
while ($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

echo json_encode(["success" => true, "data" => $contacts]);

$stmt->close();
$conn->close();