/*
* jQueryExtend-1.0.2.js /jLayer/jDrag/jStyle/Hashtable/jContextmenu or 2012.11.12/jSwap/jLoadSwf
* name:xiaojia 小嘉
* email:iatt@qq.com
* qq:273142650
* time:2012.6.1 16:50 六一拉~
*
* 2012.6.28 14:20 我把对你的思念写到源代码里，因为我想像光的速度一样立刻飞到你身边。
*/

"use strict";

jQuery.fn.extend({

	jDrag: function (obj, json) {

		if (typeof json == 'undefined') {

			var json = Object;

		}

		var dY, dX;

		var t, r, l, b;

		var masks1, masks2, zIndex;

		var SupportsTouches = ("createTouch" in document);

		var drag = false;

		var obj = jQuery(obj);

		var msie = 0;

		obj.css('position', 'absolute');

		var StartEvent = SupportsTouches ? "touchstart" : "mousedown";

		var MoveEvent = SupportsTouches ? "touchmove" : "mousemove";

		var EndEvent = SupportsTouches ? "touchend" : "mouseup";

		var SelectstartFn = function () {

			return false;

		}

		var MoveEventFn = function (e) {

			if (drag) {

				var mY, mX;

				mY = e.pageY - dY;
				mX = e.pageX - dX;

				mY < t ? mY = t : null;
				mX < l ? mX = l : null;

				mY > b ? mY = b : null;
				mX > r ? mX = r : null;

				obj.css({

					top: mY + 'px',

					left: mX + 'px'

				});

			}

		}

		var EndEventFn = function () {

			if (drag) {

				if (typeof json.up != 'undefined') {

					json.up();

				}

			}

			drag = false;

			jQuery(masks1).remove();

			jQuery(masks2).remove();

			jQuery(document).unbind('mouseup', EndEventFn);

			jQuery(document).unbind('mousemove', MoveEventFn);

			jQuery(document).unbind('selectstart', SelectstartFn);

		}

		var StartEventFn = function (e) {

			if (e.target != this) {

				return;

			}

			if (SupportsTouches) {

				var e = e.touches.item(0);

			}

			var masksStyle = {

				width: '100%',

				height: '100%',

				position: 'fixed',

				top: 0,

				left: 0,

				background: '#000',

				opacity: 0

			};

			t = json.top;

			r = json.right;

			l = json.left;

			b = json.bottom;

			dY = e.pageY - obj.offset().top;

			dX = e.pageX - obj.offset().left;

			if (obj.hasClass('notDrag')) {

				drag = false;

			} else {

				drag = true;

			}

			if (typeof json.ready != 'undefined') {

				json.ready();

			}

			zIndex = jQuery(obj).css('z-index') - 1;

			masks1 = jQuery('<div style="z-index:' + zIndex + '"></div>').appendTo(document.body);

			masks1.css(masksStyle);

			masks2 = jQuery('<div></div>').appendTo(obj);

			masks2.css(masksStyle);

			jQuery(document).bind(MoveEvent, MoveEventFn);

			jQuery(document).bind('selectstart', SelectstartFn)

			jQuery(document).bind(EndEvent, EndEventFn);

		}

		this.bind(StartEvent, StartEventFn);

	}

});

jQuery.extend({

	jLoadSwf: {
	
		init: function (container, json) {
		
			return this.show(container, json);
		
		},
	
		show: function (container, json) {
			
			var swf;
			
			var param;
			
			json = this.defaultValue(json);
			
			param = this.getParam(json.param);
			
			if ($.browser.msie) {
				
				swf = $('<object id="' + json.id + '" name="' + json.id + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + json.width + '" height="' + json.height + '"><param name="Movie" value="' + json.url + '" /><param name="Src" value="' + json.url + '" />' + param + '</object>').appendTo(container);
				
			} else {
			
				swf = $('<object type="application/x-shockwave-flash" id="' + json.id + '" name="' + json.id + '" data="' + json.url + '" width="' + json.width + '" height="' + json.height + '">' + param + '</object>').appendTo(container);
			
			}
			
			return swf;
			
		},
		
		getParam: function (paramArray) {
			
			var param = [];
			
			for (var i = 0; i < paramArray.length; i++) {
				
				param.push('<param name="' + paramArray[i][0] + '" value="' + paramArray[i][1] + '"/>');
				
			}
			
			return param.join('');
			
		},
		
		defaultValue: function (json) {
			
			if (typeof json == 'undefined') {
				
				json = {};
				
			}
			
			if (typeof json.url == 'undefined') {
				
				json.url = '';
				
			}
			
			if (typeof json.id == 'undefined') {
				
				json.id = '__jLoadSwfID_' + Math.random().substring(2, 5);
				
			}
			
			if (typeof json.width == 'undefined') {
				
				json.width = '1%';
				
			}
			
			if (typeof json.height == 'undefined') {
				
				json.height = '1%';
				
			}
			
			if (typeof json.param == 'undefined') {
				
				json.param = [];
				
			}
			
			return json;
			
		},
	
		load: function (container, json) {
			
			return this.init(container, json);
		
		}
		
	}
	
});

