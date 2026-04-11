<?php
// Direct PHP test for CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: text/plain');

echo "CORS Test\n";
echo "If you see this without CORS error, headers are working!\n";
