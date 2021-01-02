<?php session_start();

function redirect($url) {
    header('Location: ../../' . $url);
    exit;
}

if(isset($_POST['log-email']) && isset($_POST['log-password'])) {
	
	if(filter_var($_POST['log-email'], FILTER_VALIDATE_EMAIL)) {
		
		if(strlen($_POST['log-password']) >= 8 && strlen($_POST['log-password']) <= 24) {
            
            define('USERNAME', hash('md5', $_POST['log-email'])); // Hash the user email.
            
            // Does the user exist ?
			if(file_exists('../users/' . USERNAME)) {

				// Is the password provided equal to the one registered ?
				if(password_verify($_POST['log-password'], file_get_contents('../users/' . USERNAME))) {
					
					// Purge the temporary directory.
					require_once('./remove.php');
					removeDir(TEMP_DIR_PATH);

					// If necessary, (re)create user folders.
					if(!is_dir(DATAS_DIR_PATH)) {
						if(!mkdir(DATAS_DIR_PATH)) {
							echo error_get_last()['message'];
						}
					}
					if(!is_dir(RECYCLE_DIR_PATH)) {
						if(!mkdir(RECYCLE_DIR_PATH)) {
							echo error_get_last()['message'];
						}
					}
					if(!is_dir(TEMP_DIR_PATH)) {
						if(!mkdir(TEMP_DIR_PATH)) {
							echo error_get_last()['message'];
						}
					}

					// Create a user token then redirect to app.
					require_once('./security.php');
					createAccess();
					redirect(null);
					exit;
				
                }
                
				redirect('?log-error=invalid-creedentials');
			}
			redirect('?log-error=unknown-user');        
        }
		redirect('?log-error=too-short-password');
	}
	redirect('?log-error=invalid-email');
}
redirect('?log-error=too-few-argument');