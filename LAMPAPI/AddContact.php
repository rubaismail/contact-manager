<?php

  require_once 'api_utils.php';
	require_once 'config.php';

  $userID = requireAuth();

	$request = getRequestInfo();
	
    if ( !isset($request['FirstName']) || !isset($request['LastName']) || !isset($request['Phone']) || !isset($request['Email'])){
        sendError("One or more of the fields are missing");
        exit();
    }

	$firstName = trim($request["FirstName"]);
    $lastName = trim($request["LastName"]);
    $phone = trim($request["Phone"]);
    $email = trim($request["Email"]);

    if ($firstName === "" || $lastName === "" || $phone === "" || $email === "") {
        sendError("One or more of the fields are missing");
        exit();
    }

	$stmt = $conn->prepare("INSERT into Contacts (UserID, FirstName, LastName, Phone, Email) VALUES(?,?,?,?,?)");
    if(!$stmt) {
        sendError("Database error", 500);
        exit();
    }

	$stmt->bind_param("issss", $userID, $firstName, $lastName, $phone, $email);

	if ($stmt->execute()) {
        sendJson([
            "success" => true,
            "message" => "Contact added successfully",
            "ID"      => $stmt->insert_id
        ]);
    }else{
        sendError("Failed to add contact", 500);
    }
	$stmt->close();
?>
