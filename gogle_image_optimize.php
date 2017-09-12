<?php
//https://developers.google.com/speed
$text="
Сжатие страницы https://testspbmsk.ve-zy.ru/img/callout.png уменьшит ее размер на 2,7 КБ (87 %).
Сжатие страницы https://testspbmsk.ve-zy.ru/img/logo.png уменьшит ее размер на 1,7 КБ (28 %).
";

preg_match_all("#(https?:\/\/[\w]+[^ \,\"\n\r\t<]*)[^\r]+\((\d+)\s+%\)#iu",trim($text),$match);

$urls = $match[1];
$proc = $match[2];

foreach($urls as $k=>$v){
	
	$file = realpath(preg_replace("#^/#iu","",parse_url($v,PHP_URL_PATH)));
	
	switch(mb_strtolower(pathinfo($file,PATHINFO_EXTENSION),'UTF-8')) {
		case 'jpg':
			$cmd = "jpegoptim -s --size=".(100 - intval($proc[$k]))."% {$file}";
			break;
		case 'jpeg':
			$cmd = "jpegoptim -s --size=".(100 - intval($proc[$k]))."% {$file}";
			break;
		case 'png':
			$cmd = "optipng -o7 {$file}";
			break;
	}
	exec($cmd);
	
}
echo "OK!\n"

?>
