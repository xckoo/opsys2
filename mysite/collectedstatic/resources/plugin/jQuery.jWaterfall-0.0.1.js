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

(function ($, undefined) {

	var itemArray = [];

	var columnArray = [];
	
	var windowResize;
	
	var ajaxLoadState = 0;

	var setItemPositoin = function (container, config) {
		
		for (var i = 0; i < itemArray.length; i++) {
			
			addItemData(itemArray[i], container, config);
			
		}
		
	}
	
	var addItemData = function (itemData, container, config) {
		
		var padding = config.padding;
			
		var height = getItemHeight(itemData.itemData, padding, container, config);
		
		var position = getItemPosition(itemData.itemData, config, height);
			
		itemData.top = position.top;
		
		itemData.left = position.left;
		
		itemData.column = position.column;
		
		itemData.height = height;
		
		return itemData;
		
	}
	
	var setItemArray = function (container, config) {
		
		if (itemArray.length <= 0) {
		
			$(container).children(config.itemData).each(function () {
				
				itemArray.push({
				
					itemData: $(this),
				
					top: 0,
					
					left: 0,
					
					column: null,
					
					height: 0
					
				});
			
			});
		
		}
		
	}
	
	var getItemPosition = function (itemData, config, height) {
		
		var columnIndex = getMinColumn();
		
		var margin = config.margin;
		
		var column = columnArray[columnIndex];
		
		var itemWidth = config.itemWidth;
		
		var itemTop = 0;
		
		var itemLeft = 0;
		
		if (column.size > 0) {
			
			itemTop += column.height + margin.top + margin.bottom;
			
			height += margin.top + margin.bottom;
			
		}
		
		if (columnIndex > 0) {
			
			itemLeft += (itemWidth + margin.left + margin.right) * columnIndex;
			
		}
		
		column.height += height;
		
		column.size++;
		
		return {top: itemTop, left: itemLeft, column: columnIndex}
		
	}
	
	var getMinColumn = function () {
		
		var column = columnArray;
		
		var height = column[0].height;
		
		var index = 0;
		
		for (var i = 0; i < column.length; i++) {
			
			if (column[i].height < height) {
				
				height = column[i].height;
				
				index = i;
				
			}
			
		}
		
		return index;	
		
	}
	
	var getMaxColumn = function () {
		
		var column = columnArray;
		
		var height = 0;
		
		var index = 0;
		
		for (var i = 0; i < column.length; i++) {
			
			if (column[i].height > height) {
				
				height = column[i].height;
				
				index = i;
				
			}
			
		}
		
		return index;	
		
	}
	
	var setColumn = function (container, config) {
		
		var margin = config.margin;
		
		var size = parseInt($(window).width() / (config.itemWidth + margin.left + margin.right));
		
		if (size < config.minColumn) {
			
			size = config.minColumn;
			
		}
		
		columnArray = [];
		
		for (var i = 0; i < size; i++) {
			
			columnArray.push({
			
				height: 0,
				
				size: 0
				
			});
			
		}
		
	}
	
	var getItemHeight = function (itemData, padding, container, config) {
		
		var height = 0;
		
		itemData.find(config.images).each(function () {
		
			$(this).hide();
		
			height += parseInt($(this).attr('height'));
		
		});
		
		height += itemData.height() + padding.top + padding.bottom;
		
		itemData.find(config.images).show();
		
		return height;
		
	}
	
	var getMargin = function (margin) {
		
		var margin = margin.split(/\s+/ig);
		
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
		
		return marginArray;
		
	}

	var showItem = function (itemArray) {
		
		for (var i = 0; i < itemArray.length; i++) {
			
			itemArray[i].itemData.stop();
			
			itemArray[i].itemData.animate({
			
				top: itemArray[i].top + 'px',
				
				left: itemArray[i].left + 'px'
				
			}, 750);
			
		}
		
	}
	
	var setContainer = function (container, config) {
		
		var width = (config.itemWidth + config.margin.left + config.margin.right) * columnArray.length - config.margin.left - config.margin.right;
		
		var height = columnArray[getMaxColumn()].height + config.margin.bottom;
		
		$(container).css({
		
			width: width + 'px',
			
			height: height + 'px',
			
			margin: '0'
			
		});
		
		$(container).stop();
		
		$(container).animate({
		
			left: $(window).width() / 2 - width / 2 + 'px'
			
		});
		
		return {width: width}
		
	}
	
	var loadData = function (loader, container, config) {
		
		if (typeof loader == 'function') {
			
			ajaxLoadState = 1;
			
			loader($.jWaterfall, {
			
				page: config.page,
				
				data: config.data,
				
				container: container,
				
				config: config
				
			});
			
		}
		
	}
	
	var Event = function (container, loader, config) {
		
		$(window).resize(function () {
			
			clearTimeout(windowResize);
			
			var fn = function () {
				
				init(container, loader, config);
			
			}
			
			windowResize = setTimeout(fn, 80);
			
		
		});
			
		$(window).scroll(function () {
			
			var height = columnArray[getMinColumn()].height;
			
			if ($(window).scrollTop() >= ((height + $(container).offset().top - $(window).height()) + config.tuning)) {
				
				if (ajaxLoadState == 0) {
					
					loadData(loader, container, config);
				
				}
				
			}
			
		});
		
	}
	
	var init = function (container, loader, config) {
		
		setColumn(container, config);
		
		setItemArray(container, config);
		
		setItemPositoin(container, config);
		
		var size = setContainer(container, config);
		
		showItem(itemArray);
		
		config.callback(size);
		
	}

	jQuery.extend({
	
		jWaterfall: {
			
			setHtml: function (htmlArray, data) {
				
				var newItemArray = [];
				
				for (var i = 0; i < htmlArray.length; i++) {
					
					var itemData = $(htmlArray[i]).appendTo(data.container).hide();
					
					var index = itemArray.push({
					
						itemData: itemData
						
					});
					
					index--;
					
					itemData = addItemData(itemArray[index], data.container, data.config);
					
					itemData.itemData.css({
					
						top: itemData.top + 'px',
						
						left: itemData.left + 'px'
						
					}).fadeIn(1000);
					
				}
				
				ajaxLoadState = 0;
				
			},
			
			waterfall: function (container, loader, config) {
		
				config.margin = getMargin(config.margin);
				
				config.padding = getMargin(config.padding);
				
				init(container, loader, config);
		
				Event(container, loader, config);
				
			}
			
		}
	
	});
	
})(window.jQuery, 'undefined');