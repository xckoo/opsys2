/*
* jPushApplication.js
* name:xiaojia 小嘉
* email:iatt@qq.com
* qq:273142650
* time:2012.4.1 10:32 愚人节~
*/

var jPushApplication = {

	debug: true,

	data: {

		nowApp: null,

		applicationlist: null

	},

	refresh: function () {

		this.data.applicationlist = null;

	},
	
	getWindow: function (windowID) {
		
		return $(windowID).contents();
		
	},

	setApp: function (app, ul, pos) {
		var id = 'application_' + app['id'] + '_list';
		
		if (app['ico'] == '' || typeof app['ico'] == 'undefined') {
			app['ico'] = '/static/img/application.png';
		}

		var dom = $('<li class="app-main-li" key="' + app['id'] + '" id="' + id + '" title="' + app['title'] + '"><div class="ico"><img src="' + app['ico'] + '"/></div><div class="tit-bg"></div><div class="tit-tx">' + app['name'] + '</div><div class="transparent"></div></li>').insertBefore(ul.find('.more-app'));

		jQuery.jSwap.load(ul, dom);

		jPushApplication.bind(dom, app, 2, pos);

	},

	moveApp: function (dom, to_screen, from_screen, appid) {
		
		var state = jPushUser.userState();
		
		if (state == 200) {
            $.ajax({
                type: 'POST',
                url: '/MoveApp/',
                dataType : 'json',
                data:{game:game, area:area, device:device, from_pos:from_screen, to_pos:to_screen, appid:appid},
                success : function (datas, status){
                    AutoHideAlert(datas.ret, datas.msg);
                    if (datas.ret == 0){
                        to_screen --;
                        $(dom).insertBefore($('#app-main ul').eq(to_screen).find('.more-app'));
                    }
                }
            });
		} else {
			jPushInit.login();
		}

	},
	
	removeApp: function (dom, appid, pos) {
		var state = jPushUser.userState();
		if (state == 200) {
            $.ajax({
                type: 'POST',
                url: '/RemoveApp/',
                dataType : 'json',
                data:{game:game, area:area, device:device, pos:pos, appid:appid},
                success : function (datas, status){
                    AutoHideAlert(datas.ret, datas.msg);
                    if(datas.ret == 0){
			            dom.remove();
                    }
                }
            });
		} else {
			jPushInit.login();
		}
	},
	moreApp: function (ul) {
		var lang = jPushDefaultLanguage;
		var dom = $('<li class="app-main-li more-app"><div class="ico"><img src="/static/resources/template/default/resources/style/images/more-app.png"/></div><div class="tit-bg"></div><div class="tit-tx">' + lang.moreApp + '</div><div class="transparent"></div></li>').appendTo(ul);
		dom.on('click', function () {
			jPushInit.applicationCenter();
		});
	},

	getAppList: function () {

		var appXml;

		var ul;

		var _this = this;
		
        myscreen = this.getUserApps();
        
        for (i = 1; i <= 5; i++){
            pos = '' + i;
            perscreen = myscreen[pos];
			ul = $('<ul style="display:none;"></ul>').appendTo('#app-main');
			_this.moreApp(ul);

            for (j = 0; j < perscreen.length; j++){
				_this.setApp(perscreen[j], ul, pos);
			}
        }
        shortcut = myscreen['0'];
        for (i= 0; i < shortcut.length; i++){
				var dom;
				var app = shortcut[i];
				if (app['ico'] == '' || typeof app['ico'] == 'undefined') {
			        app['ico'] = '/static/img/application.png';
				}

				dom = $('<li class="app-menu-li" key="' + app['id'] + '" id="application_' + app['id'] + '_list" title="' + app['title'] + '"><div class="app-menu-ico"><img src="' + app['ico'] + '"/></div><div class="transparent"></div></li>').appendTo('#menu-left .app-list ul:eq(0)');

				jPushApplication.bind(dom, app, 1, '0');
		}

	},

	contextmenu: function () {

		var _this = this;

		var lang = jPushDefaultLanguage;

		jQuery.jContextmenu.load(document.body, 'contextmenu', [

			[lang.contextmenu.ShowDesktop, function () {

				var domList = jQuery.jLayer.domList;

				for (var val in domList) {

					$('#' + val).hide();

				}

			} ],

			[lang.theme, function () {

				$('.oper-list .o4').click();

			}, '|'],

			[lang.operation, function () {

				$('.oper-list .o3').click();

			} ],

			[lang.applicationcenter, function () {

				jPushInit.screenMenuSet();

			} ],

			[lang.contextmenu.process, function () {

				var layerData = {

					id: 'jPush_SystemProcess',

					title: lang.contextmenu.process,

					MenuData: {

						name: lang.contextmenu.process,

						icon: jPushTemplate.getConfig().find('add:[key=SystemIcon]').attr('value')

					},

					width: '430px',

					height: '570px',

					minWidth: 430,

					minHeight: 570

				};

				var url = jPushTemplate.getFilePages().find('plugin add:[key=process]').attr('value');

				jPushApplication.getLayer(layerData, url);

			}, '|'],
			
            [lang.changeArea, function () {
			    jPushInit.SelectVer(false);
            }],

			[lang.logout, function () {

				$.get('/logout/', function () {

					location.reload();

				});

			} ],

			[lang.about, function () {
                msg = '欢迎 '+jPushUser.userName() +' 使用炫彩酷游管理端';
                AutoHideAlert(0, msg);
			}, '|']

		]);

		$(document).bind('click',

			function () {

				jQuery.jContextmenu.close(0);

			}

		);

	},

	bind: function (dom, app, type, pos) {
		var _this = this;

		var state = jPushUser.userState();

		if (type != 1) {
	
			var menuList = [
	
				[jPushDefaultLanguage.contextmenu.open, function () {
	
					dom.click();
	
				} ]
	
			];
				
			menuList.push([jPushDefaultLanguage.contextmenu.move, [

				[jPushDefaultLanguage.contextmenu.screen1, function () {
					_this.moveApp(dom, 1, pos, app['id']);
				} ],

				[jPushDefaultLanguage.contextmenu.screen2, function () {
					_this.moveApp(dom, 2, pos, app['id']);
				} ],

				[jPushDefaultLanguage.contextmenu.screen3, function () {
					_this.moveApp(dom, 3, pos, app['id']);
				} ],

				[jPushDefaultLanguage.contextmenu.screen4, function () {
					_this.moveApp(dom, 4, pos, app['id']);
				} ],

				[jPushDefaultLanguage.contextmenu.screen5, function () {
					_this.moveApp(dom, 5, pos, app['id']);
				} ]
			]]);

			menuList.push([jPushDefaultLanguage.contextmenu.uninstall, function () {
				_this.removeApp(dom, app['id'], pos);
			}]);
			jQuery.jContextmenu.load(dom, 'contextmenu', menuList);
		}

		dom.bind('click',
			function () {
				if (state != 200) {
					jPushInit.login();
				} else {

					var id = 'application_' + app['id'];

					var _this = $(this);

                    var iframe, parent, url, layerData, key;

                    appConf = {
                        'src'   :   '/GetOneApp/',
                        'size'  :   '1',
                        'width' :   '680px',
                        'height':   '600px'
                    };
                    url = appConf['src'];
                    var hash = url.match(/#.*/ig);
                    url = url.replace(/#.*/ig, '');
                    if (url.search(/\?/ig) != -1) {
                        url += '&layerID=' + id;
                    } else {
                        url += '?layerID=' + id;
                    }
                    url += hash;
                    //url += '&appid=' + app.attr('id');
                    url += '&appid='+ app['id'] +'&game='+game + '&area='+area+'&device='+device ;
                    layerData = {
                        title: app['name'],
                        id: id,
                        MenuData: {
                            name: app['name'],
                            icon: app['ico']
                        }
                    }
                    for (key in appConf){
                        if (key != 'src')
                        {
                            layerData[key] = appConf[key];
                        }
                    }
                    jPushApplication.getLayer(layerData, url);
                    $('#'+id).css('display', 'none'); //配合加载应用页面高度调整，在应用页面display:block
				}

			}

		);

	},

	getLayer: function (json, url, callback) {
		json['close'] = function () {
			jPushApplication.menu();
			jPushApplication.hash('');
		}
		json['drag'] = function () {
			jPushApplication.menu(json.id);
		}
		
		var MenuDataName = jPushDefaultLanguage.nullWindowName;
		
		if (typeof json['title'] != 'undefined') {
			
			MenuDataName = json['title'];
			
		}
			
		if (typeof json.MenuData == 'undefined') {
			
			json.MenuData = {
			
				name: MenuDataName,
				
				icon: jPushTemplate.getConfig().find('add:[key=ApplicationIcon]').attr('value')
				
			};
			
		} else {
		
			if (typeof json.MenuData.name == 'undefined' ) {
				
				json.MenuData.name = MenuDataName;
				
			}
			
			if (typeof json.MenuData.icon == 'undefined') {
				
				json.MenuData.icon = jPushTemplate.getConfig().find('add:[key=ApplicationIcon]').attr('value');
				
			}
		
		}

		var box = $.jLayer.layer(json);
		
		if (typeof box != 'object') {
			
			return;
			
		}

		var body = box.find('.jqe-ui-jLayer-layer-body');

		var success = function () {

			box.find('.jqe-ui-jLayer-layer-body .loading').fadeOut(500, function () {
                
				$(this).remove();

			});

		}
		
		if (typeof json.windowID == 'undefined') {
						
			var iframeID = json.id + '_iframe';
		} else {
			var iframeID = json.windowID;
		}
		
		if (url.search(/\?/ig) > -1) {
			
			url += '&';
			
		} else {
		
			url += '?';
		
		}
		
		url += 'webosWindowID=' + iframeID;

		if (typeof callback != 'undefined') {

			$.get(url, function (xmlHttp) {

				    $(xmlHttp).appendTo(body);

				    callback();

				    success();
			});

		} else {

			var iframe = $('<iframe id="' + iframeID + '" frameborder="0" allowtransparency="true" width="100%" height="100%" src="' + url + '"></iframe>').appendTo(body);

		}
		
		if (typeof json.notWebos == 'undefined') {

			jPushApplication.hash(json.id + '_list');
		
		}

		jPushApplication.menu(json.id);
        $('#app-search').css("display", "none");


	},

	menu: function (id) {

		var dom, style;

		var menu = $('#menu-bottom ul');

		var domList = jQuery.jLayer.domList;

		menu.html('');

		for (var val in domList) {

			dom = $('#' + val + '_list');

			if (val == id) {

				style = 'cur';

				this.data.nowApp = val;

			} else {

				style = 'nor';

			}

			app = $('<li class="' + style + '" title="' + domList[val].config.MenuData.name + '"><div class="big"><img src="' + domList[val].config.MenuData.icon + '" /></div><div class="tit">' + domList[val].config.MenuData.name + '</div><div class="transparent"></div></li>').appendTo(menu);

			jPushInit.menuBottomMouse(app, val);

		}

	},

	hash: function (value) {

		if (typeof value == 'undefined') {

			return top.location.hash;

		} else {

			top.location.hash = value;

		}

	},

	appScreen: function (app) {

		return $('#app-main ul').index(app.parent());

	},

	getUserApps: function () {

		var _applicationlist;
		if (this.data.applicationlist != null) {

			return this.data.applicationlist;

		} else {
			$.ajax({

				type: 'POST',

				url: '/GetUserApps/',
                
                async: false,

				dataType: 'json',
                data:{game:game, area:area, device:device},
				success: function (data, status) {
                    if (data.ret == 0){
					    _applicationlist = data.content;
                    }
                    else{
                        alert("请求失败:" + data.msg + ",请更换帐号或联系伟大哥");
                        window.location.href = '/logout/';
                    }
				}
			});
		}
        this.data.applicationlist = _applicationlist;
        return this.data.applicationlist;
	}

}
