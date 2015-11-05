<?php
require_once __DIR__ . '/DBService.php';
require_once __DIR__ . '/StockService.php';

function set_result($code, $msg, $result = '{}') {
  header('HTTP/1.1 ' . $code . ' ' . $msg);
  header('Content-Type: application/json; charset=UTF-8');
  echo $result;
}

if (! empty($_POST) && isset($_POST['c'])) {
  
  session_start();
  $db = new DBService();
  $stockService = new StockService($db->createPDOConnection());
  
  $c = $_POST['c'];
  
  // TODO check token
  
  $res = "{}";
  
  if ($c == "insert") {
    $res = $stockService->insertStockEntry($_POST['categoryId'], $_POST['productId'], $_POST['packagingId'], 
      $_POST['quantity'], $_POST['onHold']);
  } elseif ($c == "get") {
    $res = $stockService->getStockEntry($_POST['categoryId'], $_POST['productId'], $_POST['packagingId']);
  } elseif ($c == "getAll") {
    $res = $stockService->getAllEntries();
  } elseif ($c == "getSome") {
    $res = $stockService->getSomeEntries(isset($_POST['categoryId']) ? $_POST['categoryId'] : null, 
      isset($_POST['productId']) ? $_POST['productId'] : null, isset($_POST['packagingId']) ? $_POST['packagingId'] : null);
  } elseif ($c == "change") {
    $stockService->changeStockEntry($_POST['categoryId'], $_POST['productId'], $_POST['packagingId'], 
      $_POST['quantity'], $_POST['onHold']);
  } elseif ($c == "del") {
    $stockService->deleteStockEntry($_POST['categoryId'], $_POST['productId'], $_POST['packagingId']);
  }
  
  set_result('200', 'OK', $res);
} else {
  set_result("500", "Missing arguments");
}

?>