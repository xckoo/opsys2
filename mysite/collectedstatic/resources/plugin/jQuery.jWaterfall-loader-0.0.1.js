/*
 * jQuery-jWaterfall-0.0.1.js
 * name:xiaojia 小嘉
 * email:iatt@qq.com
 * qq:273142650
 * time:2012/12.30 20:58
 *
 * this.宝贝在洗衣服，哈哈哈哈
*/

"use strict";

jQuery.extend({

	jWaterfall: {
		
		data: {
			
			listSelected: null,
			
			list: null,
			
			urlFn: null,
			
			config: null,
			
			page: 0,
			
			state: 0
			
		},
	
		init: function (list, urlFn, config) {
			
			if ($(list).size() <= 0) {
				
				return;
				
			}
			
			$(config.loading).hide();
			
			this.setDefault(list, urlFn, config);
			
			this.isScroll();
			
		},
		
		templateInit: function (config) {
			
			this.setTemplateDefault(config);
			
			this.columnSize();
			
			this.getMargin();
			
			this.setContainerWidth();
			
			this.templateShow();
			
		},
		
		columnSize: function () {
			
			var size = parseInt($(document.body).width() / this.templateData.itemWidth);
			
			for (var i = 0; i < size; i++) {
			
				this.templateData.columnList.push({
				
					height: 0,
					
					size: 0
					
				});
				
			}
			
		},
		
		getSmallColumn: function () {
			
			var column = this.templateData.columnList;
			
			var height = column[0].height;
			
			var index = 0;
			
			for (var i = 0; i < column.length; i++) {
				
				if (column[i].height < height) {
					
					height = column[i].height;
					
					index = i;
					
				}
				
			}
			
			return index;
			
		},
		
		getMargin: function () {
			
			var margin = this.templateData.margin.split(/\s+/ig);
			
			var array = ['top', 'right', 'bottom', 'left'];
			
			var marginArray = {};
			
			for (var i = 0; i < margin.length; i++) {
				
				marginArray[array[i]] = margin[i];
				
			}
			
			switch (margin.length) {
				
				case 1:
				
					for (var i = 1; i < array.length; i++) {
						
						marginArray[array[i]] = margin[0];
						
					}
				
				break;
				
				case 2:
				
					marginArray.bottom = margin[0];
					
					marginArray.left = margin[1];
				
				break;
				
				case 3:
				
					marginArray.left = margin[1];
				
				break;
				
			}
			
			for (var e in marginArray) {
				
				marginArray[e] = parseInt(marginArray[e]);
				
			}
			
			this.templateData.margin = marginArray;
			
		},
		
		setContainerWidth: function () {
		
			var margin = this.templateData.margin;
			
			var container = $(this.templateData.container);
			
			var width = this.templateData.itemWidth;
			
			var size = this.templateData.columnList.length;
			
			container.css('width',  (width * size + (margin.left + margin.right) * size) + 'px');
			
		},
		
		setContainerHeight: function () {
			
			var maxHeight = 0;
			
			var height = this.templateData.colnumList;
			
			var container = $(this.templateData.container);
			
			container.css('height',  maxHeight + 'px');
			
		},
		
		templateShow: function () {
			
			var temp = $(this.templateData.template);
			
			this.addItem(temp.clone());
			
			this.addItem(temp.clone());
			
			this.addItem(temp.clone());
			
			this.addItem(temp.clone());
			
			this.addItem(temp.clone());
			
			this.addItem(temp.clone());
			
		},
		
		addItem: function (template) {
			
			var container = $(this.templateData.container);
			
			var smallColumn = this.getSmallColumn();
			
			var template = template.appendTo(container);
			
			this.setPosition(template, smallColumn);
			
			this.setContainerHeight();
			
		},
		
		setPosition: function (template, index) {
			
			var column = this.templateData.columnList[index];
			
			var margin = this.templateData.margin;
			
			var itemWidth = this.templateData.itemWidth;
			
			var itemTop = column.height + margin.top;
			
			var itemLeft = itemWidth + margin.left;
			
			if (column.size > 0) {
				
				itemTop += margin.bottom;
				
			}
			
			if (index > 0) {
				
				itemLeft += margin.right;
				
			}
			
			template.css({
			
				top: itemTop  + 'px',
				
				left: itemLeft * index + 'px'
				
			});
			
			column.height += this.getItemHeight(template);
			
			column.size++;
			
		},
		
		getItemHeight: function (itemData) {
			
			var images = this.templateData.images;
			
			var itemData = itemData.clone().hide().appendTo(this.templateData.container);
			
			itemData.find(images).hide();
			
			var height = itemData.height();
			
			itemData.find(images).each(function () {
				
				height += parseInt($(this).attr('height'));
			
			});
			
			return height;
			
		},
		
		setTemplateDefault: function (config) {
			
			for (var e in config) {
				
				this.templateData[e] = config[e];
				
			}
			
		},
		
		setDefault: function (list, urlFn, config) {
			
			if (typeof config.scope == 'undefined') {
				
				config.scope = $(window);
				
			}
			
			this.data.listSelected = list;
			
			this.data.list = $(list);
			
			this.data.urlFn = urlFn;
			
			this.data.config = config;
			
			if (typeof this.data.config.data == 'undefined') {
				
				this.data.config.data = {}
				
			}
			
		},
		
		isScroll: function () {
			
			var list = this.data.list;
			
			var urlFn = this.data.urlFn;
			
			var config = this.data.config;
			
			var _this = this;
			
			var scope = $(config.scope);
			
			scope.scroll(function () {
				
				var short = _this.getShort(list).height;
				
				if (scope.scrollTop() >= short + config.tuning) {
					
					if (_this.data.state == 0) {
						
						_this.loadData(urlFn);
					
					}
					
				}
				
			});
			
		},
		
		loadData: function () {
			
			var urlFn = this.data.urlFn;
					
			$(this.data.config.loading).show();
			
			if (typeof urlFn == 'function') {
				
				this.data.state = 1;
				
				urlFn($.jWaterfall, this.data.page++, this.data.config.data);
				
			}
			
		},
		
		setHtml: function (htmlArray) {
			
			for (var i = 0; i < htmlArray.length; i++) {
				
				var dom = this.getShort(this.data.list).dom;
				
				if (typeof this.data.config.toFind != 'undefined') {
					
					dom = dom.find(this.data.config.toFind);
					
				}
				
				$(htmlArray[i]).appendTo(dom).hide().fadeIn(500);
				
			}
			
			this.data.state = 0;
				
			$(this.data.config.loading).hide();
			
		},
		
		getShort: function (list) {
			
			var dom = list.eq(0);
			
			var list = this.data.list;
			
			var height = list.eq(0).height() + list.eq(0).offset().top - $(window).height();
			
			list.each(function () {
				
				var thisHeight = $(this).height() + $(this).offset().top - $(window).height();
				
				if (thisHeight < height) {
					
					height = thisHeight;
					
					dom = $(this);
					
				}
				
			});
			
			return {height: height, dom: dom};
			
		},
	
		load: function (list, urlFn, config) {
			
			this.init(list, urlFn, config);
			
		},
		
		template: function (config) {
			
			this.templateInit(config);
			
		}
		
	}

});