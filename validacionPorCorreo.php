<?php
/* Este codigo se usa para la validacion de 2 pasos usando
 * la cuenta de un correo electronico. */ 
require 'vendor/autoload.php';

// se crea y guarda el ID del cliente, clave secreta del cliente
// y la URL donde lo redirige cuando inicia sesion
$clientID = '110829281866-j83ue4l2i9aej9ugn1q229q5qbfd0gsa.apps.googleusercontent.com';
$clientSecret ='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';
$redirectURL = 'http://localhost/DS/Auxi/callbackGoogle.php';

$client = new Google_Client();
$client->setClientId($clientID);
$client->setClientSecret($clientSecret);
$client->setRedirectUri($redirectURL);
$client->addScope("email");
$client->addScope("profile");

// Redirigir a Google
header('Location: ' . $client->createAuthUrl());
exit;