<?
/*
  Данный скрипт предназначен для запуска скриптов из консоли
  с возможностью использования привычных нам функций в mpfunc.php, а так же
  для работы в других проектах(скриптах) где не требуется целый движок, но 
  было бы хорошо так же иметь возможность использовать функции
*/
mb_internal_encoding("UTF-8");
date_default_timezone_set('Europe/Moscow');
$old_chdir = realpath('.');
chdir(__DIR__);
$path_to_config = "./include/config.php";
$path_to_function = "../../mpak.cms/include/mpfunc.php";

if($path_to_config and file_exists($path_to_config)){
	include_once($path_to_config);
}else{
	$conf['db']['conn'] = null;
	$conf['db']['type'] = 'mysql';
	$conf['db']['prefix'] = 'mp_';
	$conf['db']['host'] = 'localhost';
	$conf['db']['login'] = 'username';
	$conf['db']['pass'] = 'password';
	$conf['db']['name'] = 'basename';
	$conf["db"]["open_basedir"] = '.:.:/tmp';
	$arg['modpath'] = "modpath";
}

$conf['db']['conn'] = new PDO("{$conf['db']['type']}:host={$conf['db']['host']};dbname={$conf['db']['name']};charset=UTF8", $conf['db']['login'], $conf['db']['pass'], array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC));
if($conf['db']['type'] == "mysql"){
	$conf['db']['conn']->exec("set names utf8"); # Prior to PHP 5.3.6, the charset option was ignored
}

if(file_exists($path_to_function)){
	include $path_to_function;
}else{
	die("File not found: '$path_to_function'.\nCD_Folder: '".realpath('.')."'\n");
}
chdir($old_chdir);
/*
	any code
	rb('mp_table_name');
*/
?>
