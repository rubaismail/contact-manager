<?php 

// ============================================
// COP 4331C Small Project - Contact Manager
// API Utility Functions
// ============================================

session start();

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}   

function sendJson($data)
{
    header('Content-type: application/json');
    echo json_encode($data);
}

function sendError($message, $statusCode = 400)
{
    http_response_code($statusCode);
    sendJson([ "error" => $message]);
}

function getAuthenticatedUserID() 
{
    if (!empty($_SESSION['valid']) && isset($_SESSION['userId'])) {
        return (int) $_SESSION['userId'];
    }
    return null;
}

function requireAuth() 
{
    $userID = getAuthenticatedUserID();
    if (!$userID) {
        sendError("Not logged in", 401);
        exit();
    }
    return $userID;
}

?>