<?php 

require_once('./config.php');

if(!is_dir(DATAS)) {

	mkdir(DATAS);
	
	mkdir(CONTENT_DIR);
	mkdir(RECYCLE_DIR);
	mkdir(TEMP_DIR);
	mkdir(LOGS_DIR);

	touch(LOGS_DIR . '/app.json');
	file_put_contents(LOGS_DIR . '/app.json', '[]');
	
	mkdir(OWNERS_DIR, 0777, true);
	mkdir(PUBLISHERS_DIR);
	mkdir(VIEWERS_DIR);
			
	mkdir('../../datas/auth/sign-up-as-owner', 0777, true);
	mkdir('../../datas/auth/sign-up-as-publisher');
	mkdir('../../datas/auth/sign-up-as-viewer');

	$auth = hash('sha512', 'install-start-auth');
	touch('../../datas/auth/sign-up-as-owner/' . $auth);
	header('Location: ../../pages/sign-up/?role=owner&auth=' . $auth);
	exit();
	
}

header('Location: ../../');
exit();