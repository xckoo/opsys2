/*
* jQuery.jScroll.0.0.1.js
* name:xiaojia 小嘉
* email:iatt@qq.com
* qq:273142650
* time:2012.8.10 9:04
*/

"use strict";

jQuery.extend({

	jScroll: {

		debug: false,

		data: {

			defaultTemplate: 'default',

			template: null,

			config: null,

			images: null,

			state: {

				template: false

			}

		},

		init: function (selected, json) {

			this.getTemplate();

			var config = this.config(json);

			var box = this.createBody(selected, config);

			var bar = this.setConfigBar(selected, box.box, config);

			this.barHeight(selected, bar);

			this.allEvent(selected, bar, box.only);

		},

		allEvent: function (selected, bar, only) {

			if (only == 0) {

				this.wheelEvent(selected);

			}

			this.barEvent(selected, bar);

			this.scrollEvent(selected, bar);

		},

		setConfigBar: function (selected, box, config) {

			var barTop;

			var box = box;

			var config = config;

			var barHeight = box.height() * (parseInt(this.getValue(config, 'barHeight')) / 100);

			var bar = box.find(this.getValue(config, 'bar'));

			bar.css('height', barHeight + 'px');

			barTop = box.height() / 2 - bar.height() / 2;

			bar.css({

				top: barTop + 'px'

			});

			return {

				box: box,

				config: config,

				bar: bar,

				barHeight: barHeight,

				barTop: barTop

			};

		},

		barHeight: function (selected, json) {

			var scrllHei = selected.get(0).scrollHeight;

			var scrollHeight = this.scrollHeight(selected);

			var barHeight = json.barHeight * (selected.height() / scrllHei);

			if (scrollHeight == 0) {

				barHeight = 0;

				json.box.hide();

			} else {

				if (barHeight < 15) {

					barHeight = 15;

				}

				json.box.show();

			}

			json.bar.css('height', barHeight + 'px');

		},

		barEvent: function (selected, bar) {

			var dY, dT;

			var _this = this;

			var BarStartFn = function (e) {

				dY = e.pageY - bar.bar.offset().top;

				$(document).bind('mousemove', BarMoveFn);

				$(document).bind('mouseup', BarEndFn);

			}

			var BarMoveFn = function (e) {

				var mY;

				var barOffset = bar.barHeight - bar.bar.height();

				var scrollHeight = _this.scrollHeight(selected);

				mY = e.pageY - dY - bar.box.offset().top;

				mY < bar.barTop ? mY = bar.barTop : null;

				mY > bar.barTop + barOffset ? mY = bar.barTop + barOffset : null;

				bar.bar.css({

					top: mY + 'px'

				});

				var nowBarOffset = bar.bar.position().top / barOffset;

				var nowScrollTop = parseInt(scrollHeight * nowBarOffset);

				selected.scrollTop(nowScrollTop);

				_this.boxPosition(bar.box, selected, bar.config);

			}

			var BarEndFn = function () {

				$(document).unbind('mousemove', BarMoveFn);

				$(document).unbind('mouseup', BarEndFn);

			}

			bar.box.bind('mousedown', BarStartFn);

		},

		scrollEvent: function (selected, bar) {

			var _this = this;

			var scrollHeight = this.scrollHeight(selected);

			selected.bind('scroll', function () {

				var newNum = parseInt((bar.barHeight - bar.bar.height()) * ($(this).scrollTop() / scrollHeight));

				bar.bar.css('top', newNum + 'px');

				_this.boxPosition(bar.box, selected, bar.config);

			});

		},

		wheelEvent: function (selected) {

			if (typeof selected.mousewheel != 'undefined') {

				var MouseWheel = function (e, i) {

					if (i < 0) {

						selected.scrollTop(selected.scrollTop() + 60);

					} else {

						selected.scrollTop(selected.scrollTop() - 60);

					}

				}

				selected.bind('mousewheel', MouseWheel);

			}

		},

		scrollHeight: function (selected) {

			return selected.get(0).scrollHeight - selected.height();

		},

		config: function (json) {

			var config = this.data.config.clone();

			for (var val in json) {

				if (typeof json[val] != 'function' && typeof json[val] != 'undefined') {

					config.find('add:[key=' + val + ']').attr('value', json[val]);

				}

			}

			return config;

		},

		getValue: function (config, key) {

			return config.find('add:[key=' + key + ']').attr('value');

		},

		boxEvent: function (box) {

			box.bind('mouseover', function () {

				$(this).stop();

				$(this).fadeTo(300, 1);

			})

			box.bind('mouseout', function () {

				$(this).stop();

				$(this).fadeTo(300, 0.5);

			})

		},

		setStyle: function (box, selected, config) {

			var height = selected.height() * (parseInt(this.getValue(config, 'height')) / 100);

			box.css({

				width: this.getValue(config, 'width'),

				height: height + 'px',

				position: 'absolute',

				opacity: 0.5

			});

			this.boxEvent(box);

			box = this.boxPosition(box, selected, config);

		},

		boxMarginValue: function (box, selected, margin, position) {

			var position;

			if (margin == 0) {

				return null;

			}

			if (position == 'horizontal') {

				position = 'width';

			} else {

				position = 'height';

			}

			if (margin == 'auto') {

				return selected[position]() / 2 - box.height() / 2 + selected.scrollTop() + 'px';

			} else {

				return margin;

			}

		},

		boxPosition: function (box, selected, config) {

			var margin = this.getValue(config, 'margin').split(' ');

			var marginJson = {}, boxCssJson = {};

			marginJson['top'] = this.boxMarginValue(box, selected, margin[0], 'vertical');

			marginJson['right'] = this.boxMarginValue(box, selected, margin[1], 'horizontal');

			marginJson['bottom'] = this.boxMarginValue(box, selected, margin[2], 'vertical');

			marginJson['left'] = this.boxMarginValue(box, selected, margin[3], 'horizontal');

			for (var val in marginJson) {

				if (marginJson[val] != null) {

					boxCssJson[val] = marginJson[val];

				}

			}

			box.css(boxCssJson);

			return box;

		},

		createBody: function (selected, config) {

			var box = selected.find('.jScroll-box');

			var only = 0;

			if (box.size() == 0) {

				box = $('<div class="jScroll-box"></div>').appendTo(selected);

				box.html(this.data.template.text());

				only = 0;

			} else {

				only = 1;

			}

			this.setStyle(box, selected, config);

			return { box: box, only: only };

		},

		getTemplate: function () {

			var _this = this;

			var _images, _xmlData;

			if (!_this.data.state.template) {

				var url = jQuery.jStyle.load('jScroll');

				jQuery.ajax({

					type: 'GET',

					url: url,

					cache: !this.debug,

					async: false,

					dataType: 'xml',

					success: function (xmlHttp) {

						_xmlData = $(xmlHttp).find('template:[key=' + _this.data.defaultTemplate + ']');

					}

				});

				_images = jQuery.jStyle.path + _xmlData.find('style').attr('images');

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

				this.data.template = _xmlData.find('body');

				this.data.config = _xmlData.find('config');

				this.data.images = _images;

				this.data.state.template = true;

			}

		},

		load: function (selected, json) {

			selected = $(selected);

			this.init(selected, json);

		}

	}

});