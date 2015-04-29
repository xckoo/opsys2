/*
 * jPushLanguage.js
 * name:xiaojia 小嘉
 * email:iatt@qq.com
 * qq:27314265d0
 * time:2012.4.10 16:27
*/

jPushLanguage = {

	load: function () {

		this.Default();

	},

	Default: function () {

		var lang = jPushDefaultLanguage;

		if (typeof lang == 'undefined') {

			return;

		}

		document.title = lang.title;

		$('.mid-login .registered a').html(lang.registered);

		$('.mid-login .registered a').attr('title', lang.reg);

		$('#screen-menu .exp-button .set').attr('title', lang.applicationcenter);

		$('#screen-menu .exp-button .search').attr('title', lang.searchTitle);

		$('#search input').val(lang.searchExplain);

		$('#search a').attr('title', lang.searchTitle);

		$('#menu-left .oper-list a:eq(0)').attr('title', lang.input);

		$('#menu-left .oper-list a:eq(1)').attr('title', lang.voice);

		$('#menu-left .oper-list a:eq(2)').attr('title', lang.operation);

		$('#menu-left .oper-list a:eq(3)').attr('title', lang.theme);
		
        //$('.app-system-myfm-loading').html(lang.player.loading);

	}

}
