<?php 

file_put_contents(
	'./env.json',
	json_encode(
		array(
			'instanceId' => hash('sha512', random_bytes(24)),
			'lang' => 'fr',
			'datas' => '../../datas',
			'contentDir' => '../../datas/content',
			'recycleDir' => '../../datas/recyle',
			'ownersDir' => '../../datas/users/owners',
			'publishersDir' => '../../datas/users/publishers',
			'viewersDir' => '../../datas/users/viewers',
			'signUpOwnerAuthDir' => '../../datas/auth/sign-up-as-owner',
			'signUpPublisherAuthDir' => '../../datas/auth/sign-up-as-publisher',
			'signUpViewerAuthDir' => '../../datas/auth/sign-up-as-viewer',
			'tempDir' => '../../datas/temp',
			'logsDir' => '../../datas/logs'
		), 
		JSON_PRETTY_PRINT
	)
);

$env = json_decode(file_get_contents('./env.json'));

if(!is_dir($env->datas)) {

	mkdir($env->datas);
	
	mkdir($env->contentDir);
	mkdir($env->recycleDir);
	mkdir($env->tempDir);
	mkdir($env->logsDir);

	file_put_contents($env->logsDir . '/app.txt', '');
	
	mkdir($env->ownersDir, 0777, true);
	mkdir($env->publishersDir);
	mkdir($env->viewersDir);
			
	mkdir($env->datas . '/auth/sign-up-as-owner', 0777, true);
	mkdir($env->datas . '/auth/sign-up-as-publisher');
	mkdir($env->datas . '/auth/sign-up-as-viewer');

	$auth = hash('sha512', 'install-start-auth');
	touch($env->datas . '/auth/sign-up-as-owner/' . $auth);
	header('Location: ../../pages/sign-up/?role=owner&auth=' . $auth);
	exit();
	
}

header('Location: ../../');
exit();