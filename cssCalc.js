window.jCalc = function jCalc(){
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
	urlToCss = [];	
	
	window.cssText = [];
	window.cssCalc = {};
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
	
	$.each(
		$('style'),
		function(){
			window.cssText.push($(this).html());
		}
	);
	
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
						parseCalc (limit, css);
					}
				);
			}
		);
		
		
		
		jCalc();
	
	
		delete window.cssText;
	},(urlToCss.length>0)?500:1);
	
	
});


$(document).ready(function(){    
    $(window).resize(function(){
		jCalc();
    }).resize();
});​