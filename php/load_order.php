<?php
require_once __DIR__ . '/OrderService.php';
require_once __DIR__ . '/DBService.php';

use Birke\Rememberme;

function set_result($code, $msg, $result = '{}') {
  header('HTTP/1.1 ' . $code . ' ' . $msg);
  header('Content-Type: application/json; charset=UTF-8');
  echo $result;
}

if (! empty($_POST) && isset($_POST['username'])) {
  
  session_start();
  $db = new DBService();
  $orderService = new OrderService($db->createPDOConnection());
  
  $username = $_POST['username'];
  $id = $_POST['id'];
  
  $order = $orderService->loadOrder($username, $id);
  
  if ($order != null) {
    set_result('200', 'OK', $order);
  } else {
    set_result('200', 'EMPTY');
  }
  
} else {
  set_result("500", "Missing arguments");
}

?>