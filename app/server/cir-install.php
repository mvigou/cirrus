<?php 

require_once('./cir-config.php');

if(!is_dir(DATAS)) {

	mkdir(DATAS);

	mkdir(CONTENT_DIR);
	mkdir(RECYCLE_DIR);

	mkdir(OWNERS_DIR, 0777, true);
	mkdir(VIEWERS_DIR);
			
	mkdir(SIGN_UP_OWNER_AUTH_DIR, 0777, true);
	mkdir(SIGN_UP_VIEWER_AUTH_DIR);

	$auth = hash('sha512', 'install-start-auth');

	touch(SIGN_UP_OWNER_AUTH_DIR . '/' . $auth);
	
	header('Location: ../../pages/sign-up/?role=owner&auth=' . $auth);
	exit();
	
}

header('Location: ../../');
exit();