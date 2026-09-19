<?php

require_once __DIR__ . '/api_utils.php';

getRequestInfo();

session_unset();
session_destroy();

sendSuccess(null, 'Logout successful');