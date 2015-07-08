<?php
require_once __DIR__ . '/Rememberme/TokenGenerator.php';
require_once __DIR__ . '/Rememberme/Storage/PDOCart.php';
require_once __DIR__ . '/CartService.php';
require_once __DIR__ . '/DBService.php';

use Birke\Rememberme;

//TODO move this to Utils class
function set_result($code, $msg, $result = '{}') {
  header('HTTP/1.1 ' . $code . ' ' . $msg);
  header('Content-Type: application/json; charset=UTF-8');
  echo $result;
}


if (! empty($_POST) && isset($_POST['oldusername']) && isset($_POST['newusername']) && isset($_POST['cart'])) {
  
  session_start();

  $options = array(
    "credentialColumn" => "credential",
    "expiresColumn" => "expires",
    "tokenColumn" => "token",
    "dataColumn" => "data",
    "tableName" => "carts"
  );
  $storage = new Rememberme\Storage\PDOCart($options);
  
  $db = new DBService();
  $conn = $db->createPDOConnection();
  $storage->setConnection($conn);
  $tokenGenerator = new Rememberme\TokenGenerator("horowitz_" . $_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT']);
  $cartService = new CartService($storage, $tokenGenerator);
  
  $oldusername = $_POST['oldusername'];
  $newusername = $_POST['newusername'];
  $cart = $_POST['cart'];
  
  $cartService->setCookieName('CART_' . $newusername);
  $cartService->saveCart($newusername, $cart);
  
  $cartService->setCookieName($oldusername);
  $cartService->deleteCart($oldusername);
  
  set_result('200', 'OK');
} else {
  set_result("500", "Missing arguments");
}

?>