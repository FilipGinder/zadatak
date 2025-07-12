<?php
// Products.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : null;

if (!$authHeader) {
    http_response_code(401);
    echo json_encode(['error' => 'JWT token nije prosleđen']);
    exit();
}

// Parametri iz URL-a
$searchTerm = isset($_GET['search']) ? trim($_GET['search']) : '';
$id = isset($_GET['id']) ? trim($_GET['id']) : null;

$url = 'https://zadatak.konovo.rs/products';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: $authHeader",
    "Accept: application/json"
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpcode);
header('Content-Type: application/json');

$data = json_decode($response, true);

if (!is_array($data)) {
    http_response_code(500);
    echo json_encode(['error' => 'Nevalidan odgovor sa API-ja']);
    exit();
}

// ✳️ Ako je prosleđen ID proizvoda, traži samo taj proizvod
if ($id !== null) {
    foreach ($data as &$proizvod) {
        // Zamena "brzina" u "performanse"
        if (isset($proizvod['description'])) {
            $proizvod['description'] = preg_replace('/brzina/i', 'performanse', $proizvod['description']);
        }

        // Uvećanje cene za monitore
        if (isset($proizvod['categoryName']) && preg_match('/monitori/i', $proizvod['categoryName'])) {
            if (isset($proizvod['price']) && is_numeric($proizvod['price'])) {
                $proizvod['price'] = round($proizvod['price'] * 1.10, 2);
            }
        }

        // Ako je pronađen proizvod po ID-ju (sif_product)
        if (isset($proizvod['sif_product']) && $proizvod['sif_product'] === $id) {
            http_response_code(200);
            echo json_encode($proizvod);
            exit();
        }
    }

    // Ako nije pronađen nijedan proizvod
    http_response_code(404);
    echo json_encode(['error' => 'Proizvod nije pronađen']);
    exit();
}

// ✳️ Ako nije prosleđen ID, radi pretragu po search
$filtered = [];

foreach ($data as &$proizvod) {
    // Zamena "brzina" u "performanse"
    if (isset($proizvod['description'])) {
        $proizvod['description'] = preg_replace('/brzina/i', 'performanse', $proizvod['description']);
    }

    // Uvećanje cene za monitore
    if (isset($proizvod['categoryName']) && preg_match('/monitori/i', $proizvod['categoryName'])) {
        if (isset($proizvod['price']) && is_numeric($proizvod['price'])) {
            $proizvod['price'] = round($proizvod['price'] * 1.10, 2);
        }
    }

    // Filtriranje po search-u
    $matchSearch = true;
    if ($searchTerm !== '') {
        $searchLower = strtolower($searchTerm);
        $naziv = strtolower($proizvod['naziv'] ?? '');
        $kategorija = strtolower($proizvod['categoryName'] ?? '');

        $matchSearch = strpos($naziv, $searchLower) !== false ||
                       strpos($kategorija, $searchLower) !== false;
    }

    if ($matchSearch) {
        $filtered[] = $proizvod;
    }
}

// Vrati rezultat
if (count($filtered) === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Nema proizvoda koji zadovoljavaju kriterijume']);
} else {
    http_response_code(200);
    echo json_encode($filtered);
}
