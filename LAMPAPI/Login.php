<?php

	require_once 'api_utils.php';
	require_once 'config.php';
	
	$request = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

    // Validate required fields
    if (
        !isset($request['Username']) ||
        !isset($request['Password'])
    ) {
        sendError("One or more of the fields are missing");
        exit();
    }

    $username = trim($request['Username']);
    $password = $request['Password'];

    if ($username === "" || $password === "") {
        sendError("One or more of the fields are missing");
        exit();
    }
 	
	$stmt = $conn->prepare("SELECT ID, firstName, lastName, Password FROM Users WHERE Username=?");

   if(!$stmt) {
        sendError("Database error", 500);
        exit();
    }
	$stmt->bind_param("s", $username);
	$stmt->execute();
	$result = $stmt->get_result();

	if( $row = $result->fetch_assoc()  )
	{
		if (password_verify($password, $row['Password'])){

			session_regenerate_id(true);

			$_SESSION['valid'] = true;
			$_SESSION['userId'] = (int) $row["ID"]

			returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
		} else {
			// Invalid password
			sendError("Invalid username or password", 401);
		}
	}
	else
	{
		sendError("Invalid username or password", 401);
	}

	$stmt->close();
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendJson( $retValue );
	}
	
?>
