<?php

/**
 * All about orders
 *
 * @author Jeff Horowitz
 */
class OrderService {

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
  public function insertOrder($username, $status, $data) {
    $sql = "INSERT INTO orders(user, status, data, date_placed, date_changed) VALUES(?, ?, ?, now(), now())";
    
    $query = $this->connection->prepare($sql);
    $query->execute(array($username, $status, $data));
    return $this->connection->lastInsertId();
  }
  
  public function changeOrderStatus($id, $status) {
    //UPDATE `orders` SET `id`=[value-1],`user`=[value-2],`status`=[value-3],`date_placed`=[value-4],`date_changed`=[value-5],`data`=[value-6] WHERE 1
    $sql = "UPDATE orders SET status = ?, date_changed = now() WHERE id = ?";
    
    $query = $this->connection->prepare($sql);
    $query->execute(array($status, $id));
  }

  public function loadOrder($username, $id) {
    $sql = "SELECT data, status, date_placed, date_changed FROM orders WHERE user = ? AND id = ?  LIMIT 1";
  
    $query = $this->connection->prepare($sql);
    $query->execute(array($username, $id));
    $query->setFetchMode(PDO::FETCH_NUM);
    if ($row = $query->fetch()) {
      $obj = json_decode($row[0]);
      $obj->id = $id;
      $obj->status = $row[1];
      $obj->datePlaced = $row[2];
      $obj->dateChanged = $row[3];
      $res = json_encode($obj);
      return $res;
    }
    return null;
  
  }
  
  public function getAllOrders($username) {
    $sql = "SELECT id, data, status, date_placed, date_changed FROM orders WHERE user = ? order by date_placed desc";
  
    $query = $this->connection->prepare($sql);
    $query->execute(array($username));
    
    $query->setFetchMode(PDO::FETCH_NUM);
    
    $res = array();
    while ($row = $query->fetch()) {
      $obj = json_decode($row[1]);
      $obj->id = $row[0];
      $obj->status = $row[2];
      //$d = DateTime::createFromFormat('Y-m-d G:i:s', $row[3]);
      $obj->datePlaced = $row[3];
      $obj->dateChanged = $row[4];
      $res[] = $obj;
    }
    
    return json_encode($res);
  }
  
  public function getAllOrderIds($username) {
    $sql = "SELECT id FROM orders WHERE user = ? order by date_placed desc";
  
    $query = $this->connection->prepare($sql);
    $query->execute(array($username));
    
    $query->setFetchMode(PDO::FETCH_NUM);
    
    $res = array();
    while ($row = $query->fetch()) {
      $res[] = $row[0];
    }
    
    return json_encode($res);
  }
  
  /**
   *
   * @param mixed $credential          
   * @param string $token          
   * @param string $persistentToken          
   * @return int
   */
  public function saveSomething($par1, $par2, $par3) {
    $sql = "INSERT INTO orders(col1, col2, col3) VALUES(?, ?, ?)";
    
    $query = $this->connection->prepare($sql);
    $query->execute(array($par1,$par2,$par3));
  }
}
