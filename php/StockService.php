<?php

/**
 * All about orders
 *
 * @author Jeff Horowitz
 */
class StockService {

  /**
   *
   * @var \PDO
   */
  protected $connection;

  public function __construct($connection) {
    $this->connection = $connection;
  }

  /**
   *
   * @param PDO $connection          
   */
  public function setConnection(\PDO $connection) {
    $this->connection = $connection;
  }

  /**
   *
   * @param string $username          
   * @param string $status          
   * @param string $data          
   */
  public function insertStockEntry($categoryId, $productId, $packagingId, $quantity, $min, $opt, $onHold) {
    $sql = "INSERT INTO stockentries(category_id, product_id, packaging_id, quantity, min, opt, onhold) 
                              VALUES(?, ?, ?, ?, ?, ?, ?)";
    
    $query = $this->connection->prepare($sql);
    $query->execute(array($categoryId, $productId, $packagingId, $quantity, $min, $opt, $onHold));
    return $this->connection->lastInsertId();
  }
  
  public function changeStockEntry($categoryId, $productId, $packagingId, $quantity, $min, $opt, $onHold) {
    $sql = "UPDATE stockentries SET quantity = ?, min = ?, opt = ?, onhold = ? WHERE category_id = ? AND product_id = ? AND packaging_id = ?";
    
    $query = $this->connection->prepare($sql);
    $query->execute(array($quantity, $min, $opt, $onHold, $categoryId, $productId, $packagingId));
  }

  public function getStockEntry($categoryId, $productId, $packagingId) {
    $sql = "SELECT quantity, min, opt, onhold FROM stockentries WHERE category_id = ? AND product_id = ? AND packaging_id = ?";
    $query = $this->connection->prepare($sql);
    
    $query->execute(array($categoryId, $productId, $packagingId));
    $query->setFetchMode(PDO::FETCH_NUM);
    if ($row = $query->fetch()) {
      $obj = new stdClass();
      $obj->categoryId = $categoryId;
      $obj->productId = $productId;
      $obj->packagingId = $packagingId;
      $obj->quantity = $row[0];
      $obj->min = $row[1];
      $obj->opt = $row[2];
      $obj->onHold = $row[3];
      $res = json_encode($obj);
      return $res;
    }
    return null;
  
  }
  
  public function getAllEntries() {
    $sql = "SELECT category_id, product_id, packaging_id, quantity, min, opt, onhold FROM stockentries";

    $query = $this->connection->prepare($sql);
    $query->execute();
    
    $query->setFetchMode(PDO::FETCH_NUM);
    
    $res = array();
    while ($row = $query->fetch()) {
      $obj = new stdClass();
      $obj->categoryId = $row[0];
      $obj->productId = $row[1];
      $obj->packagingId = $row[2];
      $obj->quantity = $row[3];
      $obj->min = $row[4];
      $obj->opt = $row[5];
      $obj->onHold = $row[6];
      $res[] = $obj;
    }
    
    return json_encode($res);
  }
  
  public function getSomeEntries($categoryId, $productId, $packagingId) {
    $sql = "SELECT category_id, product_id, packaging_id, quantity, min, opt, onhold FROM stockentries WHERE 1 ";
    
    $params = array();
    
    if ($categoryId) {
      $sql = $sql . " AND category_id = ?";
      $params[] = $categoryId;  
    }
    if ($productId) {
      $sql = $sql . " AND product_id = ?";
      $params[] = $productId;  
    }
    if ($packagingId) {
      $sql = $sql . " AND packaging_id = ?";
      $params[] = $productId;  
    }

    $query = $this->connection->prepare($sql);
    $query->execute($params);
    
    $query->setFetchMode(PDO::FETCH_NUM);
    
    $res = array();
    while ($row = $query->fetch()) {
      $obj = new stdClass();
      $obj->categoryId = $row[0];
      $obj->productId = $row[1];
      $obj->packagingId = $row[2];
      $obj->quantity = $row[3];
      $obj->min = $row[4];
      $obj->opt = $row[5];
      $obj->onHold = $row[6];
      $res[] = $obj;
    }
    
    return json_encode($res);
  }
  
  //DELETE FROM `stockentries` WHERE `categoty_id` = '1'
  public function deleteStockEntry($categoryId, $productId, $packagingId) {
    $sql = "DELETE FROM stockentries WHERE category_id = ? AND product_id = ? AND packaging_id = ?";
  
    $query = $this->connection->prepare($sql);
    $query->execute(array($categoryId, $productId, $packagingId));
  }
  
  
  
  
}
