<?php

require_once __DIR__ . '/api_utils.php';
require_once __DIR__ . '/config.php';

$userID = requireAuth();
$request = getRequestInfo();

$query = getRequiredString($request, 'query', true, true);
$page = isset($request['page'])
    ? getRequiredPositiveInt($request, 'page')
    : 1;
$limit = isset($request['limit'])
    ? min(100, getRequiredPositiveInt($request, 'limit'))
    : 10;
$offset = ($page - 1) * $limit;
$searchTerm = '%' . $query . '%';

$countStmt = $conn->prepare(
    'SELECT COUNT(*) AS total
     FROM Contacts
     WHERE UserID = ?
       AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)'
);
$countStmt->bind_param(
    'issss',
    $userID,
    $searchTerm,
    $searchTerm,
    $searchTerm,
    $searchTerm
);
$countStmt->execute();
$totalRow = $countStmt->get_result()->fetch_assoc();
$total = (int) $totalRow['total'];
$countStmt->close();

$stmt = $conn->prepare(
    'SELECT ID, FirstName, LastName, Phone, Email, DateCreated
     FROM Contacts
     WHERE UserID = ?
       AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)
     ORDER BY LastName, FirstName
     LIMIT ? OFFSET ?'
);
$stmt->bind_param(
    'issssii',
    $userID,
    $searchTerm,
    $searchTerm,
    $searchTerm,
    $searchTerm,
    $limit,
    $offset
);
$stmt->execute();
$result = $stmt->get_result();

$contacts = [];
while ($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

$stmt->close();

sendSuccess(
    $contacts,
    null,
    200,
    [
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'totalPages' => (int) ceil($total / $limit)
        ]
    ]
);
