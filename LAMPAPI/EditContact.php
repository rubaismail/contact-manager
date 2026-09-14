<?php

require_once 'config.php';
require_once 'api_utils.php';


$request = getRequestInfo();

if (
    !isset($request['ID']) ||
    !isset($request['UserID']) ||
    !isset($request['FirstName']) ||
    !isset($request['LastName']) ||
    !isset($request['Phone']) ||
    !isset($request['Email'])
) {
    sendError("One of the fields is missing");
    exit();
}

// Store the request parameters in variables
$contactID = ($request['ID']);
$userID = ($request['UserID']);
$firstName = trim($request['FirstName']);
$lastName = trim($request['LastName']);
$phone = trim($request['Phone']);
$email = trim($request['Email']);

if (
    $firstName === "" ||
    $lastName === "" ||
    $phone === "" ||
    $email === ""
) {
    sendError("One of the fields is missing");
    exit();
}

//Check if contact exists and belongs to the user
$stmt = $conn->prepare(
    "SELECT ID FROM Contacts WHERE ID = ? AND UserID = ?"
);

if (!$stmt){
    sendError("Database error");
    exit();
}

$stmt->bind_param("ii", $contactID, $userID);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    $stmt->close();
    sendError("No results found");
    exit();
}

$stmt->close();

// Update the contact
$stmt = $conn->prepare(
    "UPDATE Contacts
     SET FirstName = ?, 
     LastName = ?, Phone = ?, Email = ? 
     WHERE ID = ? AND UserID = ?"
);

if (!$stmt) {
    sendError("Database error");
    exit();
}


$stmt->bind_param(
    "ssssii",
     $firstName,
      $lastName, 
      $phone, 
      $email, 
      $contactID,
      $userID
);

if ($stmt->execute()) {
    sendJson([
        "success" => true,
        "message" => "Contact updated successfully"
    ]);
} else {
    sendError("Failed to update contact");
}

$stmt->close();

?>