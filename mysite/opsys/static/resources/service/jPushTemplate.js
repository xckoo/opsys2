/*
* jPushTemplate.js
* name:xiaojia 小嘉
* email:iatt@qq.com
* qq:273142650
* time:2012.4.2 16:44
*/

jPushTemplate = {

	debug: false,

	data: {

		templateConfig: null,

		serviceList: [],

		defaultPage: 'default'

	},

	refresh: function () {

		this.data.templateConfig = null;

	},

	init: function () {

		this.getTemplate();

		this.getStyle();

		this.getServiceList();
        
		this.loadFileNum();

		this.getServiceFile(0);
        
	},

	loadFileNum: function () {

		jPush.loadingData.template.all = this.data.serviceList.length;

	},

	load: function (key) {

		if (typeof key == 'undefined') {

			key = 'default';

		}

		this.defaultPage = key;

		this.init();

	},

	getStyle: function () {

		var url;

		var _this = this;

		this.getFilePages().find('style add').each(

			function () {

				url = $(this).attr('value');

				if (document.createStyleSheet) {

					document.createStyleSheet(url);

				} else {

					$('<link href="' + url + '" rel="stylesheet" type="text/css" />').appendTo('head');

				}

			}

		);

	},

	getServiceList: function () {

		var _this = this;

		this.getFilePages().find('script add').each(

			function () {

				_this.data.serviceList.push($(this).attr('value'));

			}

		);

	},

	getServiceFile: function (num) {

		if (num >= this.data.serviceList.length) {

			return;

		}

		var script = jPush.appendScript(this.data.serviceList[num]);

		jPush.ready(script, function () {

			jPush.loadingSuccess('template');

			jPushTemplate.getServiceFile(++num);

		});

	},

	getTemplate: function () {

		var _this = this;

		var xmlHttp;

		xmlHttp = this.getTemplateConfig();

		xmlHttp.find('file pages:[key=' + this.defaultPage + '] node add').each(

			function () {

				_this.getTemploatePages($(this).attr('value'), $(this).attr('key'));

			}

		);

	},

	getFilePages: function () {

		return this.getTemplateConfig().find('file pages:[key=' + this.defaultPage + ']');

	},

	getConfig: function () {

		return this.getTemplateConfig().find('defaultConfig');

	},

	getXmlData: function (key) {

		return this.getTemplateConfig().find('xmlData add:[key=' + key + ']').attr('value');

	},
	
	getUserData: function (key) {
		
		return this.getTemplateConfig().find('userData add:[key=' + key + ']').attr('value');
		
	},

	getTemploatePages: function (url, node) {

		$.ajax({

			type: 'GET',

			url: url,

			async: true,

			cache: !this.debug,

			dataType: 'html',

			success: function (xmlHttp) {

				$(xmlHttp).appendTo(node);

			}

		});

	},

	getTemplateConfig: function () {

		var _xmlHttp;

		if (this.data.templateConfig != null) {

			return this.data.templateConfig;

		} else {

			$.ajax({

				type: 'GET',

				url: jPush.data.Config.defaultTemplate,

				dataType: 'xml',

				async: false,

				cache: !this.debug,

				success: function (xmlHttp) {

					_xmlHttp = $(xmlHttp).find('templateConfig');

				}

			});

			this.data.templateConfig = _xmlHttp;

			return this.data.templateConfig;

		}

	}

}
