<?php
require_once __DIR__ . '/RememberMe/TokenGenerator.php';
require_once __DIR__ . '/RememberMe/Storage/PDOCart.php';
require_once __DIR__ . '/CartService.php';
require_once __DIR__ . '/DBService.php';

use Birke\Rememberme;

function set_result($code, $msg, $result = '{}') {
  header('HTTP/1.1 ' . $code . ' ' . $msg);
  header('Content-Type: application/json; charset=UTF-8');
  echo $result;
}

$options = array(
  "credentialColumn" => "credential",
  "expiresColumn" => "expires",
  "tokenColumn" => "token",
  "dataColumn" => "data",
  "tableName" => "carts"
);

if (! empty($_POST) && isset($_POST['username'])) {
  
  $storage = new Rememberme\Storage\PDOCart($options);
  
  $db = new DBService();
  $conn = $db->createPDOConnection();
  $storage->setConnection($conn);
  $tokenGenerator = new Rememberme\TokenGenerator("horowitz_" . $_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT']);
  $cartService = new CartService($storage, $tokenGenerator);
  
  session_start();
  
  $username = $_POST['username'];
  $cartService->setCookieName($username);
  
  $cart = $cartService->loadCart($username);
  if ($cart != null) {
    set_result('200', 'OK', $cart);
  } else {
    set_result('200', 'EMPTY');
  }
  
} else {
  set_result("500", "Missing arguments");
}

?>