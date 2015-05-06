<?php
namespace Birke\Rememberme\Storage;

require_once __DIR__ . '/DB.php';
require_once __DIR__ . '/PDO.php';

/**
 * Store login tokens in database with PDO class
 *
 * @author birke
 */
class PDOCart extends PDO {

  /**
   *
   * @param mixed $credential          
   * @param string $token          
   * @return int
   */
  public function findToken($credential, $token) {
    $sql = "SELECT token FROM {$this->tableName} WHERE {$this->tokenColumn} = SHA1(?)" .
       " AND {$this->credentialColumn} = ? AND {$this->expiresColumn} > NOW() LIMIT 1";
    
    $query = $this->connection->prepare($sql);
    $query->execute(array($token,$credential));
    
    $result = $query->rowCount();
    
    if ($result == 1) {
      return self::TRIPLET_FOUND;
    } elseif ($result != 1) {
      return self::TRIPLET_NOT_FOUND;
    }
    
    return self::TRIPLET_INVALID;
  }

  /**
   *
   * @param mixed $credential          
   * @param string $token          
   * @param string $persistentToken          
   * @param int $expire          
   */
  public function storeToken($credential, $token, $expire = 0) {
    $sql = "INSERT INTO {$this->tableName}({$this->credentialColumn}, " .
       "{$this->tokenColumn}, {$this->expiresColumn}) VALUES(?, SHA1(?), ?)";
    
    $query = $this->connection->prepare($sql);
    $query->execute(array($credential,$token,date("Y-m-d H:i:s", $expire)));
  }

  public function saveCart($credential, $token, $data, $expires = 0) {
    $sql = "UPDATE {$this->tableName} SET {$this->dataColumn} = ?, {$this->expiresColumn} = ? " .
       "WHERE {$this->credentialColumn} = ? AND {$this->tokenColumn} = SHA1(?) ";
    
    $query = $this->connection->prepare($sql);
    $query->execute(array($data,date("Y-m-d H:i:s", $expires),$credential,$token));
  }

  /**
   *
   * @param mixed $credential          
   * @param string $token          
   * @return int
   */
  public function loadCart($credential, $token) {
    $sql = "SELECT {$this->dataColumn} FROM {$this->tableName} WHERE {$this->tokenColumn} = SHA1(?)" .
       " AND {$this->credentialColumn} = ? AND {$this->expiresColumn} > NOW() LIMIT 1";
    
    $query = $this->connection->prepare($sql);
    $query->execute(array($token,$credential));
    
    $result = $query->fetchColumn();
    
    return $result;
  }
}
