<?php
require_once __DIR__ . '/OrderService.php';
require_once __DIR__ . '/DBService.php';

//TODO move this to Utils class
function set_result($code, $msg, $result = '{}') {
  header('HTTP/1.1 ' . $code . ' ' . $msg);
  header('Content-Type: application/json; charset=UTF-8');
  echo $result;
}


if (! empty($_POST) && isset($_POST['id'])) {
  
  session_start();
  $db = new DBService();
  $orderService = new OrderService($db->createPDOConnection());
  
  $id = $_POST['id'];
  $status = isset($_POST['status']) ? $_POST['status'] : 'pending';

  $orderService->changeOrderStatus($id, $status);
    
  set_result('200', 'OK', '{}');
} else {
  set_result("500", "Missing arguments");
}

?>