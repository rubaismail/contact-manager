<?php

require_once 'config.php';
require_once 'api_utils.php';

$userID = requireAuth();

$request = getRequestInfo();

if (!isset($request['query'])) {
    sendError("Missing query");
    exit();
}

$query = trim($request['query']);

// Pagination — default page 1, 10 per page
$page  = isset($request['page']) ? max(1, (int) $request['page']) : 1;
$limit = isset($request['limit']) ? max(1, (int) $request['limit']) : 10;
$offset = ($page - 1) * $limit;

$searchTerm = "%" . $query . "%";

// Total count for this search, for pagination info
$countStmt = $conn->prepare(
    "SELECT COUNT(*) AS total
     FROM Contacts
     WHERE UserID = ?
       AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)"
);
if (!$countStmt) {
    sendError("Database error", 500);
    exit();
}
$countStmt->bind_param("issss", $userID, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
$countStmt->execute();
$totalRow = $countStmt->get_result()->fetch_assoc();
$total = (int) $totalRow['total'];
$countStmt->close();

// Actual page of results
$stmt = $conn->prepare(
    "SELECT ID, FirstName, LastName, Phone, Email, DateCreated
     FROM Contacts
     WHERE UserID = ?
       AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)
     ORDER BY LastName, FirstName
     LIMIT ? OFFSET ?"
);
if (!$stmt) {
    sendError("Database error", 500);
    exit();
}

$stmt->bind_param("issssii", $userID, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $limit, $offset);
$stmt->execute();
$result = $stmt->get_result();

$contacts = [];
while ($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

sendJson([
    "success" => true,
    "data" => $contacts,
    "pagination" => [
        "page" => $page,
        "limit" => $limit,
        "total" => $total,
        "totalPages" => (int) ceil($total / $limit)
    ]
]);

$stmt->close();

?>