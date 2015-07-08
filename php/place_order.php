<?php
require_once __DIR__ . '/OrderService.php';
require_once __DIR__ . '/DBService.php';

//TODO move this to Utils class
function set_result($code, $msg, $result = '{}') {
  header('HTTP/1.1 ' . $code . ' ' . $msg);
  header('Content-Type: application/json; charset=UTF-8');
  echo $result;
}


if (! empty($_POST) && isset($_POST['username']) && isset($_POST['data'])) {
  
  session_start();
  $db = new DBService();
  $orderService = new OrderService($db->createPDOConnection());
  
  $username = $_POST['username'];
  $status = isset($_POST['status']) ? $_POST['status'] : 'pending';
  $data =  $_POST['data'];

  $id = $orderService->saveOrder($username, $status, $data);
    
  set_result('200', 'OK', '{"id":"'.$id.'"}');
} else {
  set_result("500", "Missing arguments");
}

?>