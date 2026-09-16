<?php

require_once 'api_utils.php';
require_once 'config.php';

$request = getRequestInfo();


if (
    !isset($request['FirstName']) ||
    !isset($request['LastName']) ||
    !isset($request['Username']) ||
    !isset($request['Password'])
) {
    sendError("One or more of the fields are missing");
    exit();
}


$firstName = trim($request['FirstName']);
$lastName = trim($request['LastName']);
$username = trim($request['Username']);
$password = $request['Password'];

//Make sure fields arent missing
if (
    $firstName === "" || 
    $lastName === "" || 
    $username === "" || 
    $password === ""

    ) {
        sendError("One or more of the fields are missing");
        exit();
    }

// Check if the username already exists in the database
$stmt = $conn->prepare("SELECT ID FROM Users WHERE Username = ?");

if (!$stmt)
    {
        sendError("Database error");
        exit();
    }

$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0)
{
    $stmt->close();
    sendError("Username already exists");
    exit();
}

$stmt->close();

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);


$stmt = $conn->prepare(
    "INSERT INTO Users (FirstName, LastName, Username, Password)
    VALUES (?, ?, ?, ?)"
);

if (!$stmt)
{
    sendError("Database error");
    exit();
}

$stmt->bind_param(
    
    "ssss",
    $firstName,
    $lastName,
    $username,
    $hashedPassword
);

if ($stmt->execute())
{
    sendJson([
        "success" => true,
        "message" => "User registered successfully",
        "ID" => $stmt->insert_id
    ]);
}
else
{
    sendError("Failed to register user");
}

$stmt->close();

?>