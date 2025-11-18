<?php
require '../vendor/autoload.php';

$clientID = '110829281866-j83ue4l2i9aej9ugn1q229q5qbfd0gsa.apps.googleusercontent.com';
$clientSecret ='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';
$redirectURL = 'http://localhost/DS/Auxi/callbackGoogle.php';

$client = new Google_Client();
$client->setClientId($clientID);
$client->setClientSecret($clientSecret);
$client->setRedirectUri($redirectURL);
$client->addScope("email"); 
$client->addScope("profile");
if (!isset($_GET['code'])) {
    die("No se recibió el código de Google.");
}

$token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
$client->setAccessToken($token['access_token']);

$google_oauth = new Google_Service_Oauth2($client);
$userInfo = $google_oauth->userinfo->get();

// Guardar el email verificado
$_SESSION['google_email_verified'] = $userInfo->email;

// Ahora damos por aprobado el 2FA
$_SESSION['2FA_ok'] = true;

// Redirigir al panel
header("Location: ../Auxi/auxiliar.html");
exit;