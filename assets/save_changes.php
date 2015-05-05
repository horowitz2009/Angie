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
			array_splice($data, $i, 1);
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
				array_push($coll->idIndex, $lokiId);
				
				
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
				removeDocument($coll->data, $lokiId);
				
				for($i = 0; $i < count ( $coll->idIndex ); $i ++) {
					if ($coll->idIndex[$i] == $lokiId) {
					  array_splice($coll->idIndex, $i, 1);
					  break;
					}
				}
			}
		}
	}
}

$stringData = $_POST ["data"];

$changes = json_decode ( $stringData );
if ($changes != null && is_array ( $changes )) {
	// good
	
	$myFile = "general.json";
	$fh = fopen ( $myFile, 'r' ) or die ( "can't open file" );
	$dbString = fread ( $fh, filesize ( $myFile ) );
	$db = json_decode ( $dbString );
	
	$collections = $db->collections;
	
	echo var_dump ( $db );
	
	updateCollections ( $db, $collections, $changes );
	
	fclose ( $fh );
	
	$fh = fopen ( $myFile, 'w' ) or die ( "can't open file" );
	$newStr = json_encode ( $db );
	echo var_dump ( $newStr );
	fwrite ( $fh, $newStr );
	
	fclose ( $fh );
}

?>