jQuery.extend({

	Hashtable: function () {

		this.items = new Array();

		this.itemsCount = 0;

		this.add = function (key, value) {

			if (!this.containsKey(key)) {

				this.items[key] = value;

				this.itemsCount++;

			} else {

				this.items[key] = value;

			}

		}

		this.get = function (key) {

			if (this.containsKey(key)) {

				return this.items[key];

			} else {

				return null;

			}

		}

		this.remove = function (key) {

			if (this.containsKey(key)) {

				delete this.items[key];

				this.itemsCount--;

			} else {

				throw "key '" + key + "' does not exists."

			}

		}

		this.containsKey = function (key) {

			return typeof (this.items[key]) != "undefined";

		}

		this.containsValue = function containsValue(value) {

			for (var item in this.items) {

				if (this.items[item] == value) {

					return true;

				}

			}

			return false;
		}

		this.contains = function (keyOrValue) {

			return this.containsKey(keyOrValue) || this.containsValue(keyOrValue);

		}

		this.clear = function () {

			this.items = new Array();

			itemsCount = 0;

		}

		this.size = function () {

			return this.itemsCount;

		}

		this.isEmpty = function () {

			return this.size() == 0;

		}

	},

	jContextmenu: {

		debug: false,

		data: {

			zIndex: 1500,

			index: 1500,

			template: null,

			config: null,

			images: null,

			list: [],

			state: {

				template: false

			},

			gradient: {

				menu: 150,

				close: 1000

			}

		},

		init: function (dom, event, json, type) {

			this.loadTemplate();

			this.bind(dom, event, json, type);

		},

		bind: function (dom, event, json, type) {

			var _this = this;

			dom.bind(event,

				function (e) {

					var target = jQuery(e.target);

					_this.menu(e, json, event, type, dom);

					return false;

				}

			);

		},

		load: function (dom, event, json, type) {

			this.init($(dom), event, json, type);

		},

		loadTemplate: function () {

			var _this = this;

			var _images, _xmlData;

			if (!_this.data.state.template) {

				var url = jQuery.jStyle.load('jContextmenu');

				jQuery.ajax({

					type: 'GET',

					url: url,

					cache: !this.debug,

					async: false,

					dataType: 'xml',

					success: function (xmlHttp) {

						_xmlData = $(xmlHttp);

					}

				});

				_images = jQuery.jStyle.path + _xmlData.find('images').text();

				_xmlData.find('style').each(

					function () {

						var style = jQuery(this).text();

						var opacity = style.match(/opacity:(\d?\.\d+);/);

						if (opacity != null && ! +"\v1") {

							style = style.replace(/opacity:(\d?\.\d+);/ig, function(s,a){return 'filter:alpha(opacity=' + (a * 100) + ');'});

						}

						style = style.replace(/{images}/ig, _images);

						jQuery(document.body).append('<style>' + style + '</style>');

					}

				);

				this.data.template = _xmlData.find('body');

				this.data.config = _xmlData.find('config');

				this.data.images = _images;

				this.data.state.template = true;

			}

		},

		close: function (index, time) {

			var _this = this;

			if (typeof index == 'undefined') {

				index = 0;

			}

			if (typeof time == 'undefined') {

				time = 0;

			}

			var fn = function () {

				for (var i = index; i < _this.data.list.length; i++) {

					$(_this.data.list[i]).remove();

					_this.data.zIndex--;

				}

				_this.data.list.splice(index, _this.data.list.length);

			}

			fn();

		},

		closeMore: function (type) {

			clearTimeout(this.data.timeout);

			var index = type.box.css('z-index') - this.data.index;

			this.close(index + 1, this.data.gradient.close);

		},

		event: function (box, obj, ev, dom) {

			var _this = this;

			var type = { box: box, list: obj };

			if (typeof ev == 'function') {

				obj.bind('click', {ev: ev, dom: dom}, function (e) {
					
					e.data.ev(e.data.dom);
					
				});

				obj.bind('mouseover',

					function () {

						_this.closeMore(type);

					}

				);

			} else {

				jQuery.jContextmenu.load(obj, 'mouseover', ev, type);

			}

		},

		getList: function (box, json, dom) {

			var obj;

			var temp = this.config('listTemplate').text();

			var tempMore = this.config('listTemplateMore').text();

			var list = this.config('list').attr('value');

			for (var i = 0; i < json.length; i++) {

				if (typeof json[i][1] == 'function') {

					obj = $(temp.replace(/{menu}/ig, json[i][0])).appendTo(box.find(list));

				} else {

					obj = $(tempMore.replace(/{menu}/ig, json[i][0])).appendTo(box.find(list));

				}

				if (json[i][2] == '|') {

					obj.addClass(this.config('space').attr('value'));

				}

				this.event(box, obj, json[i][1], dom);

			}

		},

		getBody: function (e, type) {

			if (typeof type == 'undefined') {

				this.close();

			} else {

				this.closeMore(type);

			}

			var body = this.data.template.text();

			var box = jQuery('<div></div>').appendTo(document.body);

			box.css({

				position: 'absolute',

				display: 'none'

			});

			box.html(body);

			return box;

		},

		position: function (e, box, type) {

			var t = e.pageY;

			var l = e.pageX;

			if (typeof type == 'object') {

				l = $(type.box).offset().left + $(type.box).width() + parseInt(this.config('left').attr('value'));

				t = $(type.list).offset().top - parseInt(this.config('top').attr('value'));

			}

			var lt = this.overflow(box, l, t, type);

			box.css({

				top: lt.top + 'px',

				left: lt.left + 'px'

			});

		},

		config: function (key) {

			return this.data.config.find('add:[key=' + key + ']');

		},

		overflow: function (box, l, t, type) {

			var wWidth = jQuery(window).width();

			var wHeight = jQuery(window).height();

			if (box.width() + 2 > wWidth - l) {

				l -= box.width();

				if (typeof type == 'object') {

					l -= $(type.box).width() + this.config('left').attr('value') * 2;

				}

			}

			if (box.height() + 2 > wHeight - t) {

				t -= box.height();

				if (typeof type == 'object') {

					t += $(type.list).height() + parseInt(this.config('top').attr('value'));

				}

			}

			return { left: l, top: t };

		},

		menu: function (e, json, event, type, dom) {

			var box;

			var box = this.getBody(e, type);

			var list = this.getList(box, json, dom);

			box.css('z-index', this.data.zIndex);

			box.fadeIn(this.data.gradient.menu);

			this.data.list.push(box);

			this.position(e, box, type);

			this.data.zIndex++;

		}

	},

	jSwap: {

		data: {

			drag: false,

			copy: $(),

			obj: null

		},

		EventData: {

			StartEvent: "mousedown",

			MoveEvent: "mousemove",

			EndEvent: "mouseup",

			StartEventFn: null,

			MoveEventFn: null,

			EndEventFn: null,

			SelectstartFn: null

		},

		variables: {

			dY: 0,

			dX: 0,

			uY: 0,

			uX: 0,

			moveStart: false

		},

		load: function (flow, obj, tag) {

			flow = $(flow);

			obj = $(obj);

			this.drag(flow, obj, tag);

		},

		drag: function (flow, obj, tag) {

			var uX, uY;

			var _this = this;

			if (typeof tag == 'undefined') {

				tag = 'div';

			}

			_this.EventData.MoveEventFn = function (e) {

				if (_this.data.drag) {

					if ((Math.abs(_this.variables.uY - e.pageY) > 1 && Math.abs(_this.variables.uX - e.pageX) > 1) || _this.variables.moveStart) {

						_this.data.copy.css({

							top: e.pageY - _this.variables.dY + 'px',

							left: e.pageX - _this.variables.dX + 'px',

							display: 'block'

						});

						_this.variables.moveStart = true;

					}

				}

			}

			_this.EventData.EndEventFn = function () {

				_this.data.drag = false;

				_this.data.copy.remove();

				_this.data.copy = $();

				_this.variables.moveStart = false;

				jQuery(document).unbind(_this.EventData.EndEvent, _this.EventData.EndEventFn);

				jQuery(document).unbind(_this.EventData.MoveEvent, _this.EventData.MoveEventFn);

				jQuery(document).unbind(_this.EventData.Selectstart, _this.EventData.SelectstartFn);

			}

			_this.EventData.SelectstartFn = function () {

				return false;

			}

			_this.EventData.StartEventFn = function (e) {

				_this.data.obj = $(this);

				_this.variables.dY = e.pageY - obj.offset().top;

				_this.variables.dX = e.pageX - obj.offset().left;

				_this.variables.uY = e.pageY;

				_this.variables.uX = e.pageX;

				_this.data.drag = true;

				_this.copy(tag);

				jQuery(document).bind(_this.EventData.MoveEvent, _this.EventData.MoveEventFn);

				jQuery(document).bind('selectstart', _this.EventData.SelectstartFn)

				jQuery(document).bind(_this.EventData.EndEvent, _this.EventData.EndEventFn);

			}

			obj.bind(_this.EventData.StartEvent, _this.EventData.StartEventFn);

		},

		copy: function (tag) {

			var obj = this.data.obj;

			this.data.copy = $('<' + tag + '></' + tag + '>');

			this.data.copy.appendTo(document.body);

			this.data.copy.css({

				position: 'absolute',

				opacity: 0.75,

				zIndex: 999999,

				display: 'none'

			});

			this.data.copy.html(obj.clone().html());

		}

	}

});

