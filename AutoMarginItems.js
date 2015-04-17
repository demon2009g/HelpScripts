//<div dinamic-item-margin="грамоты_item|20" style="width:100%;">

function AutoMarginItems(){
	$('[dinamic-item-margin]').each(function(key,value){
		var param = $(this).attr('dinamic-item-margin').split('|');	
		var children = $(this).children('.'+param[0]);
		var Wbox = $(this).width();
		var Witem = children.width();	
		var Q = Math.floor(Wbox/(Witem+parseInt(param[1])));			
		var margin = (Wbox - (Witem * Q))/(Q-1) -5;
		console.log(Q +' - '+ margin +' - '+ Wbox);
		children.each(function(Ikey,Ivalue){
			if(Q == 1){					
				$(Ivalue).css('margin-right', ((Wbox-Witem)/2)+'px');
				$(Ivalue).css('margin-left', ((Wbox-Witem)/2)+'px');
			}else if(Q == 2){
				$(Ivalue).css('margin-right', (margin/4)+'px');
				$(Ivalue).css('margin-left', (margin/4)+'px');
			}else{
				$(Ivalue).css('margin-left', "0");
				if((Ikey+1)%Q==0){
					$(Ivalue).css('margin-right', "0");
				}else{
					$(Ivalue).css('margin-right', margin+'px');
				}
			}
		});
	});
}
$( document ).ready(function(){
AutoMarginItems();
});

$( document ).ready(function() {
    $(window).resize(function(){
		AutoMarginItems();
    }).resize();
});