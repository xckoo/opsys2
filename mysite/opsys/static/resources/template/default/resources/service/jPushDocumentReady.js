/*
 * jPushLanguage.js
 * name:xiaojia 小嘉
 * email:iatt@qq.com
 * qq:27314265d0
 * time:2012.4.10 16:27
*/

function AutoHideAlert(ret, str){
    var note = $("#note");
    note.html("");
    note.removeClass("alert-success");
    note.removeClass("alert-danger");
    if (ret == 0){
        note.addClass("alert-success");
        $("<strong>Well done!</strong>").appendTo('#note');
    }else{
        note.addClass("alert-danger");
        $("<strong>Danger!</strong>").appendTo('#note');
    }
    note.append(str);
    var nowwidth = parseInt(note.css("width").split("px")[0]) + 40;
    var notepos = ($(window).width() - nowwidth) / 2 + 'px';
    note.css({display:'block', top:'-50px', 'left':notepos}).animate({top:'+50', opacity:1}, 200, function(){ 
        setTimeout(out, 800); 
    }); 
   
}
function out(){ 
    $("#note").animate({opacity:0, top:0}, 250, function(){ 
        $(this).css({display:'none', top:'-50px'}); 
    });
}

$(document).ready(

	function () {
        jPushInit.SelectVer();
	}
);


function HtmlInit(){

		jPush.loadingData.templateData.all = 4;

		jPushLanguage.load();

		jPush.loadingSuccess('templateData');
        
        jPushApplication.getAppList();

		jPush.loadingSuccess('templateData');

        jPushInit.init();

		jQuery.jLayer.getTemplate();

		jPush.loadingSuccess('templateData');

		jPushApplication.contextmenu();

		jPush.loadingSuccess('templateData');

		jPushInit.ie6PNG();
}
