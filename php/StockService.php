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
  public function insertStockEntry($categoryId, $productId, $packagingId, $quantity, $onHold) {
    $sql = "INSERT INTO stockentries(category_id, product_id, packaging_id, quantity, onhold) 
                              VALUES(?, ?, ?, ?, ?)";
    
    $query = $this->connection->prepare($sql);
    $query->execute(array($categoryId, $productId, $packagingId, $quantity, $onHold));
    return $this->connection->lastInsertId();
  }
  
  public function changeStockEntry($categoryId, $productId, $packagingId, $quantity, $onHold) {
    //UPDATE `orders` SET `id`=[value-1],`user`=[value-2],`status`=[value-3],`date_placed`=[value-4],`date_changed`=[value-5],`data`=[value-6] WHERE 1
    $sql = "UPDATE stockentries SET quantity = ?, onhold = ? WHERE category_id = ? AND product_id = ? AND packaging_id = ?";
    
    $query = $this->connection->prepare($sql);
    $query->execute(array($quantity, $onHold, $categoryId, $productId, $packagingId));
  }

  public function getStockEntry($categoryId, $productId, $packagingId) {
    $sql = "SELECT quantity, onhold FROM stockentries WHERE category_id = ? AND product_id = ? AND packaging_id = ?";
    $query = $this->connection->prepare($sql);
    
    $query->execute(array($categoryId, $productId, $packagingId));
    $query->setFetchMode(PDO::FETCH_NUM);
    if ($row = $query->fetch()) {
      $obj = new stdClass();
      $obj->categoryId = $categoryId;
      $obj->productId = $productId;
      $obj->packagingId = $packagingId;
      $obj->quantity = $row[0];
      $obj->onHold = $row[1];
      $res = json_encode($obj);
      return $res;
    }
    return null;
  
  }
  
  public function getAllEntries() {
    $sql = "SELECT category_id, product_id, packaging_id, quantity, onhold FROM stockentries";

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
      $obj->onHold = $row[4];
      $res[] = $obj;
    }
    
    return json_encode($res);
  }
  
  public function getSomeEntries($categoryId, $productId, $packagingId) {
    $sql = "SELECT category_id, product_id, packaging_id, quantity, onhold FROM stockentries WHERE 1 ";
    
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
      $obj->onHold = $row[4];
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
