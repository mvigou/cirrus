<?php 

require_once('./config.php');

if(isAuthenticated() && hasWritingRights()) {

	if(isset($_POST['item'])) {

		// Empty recycle bin.
		if($_POST['item'] === 'RECYCLE') {
			$_POST['item'] = RECYCLE_DIR;	
		}

		// Request made from the datas directory ? MOVE to recycle.
		if(inDatasDirectory($_POST['item'])) {
			moveToRecycle($_POST['item']);
		}
		
		// Request made from the recycle directory ? REMOVE permanently.
		else if(inRecycleDirectory($_POST['item'])) {
			
			if(is_file($_POST['item'])) {
				unlink($_POST['item']);
			}
			
			else {
				removeDir($_POST['item']);
			}
		
		}

		echo json_encode(array('state' => 'success'));

	}

}

function moveToRecycle($elm) {

	$fileName = array_slice(explode('/', $elm), -1)[0];
	$fromPath = $elm;
	$toPath = RECYCLE_DIR . '/' . $fileName;

	// Prevents overwriting of items with the same name.
	while(is_file($toPath) || is_dir($toPath)) {
		$toPath .= '-copy';
	}
	
	rename($fromPath, $toPath);

}

function removeDir($dir) {
	
	foreach(array_diff(scandir($dir), array('..', '.')) as $item) {

		if(is_file($dir . '/' . $item)) {
			unlink($dir . '/' . $item);
		}

		else {
			removeDir($dir . '/' . $item);	
		}

	}

	// If not corresponding to the recycle or temp directories, remove also the parent directory.
	if($dir !== RECYCLE_DIR && $dir !== TEMP_DIR) {
		rmdir($dir);
	}
	
}