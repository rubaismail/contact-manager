<?php

require_once __DIR__ . '/api_utils.php';

getRequestInfo();

destroySession();

sendSuccess(null, 'Logout successful');
