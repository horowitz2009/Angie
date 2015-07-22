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
  public function saveOrder($username, $status, $data) {
    $sql = "INSERT INTO orders(user, status, data) VALUES(?, ?, ?)";
    
    $query = $this->connection->prepare($sql);
    $query->execute(array($username, $status, $data));
    return $this->connection->lastInsertId();
  }

  public function loadOrder($username, $id) {
    $sql = "SELECT data, status FROM orders WHERE user = ? AND id = ?  LIMIT 1";
    /*stmt = $dbh->query($sql);
  $result = $stmt->setFetchMode(PDO::FETCH_NUM);
  while ($row = $stmt->fetch()) {
    print $row[0] . "\t" . $row[1] . "\t" . $row[2] . "\n";*/
  
    $query = $this->connection->prepare($sql);
    $query->execute(array($username, $id));
    $query->setFetchMode(PDO::FETCH_NUM);
    if ($row = $query->fetch()) {
      $obj = json_decode($row[0]);
      $obj->id = $id;
      $obj->status = $row[1];
      $res = json_encode($obj);
      return $res;
    }
    return null;
  
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
