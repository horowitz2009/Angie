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
  
  $orderIds = $orderService->getAllOrderIds($username);
  
  if ($orderIds != null) {
    set_result('200', 'OK', $orderIds);
  } else {
    set_result('200', 'EMPTY');
  }
  
} else {
  set_result("500", "Missing arguments");
}

?>