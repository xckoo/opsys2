/*
* jPushInit.js
* name:xiaojia 小嘉
* email:iatt@qq.com
* qq:273142650
* time:2012.4.2 16:45
*/

var jPushInit = {

	data: {

		theme: {},

		defaultScreen: 2,

        searcher: 'http://www.baidu.com/s?wd=',

        menuleftApps: null,

        islogin: true

	},

	init: function () {

		this.applicationMouse();

		this.MenuLeft();

		this.screenMenu();

		this.masks();

		this.search();

		this.config();

		this.resize();

		this.chrome();

		this.getTheme();

		this.createTheme(true);
		
        this.keys();  //注册键盘事件

        this.MenuLeftApp();

        this.Welcome();

	},
    Welcome: function(){
        var pin = $('#pin .pin-box');
        pin.html('');
        $('<h4>您好，'+jPushUser.userName()+'</h4><p>欢迎使用炫彩管理中心</p>').appendTo(pin);
        $('<p>版本：'+jPushUser.GameArea()+'</p>').appendTo(pin);
    },

    /*--左侧边栏应用为静态应用，设置在application文件夹--*/
    MenuLeftApp: function(){//{{{
        var _this = this;
        var appXml = this.getMenuConf();

        appXml.find('shortcut app').each(
            function () {
                var dom;
                var app = $(this);
                if (app.attr('ico') == '' || typeof app.attr('ico') == 'undefined') {
                    app.attr('ico', '/static/img/application.png');
                }
                dom = $('<li class="app-menu-li" key="' + app.attr('id') + '" id="application_' + app.attr('id') + '_list" title="' + app.attr('name') + '"><div class="app-menu-ico"><img src="' + app.attr('ico') + '"/></div><div class="transparent"></div></li>').appendTo('#menu-left .app-list ul:eq(0)');
                
                _this.appbind(dom, app);
            }
        );
    },
    appbind: function(dom, app){
        dom.bind('click', function(){
            var id = 'application_' + app.attr('id');
            var _this = $(this);
            $.ajax({
                type: 'GET',
                url: app.attr('config'),
                cache: !this.debug,
                dataType: 'xml',
                success: function (xmlHttp) {
                    var iframe, parent, url, layerData, key;
                    xmlHttp = $(xmlHttp).find('applicationConfig');
                    url = xmlHttp.find('add:[key=src]').attr('value');
                    var hash = url.match(/#.*/ig);
                    url = url.replace(/#.*/ig, '');
                    if (url.search(/\?/ig) != -1) {
                        url += '&layerID=' + id;
                    } else {
                        url += '?layerID=' + id;
                    }
                    url += hash;
                    layerData = {
                        title: app.attr('name'),
                        id: id,
                        MenuData: {
                            name: app.attr('name'),
                            icon: app.attr('ico')
                        }
                    }
                    xmlHttp.find('add').each(
                        function () {
                            key = $(this).attr('key');
                            if (key != 'src') {
                                layerData[key] = $(this).attr('value');
                            }
                        }
                    );
                    jPushApplication.getLayer(layerData, url);
                }
            });
        });
             
    },
    getMenuConf: function(){
      
        var _menuleftapps = null;

        if (this.data.menuleftApps != null) {
            return this.data.menuleftApps;
        } else {
            $.ajax({
                type: 'GET',
                url: '/static/xmlDataBase/userApplication.xml',
                async: false,
                cache: false,
                dataType: 'xml',
                success: function (xmlHttp) {
                    _menuleftapps = $(xmlHttp);
                }
            });
            this.data.menuleftApps = _menuleftapps;
            return this.data.menuleftApps;
        }
    },//}}}

    /*--注册键盘事件可在此添加--*/
    keys: function() {//{{{
        $(document).keydown(function(event){
            //alert(event.keyCode);
            if (event.keyCode == 27){
                $('#search').css('display', 'none');
		        var domList = jQuery.jLayer.domList;
                var maxIndex = 0;
                var active_id;
                for (var keyid in domList){
                    var index = parseInt($('#'+keyid).css("z-index"));
                    if (index > maxIndex){
                        maxIndex = index;
                        active_id = keyid;
                    }
                }
                $('#'+active_id+' .jqe-ui-jLayer-layer-head-fn-close').click();
            }
            else if (event.ctrlKey && event.keyCode == 222){
                $('.exp-button .search').click();
            }
        }); 
    }, //}}}
	
	resize: function () {//{{{

		$(window).bind('resize',

			function () {

				jPushInit.MenuLeft();

				jPushInit.autoTheme();

				jPushInit.masks();

			}

		);

	},

	chrome: function () {
		if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
			$(window).scroll(function () {
			    $(this).scrollTop(0);
			});
		}
	},

	ie6PNG: function () {

		if (typeof DD_belatedPNG != 'undefined' && $.browser.msie) {

			DD_belatedPNG.fix('.ie6PNG,.ie6PNG:hover');

		}

	},//}}}
    
	config: function () {//{{{

		var _this = this;
		
		var lang = jPushDefaultLanguage;

		var SystemIcon = jPushTemplate.getConfig().find('add:[key=SystemIcon]').attr('value');

		$('.oper-list .o1').bind('click', function () {

            var layerData = {
                id: 'jPush_PhoneBook',
                title: '炫彩通讯录',
                width: '300px',
                height: '586px',
                size: 0
            };
            jPushApplication.getLayer(layerData, '/PhoneBook/');
        });

		$('.oper-list .o2').bind('click',function () {
            
        });

		$('.oper-list .o3').bind('click',

			function () {
				if (jPushUser.userState() == 200) {
					var layerData = {
						id: 'jPush_SystemSet',
						title: jPushDefaultLanguage.SystemSet,
						MenuData: {
							name: jPushDefaultLanguage.SystemSet,
							icon: SystemIcon
						},
						width: '800px',
						height: '450px',
						size: 0
					};
					var url = jPushTemplate.getFilePages().find('plugin add:[key=SystemSet]').attr('value');
					jPushApplication.getLayer(layerData, url, function () { 
						jPushPlugin.systemSetInit();
					});
				} else {
					jPushInit.login();
				}
			}
		);

		$('.oper-list .o4').bind('click',

			function () {

				_this.applicationCenter('Theme');

			}

		);
        $('#SelectVer .close').click(function(){
            $('#masks').remove();
            $('#SelectVer').hide();
        });
        
        $('#showbox .close').click(function(){
            $('#masks').remove();
            $('#showbox').hide();
        });

	},//}}}

    /* 搜索相关*/
	search: function () {//{{{

		var val;

		var text = jPushDefaultLanguage.searchExplain;

        var _this = this;

		$('#search input').bind('blur',

			function () {

				val = $(this).val();

				if (val.length <= 0) {

					$(this).val(text);

				}

			}

		);

		$('#search input').bind('focus',

			function () {

				val = $(this).val();

				if (val == text) {

					$(this).val('');

				}

			}

		);

		$('#search a').bind('click',

			function () {

				$(this).parents('form').submit();

			}

		);

		$('#search form').bind('submit',

			function () {

				var val = $(this).find('input').val();
				var url = _this.data.searcher + encodeURIComponent(val);

				var layerData = {

					id: 'jPush_Search',

					title: jPushDefaultLanguage.searchTitle,

					MenuData: {

						name: jPushDefaultLanguage.searchTitle,

						icon: jPushTemplate.getConfig().find('add:[key=SearchIcon]').attr('value')

					},

					width: '1024px',

					height: '600px',

					bodyBG: ''

				}

				jPushApplication.getLayer(layerData, url);

				return false;

			}

		);

	},//}}}
    
    SetSearch: function(val){
        this.data.searcher = val;           
    },

	login: function () {
        window.location.href = '/logout/';
	},
    /*屏幕主题图片设置，仅前端*/	
	setUserTheme: function () {//{{{

		var href = this.data.theme.href;

		var width = this.data.theme.width;

		var height = this.data.theme.height;
		
		$.post(jPushTemplate.getUserData('updateTheme'), {href: href, width: width, height: height});
		
	},

	screenTheme: function () {

		var winW, imgW;

		var screen = this.data.defaultScreen;

		var config = this.data.theme;

		winW = $(window).width();

		imgW = config.img.width();

		config.img.stop();

		config.img.animate({

			left: (winW - imgW) / 4 * screen + 'px'

		}, 500, 'easeOutCirc');

	},

	autoTheme: function () {

		var windowW, windowH, p1, p2;

		var config = this.data.theme;

		windowW = $(window).width();

		windowH = $(window).height();

		p1 = windowW / windowH;

		p2 = config.width / config.height;

		if (p1 >= p2) {

			config.img.css({

				width: windowW + 'px',

				height: 'auto'

			});

		} else {

			config.img.css({

				width: 'auto',

				height: windowH + 'px'

			});

		}

		this.screenTheme();

	},

	createTheme: function (t) {

		var _this = this;

		var themeImg = $('#theme .theme .themeImg');

		themeImg.html('<img src="' + this.data.theme.href + '"/>');

		this.data.theme['img'] = themeImg.find('img');

		themeImg.find('img').load(

			function () {

				_this.showApplicationList();

				_this.autoTheme();

			}

		);

	},

	getTheme: function () {
		this.data.theme = {
			href: '/static/resources/static/theme/theme_' + area + '.jpg',
			width: '2526',
			height: '1080'
		};
	},//}}}

    /*遮挡层*/
	masks: function () {

		$('#main #masks').css({

			width: $(window).width(),

			height: $(window).height()

		});

	},

    /*应用中心窗口注册*/
	applicationCenter: function (key) {//{{{

		var lang = jPushDefaultLanguage;
		
		var layerData = {

			id: 'jPush_ApplicationCenter',

			title: lang.applicationcenter,

			MenuData: {

				name: lang.applicationcenter,

				icon: jPushTemplate.getConfig().find('add:[key=SystemIcon]').attr('value')

			},

			width: '964px',

			height: '586px',

			size: 0

		};

		var url = jPushTemplate.getFilePages().find('plugin add:[key=ApplicationCenter]').attr('value');

		jPushApplication.getLayer(layerData, url, function () {

			jPushPlugin.init(key);

		});

	},//}}}

	screenMenuSet: function () {

		this.applicationCenter();

	},

	screenMenuSearch: function (obj) {//{{{

		var l, t;

		var search = $('#search');

		obj = $(obj);

		l = obj.offset().left - 185;

		t = obj.offset().top + 33;

		search.css({

			top: t + 'px',

			left: l + 'px',

			display: 'block'

		});

		search.find('input').focus();

	},//}}}

    /*中间小导航条的各种实现, 滚轮事件 拖动事件 点击事件*/
	screenMenu: function () {//{{{

		var windowW;

		var _sM = $('#screen-menu');

		var _sMLi = _sM.find('.menu-list ul li');

		var bp = ['-334px', '-364px', '-393px', '-424px', '-454px'];

		var bphover = ['-137px', '-178px', '-217px', '-258px', '-298px'];

		var menuBg = ['-5px', '20px', '45px', '69px', '94px'];

		var _this = this;

		var headImg = _sM.find('.head-img');

		windowW = $(window).width();

		_sM.css('left', (windowW / 2 - 240 / 2) + 'px');

		headImg.append('<img src="/static/resources/static/head/head_1.png"/>');

		headImg.find('.transparent').attr('title', jPushUser.userName());
		
		headImg.find('.transparent').on('click', function () {
		
			if (jPushUser.userState() != 200) {
			
				jPushInit.login();
			
			} else {
                //msg = '欢迎 '+jPushUser.userName()+' 使用炫彩酷游管理端';
                //AutoHideAlert(0, msg);
                jPush.ShowBox(true);
			}
		
		});

		$('.exp-button .set').on('click',

			function () {

				jPushInit.screenMenuSet();

			}

		);

		$('.exp-button .search').on('click',

			function () {

				jPushInit.screenMenuSearch(this);

			}

		);

		$(document).on('mousedown',

			function (e) {

				var target = $(e.target);

				if (!target.is('#search *')) {

					$('#search').hide();

				}
			}

		);

		_sMLi.on('mouseover',

			function () {

				$(this).css('background-position', bphover[$(this).index()] + ' -129px');

			}

		);

		_sMLi.on('mouseout',

			function () {

				$(this).css('background-position', bp[$(this).index()] + ' -129px');

			}

		);

		_sMLi.on('click',

			function () {

				var _this = $(this).parent().parent().find('.menu-bg');

				var _index = $(this).index();

				var theme;

				_this.stop();

				_this.animate({ left: menuBg[_index] }, 200);

				$('#app-main ul').stop();

				if ($.browser.msie) {

					$('#app-main ul').css('display', 'none');

					$('#app-main ul:eq(' + _index + ')').css('display', '');

				} else {

					$('#app-main ul').fadeOut(300);

					$('#app-main ul:eq(' + _index + ')').fadeIn(500);

				}

				theme = $('#theme .theme .themeImg img');

				jPushInit.data.defaultScreen = _index;

				jPushInit.screenTheme();

			}

		);

		$('#screen-menu *:not(a,.head-img,.menu-list li,.transparent)').jDrag('#screen-menu', {

			top: 10,

			left: 10,

			right: $(window).width() - $('#screen-menu').width() - 10,

			bottom: $(window).height() - $('#screen-menu').height() - 50,

			up: function () {

				$('#search').hide();

			}

		});

		$('#main').mousewheel(function (e, i) {

			var target = $(e.target);
			
			if (target.is('.app-menu-li *')) {
				
				return;
				
			}

			var screenIndex = _this.data.defaultScreen;

			if (i < 0) {

				if (screenIndex < 5) {

					_this.gotoScreen(screenIndex + 1);

				}

			} else {

				if (screenIndex > 0) {

					_this.gotoScreen(screenIndex - 1);

				}

			}

		});
        var ismousedown = false;
        var save_pos = 0;
        var startMove = function(event){
            if(!ismousedown)
                return;
			var screenIndex = _this.data.defaultScreen;
            if (event.clientX % 5 == 0){
                var now_pos = event.clientX;
                if (save_pos > now_pos && screenIndex < 5){
					_this.gotoScreen(screenIndex + 1);
                    ismousedown = false;
                }
                else if(save_pos < now_pos && screenIndex > 0){
					_this.gotoScreen(screenIndex - 1);
                    ismousedown = false;
                }
            }
        };
        var endMove = function(){
            $('#app-main').unbind('mousemove', startMove).unbind('mouseup', endMove);
        };
        var downDo = function(event){
            save_pos = event.clientX;
            ismousedown=true;
            $('#app-main').mousemove(startMove).mouseup(endMove);
        }; 
        $('#app-main').bind('mousedown', downDo);        

	},//}}}

	gotoScreen: function (index) {

		$('#screen-menu .menu-list ul li').eq(index).click();

	},

	showApplicationList: function () {

		var screenIndex = 2;
		
        var userDefault = jPushUser.userInfo().screen;

        this.SetSearch(jPushUser.userInfo().searcher);

		var app = $(jPushApplication.hash());

		if (app.size() > 0) {

			scrrenIndex = jPushApplication.appScreen(app);

			app.click();

		} else {

			scrrenIndex = userDefault;

		}

		if (scrrenIndex == -1) {

			scrrenIndex = userDefault;

		}

		this.data.defaultScreen = scrrenIndex;

		this.gotoScreen(scrrenIndex);

	},

	menuBottomMouse: function (app, dom) {

		$(app).click(

			function () {

				if (jPushApplication.data.nowApp == dom || $('#' + dom).css('display') == 'none') {

					jQuery.jLayer.minimize('#' + dom);

				} else {

					jQuery('#' + dom + '_list').click();

					jPushApplication.hash = dom + '_list';

					jPushApplication.menu(dom);

				}

				jPushApplication.data.nowApp = null;

			}

		);

	},

	applicationMouse: function () {

		document.onselectstart = function () { return false; }

		$(document.body).contextmenu(

			function (event) {

				var target = $(event.target);

				if (target.is('#app-main,ul')) {

					return false;

				}

			}

		);

	},

    SelectVer: function () {
        
        if (arguments.length == 1)
            this.data.islogin = arguments[0]; //如果非登录调用该函数，传入false
		
        if (this.data.islogin && jPushUser.userInfo().lastlogin != ''){
            jPushUser.setGameArea(jPushUser.userInfo().str_cn);
            return this.ChooseGame(jPushUser.userInfo().lastlogin);
        }

        var main = $('#main');
        var options = '';
        var flag = false;
        $.ajax({
            type: 'POST',
            url: '/SelectRight/',
            async : false,
            dataType: 'json',
            data:{islogin : this.data.islogin},
            success: function(data, status){
                
                if (data.ret == 0)
                    options = data.options;
                
                else if (data.ret == 1){  
                    options = data.str;
                    jPushUser.setGameArea(data.str_cn);
                    flag = true;
                }
                else{
                    alert(data.msg);
                    window.location.href = '/logout/';
                }
            }
        });
        if (flag && this.data.islogin) 
            return this.ChooseGame(options);
		
        main.append('<div id="masks"></div>');
        $('#disabledSelect').html("");
        $('#disabledSelect').append(options);
        
        if (this.data.islogin == false){
            var selected = game + '_' + area + '_' + device;
            $('#disabledSelect').val(selected);
        }
		$('#SelectVer').show();
		var loginTop = ($(window).height() / 2 - $('#SelectVer').height() / 2 - 80);
		if (loginTop <= 0) {
			loginTop = 20;
		}
		$('#SelectVer').css({
			left: ($(window).width() / 2 - 280 / 2) + 'px',
			top: loginTop + 'px'
		});
        if (this.data.islogin)
            $('#SelectVer .close').css('display','none');
    },
    ChooseGame: function() {
        var selected = '';
        if(arguments.length == 1)
            selected = arguments[0];
        else{
            selected = $.trim($("#disabledSelect").val());
            jPushUser.setGameArea($('#disabledSelect').find('option:selected').text());
        }
        if (selected == ''){
            alert("选择为空");
            return False;
        }
        var items = new Array;
        items = selected.split("_");
        game = items[0];
        area = items[1];
        device = items[2];
        if (!this.data.islogin || jPushUser.userInfo().lastlogin == ''){
            $.ajax({
                url: '/LastLogin/',
                type:'POST',
                data: {game:game, area:area, device:device},
                dataType:'json',
                success:function(datas, status){
                    //alert('ret:'+datas.ret+', msg:'+datas.msg);
                    location.reload();
                }
            });
            return 0;
        }
        
        HtmlInit();

		$('#masks').remove();
	    $('#SelectVer').hide();
    },

	MenuLeft: function () {//{{{

		var mTop, mLeft, wWidth, wHeight, style;

		wWidth = $(window).width();

		wHeight = $(window).height();

		mTop = (wHeight / 2) - (569 / 2) + 'px';

		$('#menu-left').css({

			top: mTop

		});

		width = wWidth - 100;

		height = wHeight - 80;

		mTop = 50;

		mLeft = wWidth - width;

		if ($.browser.msie) {

			style = {

				width: width + 'px',

				height: height + 'px',

				top: mTop + 'px',

				left: mLeft + 'px'

			};

		} else {

			style = {

				width: height + 'px',

				height: width + 'px',

				top: mTop - ((width - height) / 2) + 'px',

				left: mLeft + ((width - height) / 2) + 'px'

			};

		}

		$('#app-main').css(style);
    }//}}}
};

//$.getJSON(jPushTemplate.getConfig().find('add:[key=WeatherAPI]').attr('value') + '?callback=?', function (json, status) {

	//alert(json.future.name);

//});
