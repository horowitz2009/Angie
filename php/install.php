<!DOCTYPE html>
<html>
<body>

  <h1>Install DB</h1>

<?php
require_once 'DBService.php';

// first simple version of load data to DB

$db = new DBService();

$conn = $db->createPDOConnection();

$sql = "
CREATE TABLE IF NOT EXISTS `carts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `credential` varchar(254) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `token` varchar(254) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `expires` datetime NOT NULL,
  `data` mediumtext CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'loki data',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7
";

$conn->exec($sql);
echo "<p>Table `carts` created.</p>";

$sql = "
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(254) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `status` varchar(15) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `date_placed` datetime NOT NULL,
  `date_changed` datetime NOT NULL,
  `data` mediumtext CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'loki data',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=17
";

$conn->exec($sql);
echo "<p>Table `orders` created.</p>";

$sql = "
CREATE TABLE IF NOT EXISTS `lokidbs` (
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `data` mediumtext CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `time_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
";

$conn->exec($sql);
echo "<p>Table `lokidbs` created.</p>";

// $sql = "SELECT name FROM `lokidbs` WHERE name = 'catalog'";

// $st = $conn->query($sql);
// if ($st && $st->rowCount() == 0) {
  
//   $myfile = fopen("../assets/catalog.txt", "r") or die("Unable to open file!");
//   $dataString = fread($myfile, filesize("../assets/catalog.txt"));
//   fclose($myfile);
  
//   $sql = "
//  INSERT INTO `lokidbs` (`name`, `data`) VALUES('catalog', ?)";
//   $st = $conn->prepare($sql);
//   $st->execute(array($dataString));
//   echo "<p> Inserted " . $st->rowCount() . " rows in lokidbs</p>";
// }

$sql = "
CREATE TABLE IF NOT EXISTS `tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `credential` varchar(254) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `persistentToken` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `token` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `expires` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=122 ;
  
  ";

$conn->exec($sql);
echo "<p>Table `tokens` created.</p>";

$sql = "
CREATE TABLE IF NOT EXISTS `users` (
  `email` varchar(254) COLLATE utf8_bin NOT NULL COMMENT 'email acts as username',
  `password` varchar(200) COLLATE utf8_bin NOT NULL,
  `roles` varchar(50) COLLATE utf8_bin NOT NULL COMMENT 'coma separated list of roles',
  `data` longtext COLLATE utf8_bin NOT NULL COMMENT 'json data goes here',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin  
  ";

$conn->exec($sql);
echo "<p>Table `users` created.</p>";

$sql = "SELECT email FROM `users` WHERE email = 'zhristov@gmail.com'";

$st = $conn->query($sql);
if ($st && $st->rowCount() == 0) {
  $sql = "
  INSERT INTO `users` (`email`, `password`, `roles`, `data`, `created`) 
  VALUES('zhristov@gmail.com', '$2a$10$5b2dced32650cd714e8cdObggCJrpmHcoiVBh.UFktmKxPrm18F7.', 'admin', '', '2015-04-27 23:20:22')
  ";
  
  $cnt = $conn->exec($sql);
  echo "<p> Inserted " . $cnt . " row(s) in users</p>";
}


$sql = "
CREATE TABLE IF NOT EXISTS `stockentries` (
  `category_id` varchar(50) COLLATE utf8_bin NOT NULL,
  `product_id` varchar(50) COLLATE utf8_bin NOT NULL,
  `packaging_id` varchar(50) COLLATE utf8_bin NOT NULL,
  `quantity` int(11) NOT NULL,
  `onhold` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin
  ";

$conn->exec($sql);
echo "<p>Table `stockentries` created.</p>";

?>


</body>
</html>