jQuery.extend({

	jStyle: {

		style: 'string',

		path: jPush.data.Config.jQueryExtendUi.replace(/[\w\.]+$/ig, ''),

		debug: false,

		load: function (key) {

			var _style;

			var path = this.path;

			if (typeof this.style != 'string') {

				return this.style;

			} else {

				jQuery.ajax({

					type: 'GET',

					url: path + 'jQuery.ui.xml',

					cache: !this.debug,

					async: false,

					dataType: 'xml',

					success: function (xmlHttp) {

						_style = path + jQuery(xmlHttp).find('jQueryUi').find('add:[key=' + key + ']').attr('value');

					}

				});

				this.style = _style;

				return this.style;

			}

		}

	},

	jLayer: {

		zIndex: 100,

		position: 0,

		positionValue: 40,

		xmlState: false,

		xmlData: null,

		images: null,

		restoreData: new jQuery.Hashtable(),

		defaultBodyField: ['title', 'subject'],

		domList: {},

		domCenter: function (w, d, config) {

			var pos = this.position;

			var only = config.find('add:[key=only]').attr('value');

			if (d.toString().search(/%/ig) > 0) {

				d = w;

			} else {

				d = parseInt(d);

			}

			var val = parseInt(w / 2 - d / 2);

			if (val < 0) {

				val = 0;

			}

			if (only == 1) {

				pos = 0;

			}

			return val + pos;

		},

		sizeN: function (e, json) {

			var mY, top, height;

			mY = json.dY - e.pageY;

			top = json.offtop - mY;

			if (top > json.offtop + json.height - json.minH) {

				top = json.offtop + json.height - json.minH;

			}

			height = json.height + mY;

			if (height < json.minH) {

				height = json.minH;

			}

			return { height: height + 'px', top: top + 'px' };

		},

		sizeS: function (e, json) {

			var mY, height;

			mY = e.pageY - json.dY;

			height = json.height + mY;

			if (height < json.minH) {

				height = json.minH;

			}

			return { height: height + 'px' };

		},

		sizeW: function (e, json) {

			var mX, left, width;

			mX = json.dX - e.pageX;

			left = json.offleft - mX;

			if (left > json.offleft + json.width - json.minW) {

				left = json.offleft + json.width - json.minW;

			}

			width = json.width + mX;

			if (width < json.minW) {

				width = json.minW;

			}

			return { width: width + 'px', left: left + 'px' };

		},

		sizeE: function (e, json) {

			var mX, width;

			mX = e.pageX - json.dX;

			width = json.width + mX;

			if (width < json.minW) {

				width = json.minW;

			}

			return { width: width + 'px' };

		},

		sizeNW: function (e, json, minW, minH) {

			var mX, mY, left, top, width, height;

			mX = json.dX - e.pageX;

			mY = json.dY - e.pageY;

			top = json.offtop - mY;

			left = json.offleft - mX;

			if (left > json.offleft + json.width - json.minW) {

				left = json.offleft + json.width - json.minW;

			}

			if (top > json.offtop + json.height - json.minH) {

				top = json.offtop + json.height - json.minH;

			}

			width = json.width + mX;

			height = json.height + mY;

			if (width < json.minW) {

				width = json.minW;

			}

			if (height < json.minH) {

				height = json.minH;

			}

			return { width: width + 'px', height: height + 'px', left: left + 'px', top: top + 'px' };

		},

		sizeNE: function (e, json, minW, minH) {

			var mX, mY, top, width, height;

			mX = e.pageX - json.dX;

			mY = json.dY - e.pageY;

			top = json.offtop - mY;

			if (top > json.offtop + json.height - json.minH) {

				top = json.offtop + json.height - json.minH;

			}

			width = json.width + mX;

			height = json.height + mY;

			if (width < json.minW) {

				width = json.minW;

			}

			if (height < json.minH) {

				height = json.minH;

			}

			return { width: width + 'px', height: height + 'px', top: top + 'px' };

		},

		sizeSE: function (e, json) {

			var mX, mY, width, height;

			mX = e.pageX - json.dX;

			mY = e.pageY - json.dY;

			width = json.width + mX;

			height = json.height + mY;

			if (width < json.minW) {

				width = json.minW;

			}

			if (height < json.minH) {

				height = json.minH;

			}

			return { width: width + 'px', height: height + 'px' };

		},

		sizeSW: function (e, json) {

			var mX, mY, left, width, height;

			mX = json.dX - e.pageX;

			mY = e.pageY - json.dY;

			left = json.offleft - mX;

			if (left > json.offleft + json.width - json.minW) {

				left = json.offleft + json.width - json.minW;

			}

			width = json.width + mX;

			height = json.height + mY;

			if (width < json.minW) {

				width = json.minW;

			}

			if (height < json.minH) {

				height = json.minH;

			}

			return { width: width + 'px', height: height + 'px', left: left + 'px' };

		},

		sizeFn: function (box, type, obj, config) {

			var drag = false;

			var _this = this;

			var minWidth, minHeight;

			var zIndex;

			minWidth = config.find('add:[key=minWidth]').attr('value');

			minHeight = config.find('add:[key=minHeight]').attr('value');

			obj.mousedown(function (e) {

				var masks1, masks2;

				var masksStyle = {

					width: '100%',

					height: '100%',

					position: 'fixed',

					top: 0,

					left: 0,

					background: '#000',

					opacity: 0

				};

				box.css('z-index', ++jQuery.jLayer.zIndex);

				zIndex = jQuery(box).css('z-index') - 1;

				masks1 = jQuery('<div style="z-index:' + zIndex + ';"></div>').appendTo(document.body);

				masks1.css(masksStyle);

				masks2 = jQuery('<div></div>').appendTo(box);

				masks2.css(masksStyle);

				var json = { width: 0, height: 0, offleft: 0, offtop: 0, dY: 0, dX: 0, minW: 0, minH: 0 };

				jQuery(document.body).css('cursor', type + '-resize');

				json.width = box.width();

				json.height = box.height();

				json.offleft = box.offset().left;

				json.offtop = box.offset().top;

				json.dY = e.pageY;

				json.dX = e.pageX;

				json.minW = minWidth;

				json.minH = minHeight;

				drag = true;

				jQuery(document).bind('mousemove', function (e) {

					if (drag) {

						var style;

						style = eval('jQuery.jLayer.size' + type + '(e, json)');

						box.css(style);

						_this.bodyHeight(box, config);

					}

				});

				jQuery(document).bind('selectstart', function () {

					return false;

				})

				jQuery(document).bind('mouseup', function () {

					drag = false;

					config.find('add:[key=width]').attr('value', box.width());

					config.find('add:[key=height]').attr('value', box.height());

					jQuery(masks1).remove();

					jQuery(masks2).remove();

					jQuery(document.body).css('cursor', 'auto');

					jQuery(document).unbind('mouseup, mousemove, selectstart');

				});

			});

		},

		extend: {

			implode: function (str, s) {

				var string = '';

				for (var i = 0; i < str.length; i++) {

					string += str[i] + s;

				}

				var regexp = new RegExp(s + '$', 'ig');

				return string.replace(regexp, '');

			},

			inArray: function (arr, string) {

				for (var i = 0; i < arr.length; i++) {

					if (arr[i] == string) {

						return i;

					}

				}

				return -1;
			}

		},

		layerSize: function (size, box, config) {

			var changeSize = [];

			if (size == 1) {

				var size = '7px';

				var n, s, w, e, nw, ne, se, sw;

				var style = {

					N: {
						width: '100%',
						height: size,
						top: '-' + size,
						left: 0,
						cursor: 'n-resize'
					},

					S: {
						width: '100%',
						height: size,
						bottom: '-' + size,
						left: 0,
						cursor: 's-resize'
					},

					W: {
						width: size,
						height: '100%',
						top: 0,
						left: '-' + size,
						cursor: 'w-resize'
					},

					E: {
						width: size,
						height: '100%',
						top: 0,
						right: '-' + size,
						cursor: 'e-resize'
					},

					NW: {
						width: size,
						height: size,
						top: '-' + size,
						left: '-' + size,
						cursor: 'nw-resize'
					},

					NE: {
						width: size,
						height: size,
						top: '-' + size,
						right: '-' + size,
						cursor: 'ne-resize'
					},

					SE: {
						width: size,
						height: size,
						bottom: '-' + size,
						right: '-' + size,
						cursor: 'se-resize'
					},

					SW: {
						width: size,
						height: size,
						bottom: '-' + size,
						left: '-' + size,
						cursor: 'sw-resize'
					}

				};

				for (var val in style) {

					var css = [];

					var dom;

					for (var attr in style[val]) {

						css.push(attr + ':' + style[val][attr]);

					}

					css = this.extend.implode(css, ';');

					dom = jQuery('<div style="' + css + ';position:absolute;font-size:0;"></div>').appendTo(box);

					changeSize.push(dom);

					this.sizeFn(box, val, dom, config);

				}

			}

			return changeSize;

		},

		config: function (key, json) {

			var config = this.xmlData.find(key + ' config').clone();

			for (var val in json) {

				if (typeof json[val] != 'function' && typeof json[val] != 'undefined') {

					config.find('add:[key=' + val + ']').attr('value', json[val]);

				}

			}

			return config;

		},

		getTemplate: function () {

			if (!this.xmlState) {

				var _xmlData, _images, style = '';

				var xmlName = jQuery.jStyle.load('jLayer');

				jQuery.ajax({

					type: 'GET',

					url: xmlName,

					cache: !jQuery.jStyle.debug,

					async: false,

					dataType: 'xml',

					success: function (xmlHttp) {

						_xmlData = jQuery(xmlHttp);

					}

				});

				_images = jQuery.jStyle.path + _xmlData.find('images').text();

				_xmlData.find('style').each(

					function () {

						var style = jQuery(this).text();

						var opacity = style.match(/opacity:(\d?\.\d+);/);

						if (opacity != null && ! +"\v1") {

							style = style.replace(/opacity:(\d?\.\d+);/ig, function (s, a) { return 'filter:alpha(opacity=' + (a * 100) + ');' });

						}

						style = style.replace(/{images}/ig, _images);

						jQuery(document.body).append('<style>' + style + '</style>');

					}

				);

				this.xmlData = _xmlData;

				this.images = _images;

				this.xmlState = true;

			}

		},

		getBody: function (key, json) {

			var body = this.xmlData.find(key + ' body').text();

			var def = this.defaultBodyField;

			var val, regexp;

			for (var i = 0; i < def.length; i++) {

				val = eval('json.' + def[i]);

				if (typeof val != 'undefined') {

					regexp = new RegExp('{' + def[i] + '\\[.*\\]}', 'ig');

					body = body.replace(regexp, val);

				} else {

					regexp = new RegExp('{' + def[i] + '\\[(.*)\\]}', 'ig');

					body = body.replace(regexp, '$1');

				}

			}

			return body;

		},

		getPosition: function (box, config) {

			var posa;

			var arr = config.find('add:[key=margin]').attr('value').split(' ');

			var pos = ['top', 'right', 'bottom', 'left'];

			var win = 0, boxSize = 0, scro = 0;

			for (var i = 0; i < arr.length; i++) {

				if (pos[i] == 'top' || pos[i] == 'bottom') {

					win = jQuery(window).height();

					boxSize = box.height();

					scro = jQuery(window).scrollTop();

				} else {

					win = jQuery(window).width();

					boxSize = box.width();

					scro = jQuery(window).scrollLeft();

				}

				if (pos[i] == 'bottom') {

					posa = 'top';

				} else if (pos[i] == 'right') {

					posa = 'left';

				} else {
					
					posa = pos[i];
					
				}

				if (arr[i] == 'auto') {

					box.css(posa, scro + this.domCenter(win, boxSize, config) + 'px');

				} else {

					if (pos[i] != posa) {

						box.css(posa, scro + (win - parseInt(arr[i]) - boxSize) + this.domCenter(0, 0, config) + 'px');

					} else {

						box.css(posa, scro + parseInt(arr[i]) + this.domCenter(0, 0, config) + 'px');

					}

				}

			}

		},

		style: function (key, box, json) {

			var config = this.config(key, json);

			var width = config.find('add:[key=width]').attr('value');

			var height = config.find('add:[key=height]').attr('value');

			var _this = this;

			this.masks(box, config);

			box.css({

				position: 'fixed',

				zIndex: ++jQuery.jLayer.zIndex,

				background: 'none',

				border: 'none',

				width: width,

				height: height

			});

			box.find(config.find('add:[key=body]').attr('value')).css('background', config.find('add:[key=bodyBG]').attr('value'));

			this.getPosition(box, config);

			var changeSize = this.layerSize(config.find('add:[key=size]').attr('value'), box, config);

			this.oper(box, config, changeSize);

			this.Event(box, config, json, changeSize);

			this.bodyHeight(box, config);

			return { box: box, config: config };

		},

		oper: function (box, config, changeSize) {

			if (config.find('add:[key=only]').attr('value') == 1) {

				box.find(config.find('add:[key=minimize]').attr('value')).hide();

			} else {

				box.find(config.find('add:[key=minimize]').attr('value')).show();

			}

			if (config.find('add:[key=size]').attr('value') == 0) {

				box.find(config.find('add:[key=maximization]').attr('value')).hide();

				box.find(config.find('add:[key=restore]').attr('value')).hide();

			} else if (config.find('add:[key=fullScreen]').attr('value') == 1) {

				box.find(config.find('add:[key=maximization]').attr('value')).show();

			} else {

				box.find(config.find('add:[key=restore]').attr('value')).show();

				this.maximization(box, config, changeSize);

			}

		},

		Event: function (box, config, json, changeSize) {

			var _this = this;

			box.find(config.find('add:[key=drag]').attr('value')).jDrag(box, {

				ready: function () {

					jQuery(box).css('z-index', ++jQuery.jLayer.zIndex);

					if (typeof json.drag != 'undefined') {

						json.drag();

					}

				},

				top: 10,

				bottom: $(document).height() - 27

			});

			box.find(config.find('add:[key=close]').attr('value')).bind('click',

				function () {

					_this.close(box, json);

				}

			);

			box.find(config.find('add:[key=minimize]').attr('value')).bind('click',

				function () {

					_this.minimize(box, json);

				}

			);

			box.find(config.find('add:[key=maximization]').attr('value')).bind('click',

				function () {

					_this.maximization(box, config, changeSize);

				}

			);

			box.find(config.find('add:[key=drag]').attr('value')).bind('dblclick',

				function () {

					if (config.find('add:[key=size]').attr('value') == 0) {

						return;

					}

					if (box.hasClass('notDrag')) {

						box.find(config.find('add:[key=restore]').attr('value')).click();

					} else {

						box.find(config.find('add:[key=maximization]').attr('value')).click();

					}

				}

			);

			box.find(config.find('add:[key=restore]').attr('value')).bind('click',

				function () {

					_this.restore(box, config, changeSize);

				}

			);

			box.find(config.find('add:[key=sure]').attr('value')).bind('click',

				function () {

					_this.close(box, json.close);

					if (typeof json.sure == 'function') {

						json.sure();

					}

				}

			);

		},

		masks: function (box, config) {

			var _this = this;

			var only = config.find('add:[key=only]').attr('value');

			var opacity = config.find('add:[key=opacity]').attr('value');

			var background = config.find('add:[key=background]').attr('value');

			var masksDom;

			if (only == 1) {

				masksDom = jQuery('<div id="' + box.attr('id') + '_masks"></div>').appendTo(document.body);

				masksDom.css({

					width: '100%',

					height: '100%',

					top: 0,

					left: 0,

					zIndex: this.zIndex,

					background: background,

					opacity: opacity,

					position: 'fixed'

				});

			}

		},

		bodyHeight: function (box, config) {

			var _this = this;

			var body = config.find('add:[key=body]').attr('value');

			var height = config.find('add:[key=bodyHeight]').attr('value');

			box.find(body).css('height', box.height() - height + 'px');

		},

		show: function (key, json) {

			var box;

			this.getTemplate();

			var id = (typeof json.id != 'undefined' ? json.id : 'jLayer_' + this.zIndex);

			var dom = jQuery('#' + id);

			if (dom.size() == 0) {

				var body = this.getBody(key, json);

				box = jQuery('<div style="display:none;"></div>').appendTo(document.body);

				box.attr('id', id);

				box.html(body);

				var config = this.style(key, box, json).config;

				this.zIndex++;

				this.position += this.positionValue;

				box.fadeIn(150, function () {

					if (typeof json.ready == 'function') {

						json.ready();

					}

					box.find(config.find('add:[key=sure]').attr('value')).focus();

				});

				this.addDomList(id, json);

				return box;

			} else {

				this.minimize(dom);

				return;

			}

		},

		addDomList: function (id, json) {

			var date = new Date();

			this.domList[id] = {

				config: json,

				startTime: date,

				state: 0

			};

		},

		domListState: function (dom, state) {

			this.domList[dom.attr('id')].state = state;

		},

		removeDomList: function (domID) {

			delete this.domList[domID];

		},

		minimize: function (box, json) {

			var _this = this;

			var box = jQuery(box);

			box.css('z-index', ++this.zIndex);

			if (typeof json == 'undefined') {

				json = {};

			}

			if (box.css('display') == 'none') {

				box.fadeIn(150, function () {

					if (typeof json.minimize == 'function') {

						json.minimize();

					}

					if (typeof json.minimizeIn == 'function') {

						json.minimizeIn();

					}

				});

				this.domListState(box, 0);

			} else {

				box.fadeOut(150, function () {

					if (typeof json.minimize == 'function') {

						json.minimize();

					}

					if (typeof json.minimizeOut == 'function') {

						json.minimizeOut();

					}

				});

				this.domListState(box, 1);

			}

		},

		maximization: function (box, config, changeSize) {

			var width, height, data;

			this.restoreData.add(box.attr('id'), {

				width: box.width(),

				height: box.height(),

				top: parseInt(box.css('top')),

				left: parseInt(box.css('left'))

			})

			this.resize.hide(box, config, changeSize);

			width = $(window).width();

			height = $(window).height();

			box.css({

				width: width + 'px',

				height: height + 'px',

				top: 0,

				left: 0,

				position: 'fixed'

			});

			box.toggleClass('notDrag');

			this.bodyHeight(box, config);

		},

		restore: function (box, config, changeSize) {

			var data = this.restoreData.get(box.attr('id'));

			this.resize.show(box, config, changeSize);

			box.css({

				width: data.width + 'px',

				height: data.height + 'px',

				top: data.top + 'px',

				left: data.left + 'px',

				position: 'fixed'

			});

			box.toggleClass('notDrag');

			this.bodyHeight(box, config);

		},

		resize: {

			hide: function (box, config, changeSize) {

				for (var i = 0; i < changeSize.length; i++) {

					changeSize[i].hide();

				}

				box.find(config.find('add:[key=maximization]').attr('value')).hide();

				box.find(config.find('add:[key=restore]').attr('value')).show();

			},

			show: function (box, config, changeSize) {

				for (var i = 0; i < changeSize.length; i++) {

					changeSize[i].show();

				}

				box.find(config.find('add:[key=maximization]').attr('value')).show();

				box.find(config.find('add:[key=restore]').attr('value')).hide();

			}

		},

		close: function (box, json) {

			var _this = this;

			var box = jQuery(box);

			var masksDom = jQuery('#' + box.attr('id') + '_masks');

			if (typeof json == 'undefined') {

				json = {};

			}

			if (masksDom.size() > 0) {

				masksDom.remove();

			}

			box.fadeOut(150, function () {

				_this.removeDomList(box.attr('id'));

				jQuery(this).remove();

				if (typeof json.close == 'function') {

					json.close();

				}

			});

			this.position -= this.positionValue;

		},

		jsonValue: function (json) {

			if (typeof json == 'string') {

				json = {

					subject: json

				}

			}

			return json;

		},

		alert: function (json) {

			json = this.jsonValue(json);

			var obj = this.show('alert', json);

			return obj;

		},

		confirm: function (json) {

			json = this.jsonValue(json);

			var obj = this.show('confirm', json);

			return obj;

		},

		layer: function (json) {

			var obj = this.show('layer', json);

			return obj;

		},

		refresh: function (key, box, json) {

			return this.style(key, box, json).box;

		}

	}

});