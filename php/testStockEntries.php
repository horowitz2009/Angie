<!DOCTYPE html>
<html>
<body>

  <h1>Install DB</h1>

<?php
require_once 'DBService.php';
require_once 'StockService.php';

// first simple version of load data to DB

$db = new DBService();

$stockService = new StockService($db->createPDOConnection());

$stockService->insertStockEntry("10", "20", "30", 1000, 1);
echo "<p>inserted one stock entry.</p>";

$res = $stockService->getStockEntry("10", "20", "30");

echo $res;

$res = json_decode($res);

echo $res->categoryId;
echo $res->productId;
echo $res->packagingId;
echo $res->quantity;
echo $res->onHold;

$stockService->changeStockEntry("10", "20", "30", 2000, 20);

$res = $stockService->getStockEntry("10", "20", "30");

echo '<br>';
echo $res;

$res = $stockService->getAllEntries();
echo '<br>';
echo $res;

$stockService->deleteStockEntry("10", "20", "30");

$res = $stockService->getStockEntry("10", "20", "30");

echo $res;


?>


</body>
</html>