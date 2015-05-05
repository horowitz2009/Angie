<?php
function findCollection($arr, $name) {
	foreach ( $arr as $coll ) {
		if ($coll->name == $name) {
			return $coll;
		}
	}
	return null;
}
function updateDocument(&$data, $obj) {
	for($i = 0; $i < count ( $data ); $i ++) {
		$docLokiId = $data [$i]->{'$loki'};
		$objLokiId = $obj->{'$loki'};
		if ($docLokiId == $objLokiId) {
			$data [$i] = $obj;
			return;
		}
	}
}
function removeDocument(&$data, $objLokiId) {
	for($i = 0; $i < count ( $data ); $i ++) {
		$docLokiId = $data [$i]->{'$loki'};
		if ($docLokiId == $objLokiId) {
			array_splice ( $data, $i, 1 );
			return;
		}
	}
}
function updateCollections(&$db, &$collections, $changes) {
	foreach ( $changes as $change ) {
		echo "<br>";
		$coll = findCollection ( $collections, $change->name );
		if ($coll != null) {
			
			if ($change->operation == "I") {
				echo "INSERT: ";
				echo var_dump ( $change );
				array_push ( $coll->data, $change->obj );
				$lokiId = $change->obj->{'$loki'};
				$coll->maxId = $lokiId;
				array_push ( $coll->idIndex, $lokiId );
			} elseif ($change->operation == "U") {
				echo "UPDATE: ";
				echo "LOKI:" . $change->obj->{'$loki'};
				$lokiId = $change->obj->{'$loki'};
				echo var_dump ( $change );
				
				updateDocument ( $coll->data, $change->obj );
				echo "AFTER UPDATE: ";
				echo var_dump ( $change );
			} elseif ($change->operation == "R") {
				echo "REMOVE: ";
				echo var_dump ( $change );
				$lokiId = $change->obj;
				removeDocument ( $coll->data, $lokiId );
				
				for($i = 0; $i < count ( $coll->idIndex ); $i ++) {
					if ($coll->idIndex [$i] == $lokiId) {
						array_splice ( $coll->idIndex, $i, 1 );
						break;
					}
				}
			}
		}
	}
}

$stringData = isset ( $_POST ['data'] ) ? $_POST ["data"] : null;
$dbname = $_POST ["dbname"];
$changes = isset ( $_POST ['changes'] ) ? $_POST ["changes"] : null;

// $myFile = "log.txt";
// $fh = fopen($myFile, 'w') or die("can't open file");
// fwrite($fh, $dbname);
// fclose($fh);

$servername = "localhost";
$username = "zhristov";
$password = "totaasha";

// Create connection
$conn = new mysqli ( $servername, $username, $password, "felt" );

// Check connection
if ($conn->connect_error) {
	die ( "Connection failed: " . $conn->connect_error );
}
echo "Connected successfully";

$sql = "SELECT name FROM lokidbs WHERE name='$dbname'";
$result = $conn->query ( $sql );

if ($result->num_rows > 0) {
	
	if ($changes != null) {
		$stmt = $conn->prepare ( "SELECT data FROM lokidbs where name = '$dbname'" );
		$stmt->execute ();
		$stmt->store_result ();
		$stmt->bind_result ( $value );
		$res = $stmt->fetch ();
		if ($res) {
			$stringData = $value;
		} else {
			$stringData = ""; // not good
		}
		
		// $stmt->close ();
		
		$db = json_decode ( $stringData );
		
		$collections = $db->collections;
		$changesObj = json_decode ( $changes );
		updateCollections ( $db, $collections, $changesObj );
		$stringData = json_encode ( $db );
	}
	
	// update
	if ($stringData != null) {
		$sql = "UPDATE lokidbs SET data='$stringData' WHERE name='$dbname'";
		
		if ($conn->query ( $sql ) === TRUE) {
			echo "Record updated successfully";
		} else {
			echo "Error updating record: " . $conn->error;
		}
	}
} else {
	// insert
	$sql = "INSERT INTO lokidbs (name, data) VALUES ('$dbname', '$stringData')";
	
	if ($conn->query ( $sql ) === TRUE) {
		echo "New record created successfully";
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error;
	}
}

// $conn->close ();

?>