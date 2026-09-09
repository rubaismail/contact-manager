<?php 

// ============================================
// COP 4331C Small Project - Contact Manager
// API Utility Functions
// ============================================

// Read JSON request data from the client
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}   

// Send a JSON response to the client 
function sendJson($data)
{
    header('Content-type: application/json');
    echo json_encode($data);
}

// Send a JSON response with an error message to the client
function sendError($message)
{
    sendJson([
        "error" => $message
    ]);
}

?>