<?php 
mkdir('../../datas/', 0777);
file_put_contents('../../datas/env.json', json_encode(
	array('cirrusId' => date('Y-m-d') . '-' . hash('sha512', random_bytes(24))))
);
if(!is_dir('../../datas/users/owners')) {
	mkdir('../../datas/content');
	mkdir('../../datas/recyle');
	mkdir('../../datas/temp');
	mkdir('../../datas/logs');
	file_put_contents('../../datas/logs/app-errors.txt', '');
	mkdir('../../datas/users/owners', 0777, true);
	mkdir('../../datas/users/publishers');
	mkdir('../../datas/users/viewers');		
	mkdir('../../datas/auth/sign-up-as-owner', 0777, true);
	mkdir('../../datas/auth/sign-up-as-publisher');
	mkdir('../../datas/auth/sign-up-as-viewer');
	mkdir('../../datas/auth/sign-up-as-visitor');
	$auth = hash('sha512', 'install-start-auth');
	touch('../../datas/auth/sign-up-as-owner/' . $auth);
	header('Location: ../../pages/sign-up/?role=owner&auth=' . $auth);
	exit();
}
header('Location: ../../');
exit();