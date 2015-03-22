/*	
	Скрипт предназначен для фикса работы css значения calc(100% - 100px);
	В старых браузерах (сафари или opera 12.12) это свойство во все не работает
	А в новых нужно нарисовать извращенчески длинную запись.
	Тк каждый браузер понимает по своему приходится писть свойства для каждого отдельно.
	Пример тупой записи в новых браузерах:
	
		div.class{
			height: 80%; //для тупых браузеров
			height: calc(100% - 320px);
			height: -moz-calc(100% - 320px);
			height: -webkit-calc(100% - 320px);
		}
		
	Зачем, спрашивается, страдать такой фигнёй? 
	И, ведь, всеравно даже такая длинная запись не будет работать в старых браузерах.
	Подключив и настроив этот скрипт, снимается необходимость писать извращенческие стили,
	Достаточно будет написать примерно так:
	
		div.class{height: calc(100% - 320px);}
		
	Такая запись полностью соответствует правилам css и легко читается, 
	При этом работает везде, где только подключен, jQuery.
	
	
	это только первая и сырая версия
	в последующем можно будет сделать
		- автоматическое определение необходимости задержки
		- если уже есть window.cssCalc то уже не надо его создавать
		- метод с возможностью указания своих таблиц слилей, который сможет пресоздать конфигурацию window.cssCalc 
		  он будет выводить в консоль json массив нового window.cssCalc 
		- возможно будет лучше его переписать в формате ОПП
	
	вся идея состоит в том, что нужно дать возможность пользователю принять решение
		- пусть скрипт каждый раз отрабатывает по полной 					// удобно при разработке или когда стилей мало и нагрузка минимальна
			или
		- пусть работает только с уже ранее сгенерированным массивом		// может потребоваться для оптимизации работы
		
		
	Некоторые могут задуматься - А не удобнее ли написать все на jQuery и не парится?
	 -  В производительности сомневаюсь, что у вас получится сильно выйграть.
	 -  В некоторых случаях это реально удобнее, когда таких свойств отсилы  2-6, 
		при этом эти значения не зависят от ширины или высоты самого окна браузера.
	 -  Предствим, что вы решились на такой смелый шаг писать все такие стили на jQuery,
		и если у вас заглючит код то все! пиши пропало - ничего не работает
	 -  В слуае использования даного скрипта вы будете использовать привычный css,
		который в случаее отказа javascript будет нормально отображать страницу в "нормальных" браузерах
*/


//изменяем scc значения 
function jCalc(){
	$.each(
		window.cssCalc,
		function(key,val){
			if(key.match(/\(\s*(max|min)-(width|height)\s*:\s*(\d+)px\s*\)/gim)){
				
				var enable = true;
				key = JSON.parse(key);
				var params = {width:$( window ).width(),height:$( window ).height()};
				for(k in key){
					key[k] = key[k].replace(/and\s*|[\(\)\s]|px/gi,'');
					key[k] = key[k].split('-');
					key[k][1] = key[k][1].split(':');
					key[k][1][1] = parseInt(key[k][1][1]);
					if(key[k][0]=='max'){
						if(params[key[k][1][0]] > key[k][1][1]){
							enable = false;
						}
					}else if(key[k][0]=='min'){
						if(params[key[k][1][0]] <= key[k][1][1]){
							enable = false;
						}
					}
					if(enable){
						$.each(
							val,
							function(keyMedia,valMedia){
								$(keyMedia)
								.css(valMedia.atribute, valMedia.value[0])
								.css(valMedia.atribute, valMedia.value[1]+'='+valMedia.value[2]);							
							}
						);
					}				
				}
			}else{						
				$(key)
				.css(val.atribute, val.value[0])
				.css(val.atribute, val.value[1]+'='+val.value[2]);
			}
		}
	);
}


$( document ).ready(function(){
	
	//массив с путями до слилей которые будем парсить
	urlToCss = [];	
	
	window.cssText = [];
	window.cssCalc = {};
	
	//перебираем указанные стили
	$.each(
		urlToCss,
		function(key,url){
			$.ajax({
				url: url,
				success: function(data){
					window.cssText.push(data);
				}
			});
		}
	);
	
	//перебираем все стили в html
	$.each(
		$('style'),
		function(){
			window.cssText.push($(this).html());
		}
	);
	
	//парсим в зоне только необходимые свойства и запоминаем их
	function parseCalc(limit, css){		
		$.each(
			css.split('}'),
			function(k,v){
				if(v.match('calc')){
					v = v.trim().split('{');
					$.each( 
						v[1].split(';'),
						function(k2,v2){
							if(v2.match(/\s*([\w-_]*)\s*:\s*calc/im)){
								v2 = v2.split(':');
								var value = v2[1].trim().split(' ');
								value[0] = value[0].replace(/calc\s*\(\s*/i,'');
								value[2] = value[2].replace(/\s*\)\s*/i,'');
								if(limit !== 'noLimit'){									
									window.cssCalc[limit][v[0]] = {atribute:v2[0].trim(),value:value}
								}else{
									window.cssCalc[v[0]] = {atribute:v2[0].trim(),value:value}
								}							
							}
						}
					);
				}
			}
		);
	}

	//распиливаем правила css по @media зонам
	setTimeout(function(){
		$.each(
			window.cssText,
			function(key,text){
				$.each(
					text.split('@media'),
					function(keyCss, css){
						var limit = css.match(/and\s*\(\s*(max|min)-(width|height)\s*:\s*(\d+)px\s*\)/gim);
						if(limit !== null){
							css = css.replace(/^[^}\n]*{|[^}]*}[^}]*$/ig,'').trim();
							limit = JSON.stringify(limit);
							window.cssCalc[limit] = {};								
						}else{
							limit = 'noLimit';
						}
						//отдаем в парсер правил
						parseCalc (limit, css);
					}
				);
			}
		);
		
		
		
		jCalc();
	
	
		delete window.cssText;
	},500);
	
	
});


$(window).resize(function(){
	jCalc();
});