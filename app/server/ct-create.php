<?php 

/* 
Job : create a new directory in the current directory.
Return : success if it's done.
To : createDirectory
*/

require_once('./config.php');


if(verifyAccess()) {

	if(isset($_POST['parent']) && isset($_POST['dirs'])) {		
	
		if(inScopeDirectory($_POST['parent'])) {
			
			/*
			1. Separate parents with ||
			2. Separate levels with >>
			3. Separate children with &&

			Examples:
			parent1 >> child1a && child1b || parent2 >> child2a >> child2b || parent3
			parent1 >> child1a >> child1aX && child1Y || parent2 >> child2a && child2b && child2c 

			The result of a>>b&&c>>d (not good) is equal to a>>b&&c&&d (good) : this is not ok.
			*/
			
			$parents = explode('||', $_POST['dirs']);
			
			foreach($parents as $parent) {

				$basePath = $_POST['parent'];
				$levels = explode('>>', $parent);

				foreach($levels as $level) {

					$children = explode('&&', $level);

					if(count($children) > 1) {

						foreach($children as $child) {
							
							$child = trim($child);
							
							if(strlen($child) >= 1) {

								$dirName = $basePath . '/' . buildValidName($child);

								if(!is_dir($dirName)) {
									mkdir($dirName);
								}

							}


						}

					} 

					else {

						$level = trim($level);
					
						if(strlen($level) >= 1) {

							$dirName = $basePath . '/' . buildValidName($level);
							
							if(!is_dir($dirName)) {
								mkdir($dirName);
							}

						}

						$basePath .= '/' . $level;

					}

				}

			}

			echo 'success';

		}
	
	}

}