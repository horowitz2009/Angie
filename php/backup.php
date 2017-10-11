<!DOCTYPE html>
<html>
<body>

  <h1>BACKUP DB</h1>

<?php

$filename='database_backup_'.date('G_a_m_d_y').'.sql';

//C:\prj\wamp\bin\mysql\mysql5.6.17\bin> .\mysqldump.exe -u zhristov -ptotaasha felt --result-file=hmm4.sql

$result=exec('mysqldump felt --password=totaasha --user=zhristov --single-transaction --result-file='.$filename, $output);

if($output==''){/* no output is good */
  echo "<p>Backup done. File is: ".$filename."</p>";
}

else {/* we have something to log the output here*/
  echo "<p>Error occured!</p>";
}


?>


</body>
</html>

