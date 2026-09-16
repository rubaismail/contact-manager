?>
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

    $username = $request['Username'];
    $password = $request['Password'];

    if ($username === "" || $password === "") {
        sendError("One or more of the fields are missing");
        exit();
    }
 	
	$stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");

    if(!$stmt) {
        sendError("Database error", 500);
        exit();
    }
	$stmt->bind_param("ss", $request["login"], $request["password"]);
	$stmt->execute();
	$result = $stmt->get_result();

	if( $row = $result->fetch_assoc()  )
	{
		returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
	}
	else
	{
		returnWithError("No Records Found");
	}

	$stmt->close();
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
