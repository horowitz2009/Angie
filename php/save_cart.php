<?php
require_once __DIR__ . '/RememberMe/TokenGenerator.php';
require_once __DIR__ . '/RememberMe/Storage/PDOCart2.php';
require_once __DIR__ . '/CartService2.php';

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
  "tableName" => "carts2"
);

if (! empty($_POST) && isset($_POST['username']) && isset($_POST['cart'])) {
  
  $storage = new Rememberme\Storage\PDOCart($options);
  
  $servername = "localhost"; // TODO think about constants or ini file
  $usernameDB = "zhristov";
  $passwordDB = "totaasha";
  $dbname = "felt";
  $conn = new \PDO("mysql:host=$servername;dbname=$dbname", $usernameDB, $passwordDB);
  $storage->setConnection($conn);
  $tokenGenerator = new Rememberme\TokenGenerator("horowitz_" . $_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT']);
  $cartService = new CartService($storage, $tokenGenerator);
  
  session_start();
  
  $username = $_POST['username'];
  $cart = $_POST['cart'];
  $cartService->setCookieName('CART_' . $username);
  
  $cartService->saveCart($username, $cart);
  
  set_result('200', 'OK');
} else {
  set_result("500", "Missing arguments");
}

?>