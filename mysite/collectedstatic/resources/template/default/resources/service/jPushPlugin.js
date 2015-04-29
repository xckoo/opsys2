/*
* jPushPlugin.js
* name:xiaojia 小嘉
* email:iatt@qq.com
* qq:273142650
* time:2012.8.8 9:51
*/

jPushPlugin = {

	data: {

		menuData: null

	},

	init: function (def) {
		this.menu(def);
	},
	
	systemSetInit: function () {
		
		this.updateUserInfo();
		
		this.userInfoEvent();
		
	},
	
	updateUserInfo: function () {
		
		var body = $('.system-body');
		
		jPushUser.refresh();
		
		body.find('select:[name=defaultScreen] option:[value=' +this.getUserInfo('screen') + ']').attr('selected', true);
		
		body.find(':radio:[name=defaultSearch]:[value="' + this.getUserInfo('searcher') + '"]').attr('checked', true);
		
	},
	
	userInfoEvent: function () {
		var _this = this;
		
		var body = $('.system-body');
		
		var defaultScreen = body.find('select:[name=defaultScreen]');
		
		var defaultSearch = body.find(':radio:[name=defaultSearch]');
		
		defaultScreen.on('change', function () {
            var screen = $("#defaultscreen").val();
            $.ajax({
                type : 'POST',
                url  : '/SetUserScreen/',
                dataType:'json',
                data : {screen:screen},
                success: function(data, status){
                    AutoHideAlert(data.ret, data.msg);
                }
            });
			
		});
		
		defaultSearch.on('click', function () {
            var searcher = $(this).val();
			$.ajax({
                url : '/SetUserSearch/', 
                data: {search: searcher},
                type: 'POST',
                dataType : 'json',
                success: function(data, status){
                    jPushInit.SetSearch(searcher);
                    AutoHideAlert(data.ret, data.msg);
                }
			
		    });
        });
	},
	
	getUserInfo: function (key) {
        if (key == 'screen')
		    return parseInt(jPushUser.userInfo().screen) + 1;
		
		return jPushUser.userInfo()[key];
		
	},

	menuLang: function () {

		var lang = jPushDefaultLanguage;

		$('#PluginMenu_Theme div').html(lang.plugin.theme);

	},

	menuScrollBar: function () {

		jQuery.jScroll.load('#application-center .applic-menu-list', {

			margin: 'auto 0px 0 0'

		});

	},

	bodyScrollBar: function () {

		jQuery.jScroll.load('#application-center .applic-body');

	},

	menu: function (def) {

		this.getMenuData();

		this.menuEvent();

		this.menuLang();

		this.defaultMenu(def);

	},

	defaultMenu: function (def) {
		
		if (typeof def != 'undefined') {
			
			$('#PluginMenu_' + def).click();

		} else {
			
			$('#application-center .applic-menu-list ul li:eq(0) div').click();

		}

	},

	menuEvent: function () {

		var _this = this;

		var time = 400;

		var menuList = $('#application-center .applic-menu-list ul li:[class!=space]');

		menuList.click(

			function (e) {

				if ($(e.target).is('span.less div')) {

					return;

				}

				$('.applic-menu-title').html($(this).find('div:eq(0)').html());

				$('div.active').removeClass('active');

				$(this).find('div:eq(0)').addClass('active');

				$('span.less').stop();

				$('span.less').slideUp(time);

				$(this).find('span.less').stop();

				$(this).find('span.less').slideDown(time);

				$('span.less div').removeClass('bold');

				setTimeout(_this.menuScrollBar, time + 10);

			}

		);

		menuList.find('span.less div').click(

			function () {

				$('span.less div').removeClass('bold');

				$(this).addClass('bold');

			}

		);

		$('#PluginMenu_Theme').click(

			function () {

				_this.getThemeList();

			}

		);

	},

	setApp: function (obj, screen) {

        var state = false;

		if (jPushUser.userState() == 200) {

			var lang = jPushDefaultLanguage;
	
			var id = $('#application_' + obj['id'] + '_list');
	
			if (id.size() > 0) {
				screen = id.parent().index() + 1;
				$.jLayer.alert(lang.alert.addApp.replace(/{num}/ig, screen));
				return;
			}
            pos = screen + 1;
			//$.post(jPushTemplate.getUserData('addUserApp'), {appID: obj['id'], screen: screen});

            $.ajax({

                type: 'POST',

                url: '/AddApp/',

                data:{game:game, area:area, device:device, pos:pos, appid:obj['id']},
                
                dataType: 'json',
                async: false,
                success: function (datas, status) {
                    AutoHideAlert(datas.ret, datas.msg);
                    if (datas.ret == 0)
                    {
                        screen = $('#app-main ul').eq(screen);
                        jPushApplication.setApp(obj, screen, pos);
                        state = true;
                    }
                }
                
            });
		} else {
			jPushInit.login();
		}
        return state;
	},

	appContextmenu: function (list, obj) {

		var _this = this;

		var lang = jPushDefaultLanguage;

		list.click(

			function (e) {

				_this.setApp(obj, jPushInit.data.defaultScreen);
                var id = 'jPush_ApplicationCenter';
                $('#'+id+' .jqe-ui-jLayer-layer-head-fn-close').click();
                $('.more-app').click();
			}

		);

		jQuery.jContextmenu.load(list, 'contextmenu', [

			[lang.plugin.addApp, function (th) {

				th.click();

			} ],

			[lang.plugin.addAppTo, [

				[jPushDefaultLanguage.contextmenu.screen1, function () {

					_this.setApp(obj, 0);

				} ],

				[jPushDefaultLanguage.contextmenu.screen2, function () {

					_this.setApp(obj, 1);

				} ],

				[jPushDefaultLanguage.contextmenu.screen3, function () {

					_this.setApp(obj, 2);

				} ],

				[jPushDefaultLanguage.contextmenu.screen4, function () {

					_this.setApp(obj, 3);

				} ],

				[jPushDefaultLanguage.contextmenu.screen5, function () {

					_this.setApp(obj, 4);

				} ]

			]]

		]);

	},

	getApplication: function (data) {
		
		var list, obj, tr, tdSize;

		var _this = this;

		var wh = 80;

		$.ajax({

			type: 'POST',

			url: '/GetAppList/',

            data:{game:game, area:area, device:device},
			
			dataType: 'json',

			beforeSend: function () {

				_this.beforeSend();

			},

			success: function (datas, status) {
                var applist = datas.appList;
				_this.newData();
                if (applist.length == 0){
                    $('<h4 style="text-align:center; margin-top:200px;">木有应用可以添加了...</h4>').appendTo('.applic-body-data');
                }
                for (i = 0; i < applist.length; i++){
                    obj = applist[i];
                    if (obj['ico'] == '' || typeof obj['ico'] == 'undefined') {
                        obj['ico'] = '/static/img/application.png';
                    }
					list = $('<li class="app-center-td" title="' + obj['title'] + '"><span class="hide">'+obj['searchname']+'</span><div class="applic-theme-img"><img src="' + obj['ico'] + '" width="' + wh + '" height="' + wh + '" /></div><div class="applic-theme-tit">' + obj['name'] + '</div><div class="applic-theme-explain">' + '2015-03-26 11:12:00' + '</div></li>').appendTo('.applic-body-data');
					jPushPlugin.drawImage(list.find('img'), wh, wh, wh, wh);
						_this.appContextmenu(list, obj);
				}
				_this.success();
                $("#app-search").hideseek();
			}
		});

	},

	menuClick: function (obj, key, type) {

		var _this = this;

		obj.on('click', function (e) {

			if (e.target == this) {

				_this.getApplication({key: key, type: type});

			}

		});

	},

	menuData: function () {

		var _this = this;

		var xmlData = this.data.menuData.children('add');

		var li, name, key;

		var less, lessli, lessKey, lessName;

		var menuList = $('#application-center .applic-menu-list ul li.space:last');

		xmlData.each(

			function () {

				name = $(this).attr('name');

				key = $(this).attr('key');
				
				type = $(this).attr('menutype');

				if (typeof name == 'undefined' && typeof key == 'undefined') {

					$('<li class="space"></li>').insertBefore(menuList);

				} else {

					li = $('<li id="PluginMenu_' + key + '"><div>' + name + '</div></li>').insertBefore(menuList);

					_this.menuClick(li.find('div'), key, type);

					less = $(this).find('add');

					if (less.size() > 0) {

						less = $('<span class="less"></span>').appendTo(li);

						$(this).find('add').each(

							function () {

								lessKey = $(this).attr('key');

								lessName = $(this).attr('name');
								
								lessType = $(this).attr('menutype');

								lessli = $('<div id="PluginMenu_' + lessKey + '">' + lessName + '</div>').appendTo(less);

								_this.menuClick(lessli, lessKey, lessType);

							}

						);

					}

				}

			}

		);

		_this.menuScrollBar();

	},

	getMenuData: function () {

		var _this = this;

		$.ajax({

			type: 'GET',

			url: jPushTemplate.getXmlData('PluginMenu'),

			async: false,

			cache: false,
			
			dataType: 'xml',

			success: function (xmlHttp) {

				_this.data.menuData = $(xmlHttp).find('PluginMenu');

				_this.menuData();

			}

		});

	},

	drawImage: function (dom, width, height, fitWidth, fitHeight) {

		if (width > 0 && height > 0) {

			if (width / height >= fitWidth / fitHeight) {

				if (width > fitWidth) {

					$(dom).css('width', fitWidth + 'px');

					$(dom).css('height', (height * fitWidth) / width + 'px');

				} else {

					$(dom).css('width', width + 'px');

					$(dom).css('height', height + 'px');

				}

			} else {

				if (height > fitHeight) {

					$(dom).css('height', fitHeight + 'px');

					$(dom).css('width', (width * fitHeight) / height + 'px');

				} else {

					$(dom).css('width', width + 'px');

					$(dom).css('height', height + 'px');

				}

			}

		}

	},

	beforeSend: function () {

		$('.applic-beforeSend').fadeTo(300, 0.35);

	},

	success: function () {

		$('.applic-beforeSend').fadeTo(300, 0, function () {

			$(this).hide();

		});

		$('#application-center .applic-body').scrollTop(0);

		this.bodyScrollBar();

	},

	newData: function () {

		var body = $('#application-center .applic-body');

		body.find('.applic-body-data').remove();

		body.append('<ul class="applic-body-data"></ul>');

	},

	setTheme: function (list) {

		list.bind('click',

			function () {
				
				jPushInit.data.theme.href = $(this).find('img').attr('class');

				jPushInit.data.theme.width = $(this).find('img').attr('width');

				jPushInit.data.theme.height = $(this).find('img').attr('height');

				jPushInit.createTheme();
				
				jPushInit.setUserTheme();

			}

		);

	},

	ThemeContextmenu: function (list) {

		var lang = jPushDefaultLanguage;

		jQuery.jContextmenu.load(list, 'contextmenu', [

			[lang.themeMenu.set, function (obj) {

				$(obj).click();

			} ]

		]);

	},

	getThemeList: function () {

		var list, obj, tr;

		var _this = this;

		$.ajax({

			type: 'GET',

			url: jPushTemplate.getXmlData('ThemeData'),
			
			dataType: 'xml',

			beforeSend: function () {

				_this.beforeSend();

			},

			success: function (xmlHttp) {

				_this.newData();

				$(xmlHttp).find('xmlData ThemeList add').each(

					function () {

						obj = $(this);

						if (obj.index() % 3 == 0) {

							tr = $('<tr></tr>').appendTo('.applic-body-data');

						}

						list = $('<td class="app-center-td" title="' + obj.attr('name') + '"><div class="applic-theme-img"><img src="' + obj.attr('thumbnail') + '" width="' + obj.attr('width') + '" height="' + obj.attr('height') + '" class="' + obj.attr('url') + '" /></div><div class="applic-theme-tit">' + obj.attr('name') + '</div><div class="applic-theme-explain">' + obj.attr('explain') + '</div></td>').appendTo(tr);

						jPushPlugin.drawImage(list.find('img'), obj.attr('width'), obj.attr('height'), 207, 100);

						list.find('img').show();

						_this.setTheme(list);

						_this.ThemeContextmenu(list);

					}

				);

				tdSize = $('.applic-body-data').find('tr:last td').size();

				if (tdSize < 3) {

					for (var i = 0; i < 3 - tdSize; i++) {

						$('.applic-body-data').find('tr:last').append('<td></td>');

					}

				}

				_this.success();

			}

		});

	}

}
