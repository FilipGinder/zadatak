<?php
// Omogući CORS za razvoj (ovo prilagodi po potrebi)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Ako je OPTIONS zahtev, samo odmah odgovori i izađi
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Čitanje inputa
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

$url = 'https://zadatak.konovo.rs/login';
$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($input));

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

http_response_code($httpcode);
header('Content-Type: application/json');
if ($httpcode === 401) {
    echo json_encode(['error' => 'Pogrešni kredencijali']);
} else {
    echo $response;
}
