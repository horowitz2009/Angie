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
