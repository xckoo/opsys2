/*
* jQuery.jValidation-0.0.1.js
* name:xiaojia 小嘉
* email:iatt@qq.com
* qq:273142650
* time:2012.7.28 9:13
*/

jQuery.extend({

	jValidation: {

		data: {

			debug: true,

			form: null,

			template: null,

			setTemplate: false,

			config: {

				selected: {}

			}

		},

		getTemplate: function () {

			var url = jQuery.jStyle.load('jValidation');

			var _xmlData;

			jQuery.ajax({

				type: 'GET',

				url: url,

				cache: !this.debug,

				async: false,

				dataType: 'xml',

				success: function (xmlHttp) {

					_xmlData = $(xmlHttp).find('jValdation');

				}

			});

			this.data.template = _xmlData;

		},

		setTemplate: function () {

			var _this = this;

			var selected = this.data.template.find('selected').clone();

			if (!this.data.setTemplate) {

				selected.find('add').each(

					function () {

						_this.data.config.selected[$(this).attr('key')] = {

							text: $(this).attr('text'),

							selected: $(this).attr('selected'),

							notNull: $(this).attr('notNull'),

							notNullSelected: $(this).attr('notNullSelected'),

							correct: $(this).attr('correct'),

							error: $(this).attr('error')

						};

					}

				);

			}

		},

		config: function (parameters) {

			var selected = this.data.config.selected;

			config = parameters.config;

			for (var val in config) {

				if (typeof config[val] == 'string') {

					selected[val].text = config[val];

				} else {

					for (var v in config[val]) {

						if (v == 'notNull') {

							selected[val][v] = config[val][v].toString();

						} else {

							selected[val][v] = config[val][v];

						}

					}

				}

			}

		},

		DefaultPar: function (parameters) {

			var array = {};

			if (parameters[0] == 'alert' || parameters[0] == 'layer') {

				array['form'] = 'form';

				array['type'] = parameters[0];

				array['config'] = {};

			} else if (typeof parameters[0] == 'object') {

				array['form'] = 'form';

				array['type'] = 'alert';

				array['config'] = parameters[0];

			} else {

				array['form'] = 'form';

				array['type'] = 'alert';

				array['config'] = {};

			}

			if (parameters[1] == 'alert' || parameters[1] == 'layer') {

				array['form'] = array.form;

				array['type'] = parameters[1];

				array['config'] = {};

			} else {

				array['form'] = array.form;

				array['type'] = 'alert';

				array['config'] = parameters[1];

			}

			if (typeof parameters[2] != 'undefined') {

				array['form'] = array.form;

				array['type'] = array.type;

				array['config'] = parameters[2];

			} else {

				array['form'] = array.form;

				array['type'] = array.type;

				array['config'] = {};

			}

			return array;

		},

		load: function () {

			var parameters = this.DefaultPar(arguments);

			this.init(parameters);

		},

		getForm: function (parameters) {

			this.data.form = parameters.form;

		},

		init: function (parameters) {

			this.getForm(parameters);

			this.getTemplate();

			this.setTemplate();

			this.config(parameters);

			this.hideAll();

			this.bind(parameters);

		},

		hideAll: function () {

			var selected = this.data.config.selected;

			for (var val in selected) {

				$(selected[val].correct).hide();

				$(selected[val].error).hide();

				$(selected[val].notNullSelected).hide();

			}

		},

		bind: function (parameters) {

			this.event.submit(parameters);

			this.event.other(parameters);

		},

		event: {

			par: function () {

				return jQuery.jValidation;

			},

			fn: function (method, par) {

				var _this = jQuery.jValidation;

				this.method = function () {

					_this.ValidationEvent[method](par);

					return false;

				}

			},

			submit: function (parameters) {

				var _this = this.par();

				$(_this.data.form).submit(

					function () {

						return _this.Validation(parameters);

					}

				);

			},

			other: function (parameters) {

				if (parameters.type == 'layer') {

					var fn;

					var _this = this.par();

					var selected = _this.data.config.selected;

					for (var val in selected) {

						if (val == 'CheckBox' && val == 'Limit') {

							continue;

						}

						var fn = new this.fn(val, { val: val, type: 'blur', selected: selected[val] });

						$(selected[val].selected).blur(fn.method.bind(fn));

					}

				}

			}

		},

		Validation: function (parameters) {

			var selected = this.data.config.selected;

			for (var val in selected) {

				if (!this.ValidationEvent[val]({ val: val, type: 'submit', selected: selected[val] })) {

					for (var v in selected) {

						$(selected[v].selected).blur();

					}

					return false;

				}

			}

			return true;

		},

		tip: function (json, type) {

			var selected = this.data.config.selected[json.val];

			switch (json.type) {

				case 'submit':

					switch (type) {

						case 1:
						case 2:

							jQuery.jLayer.alert(selected.text);

							break;

					}

					break;

				case 'blur':

					switch (type) {

						case 0:

							this.showCorrect(selected);

							break;

						case 1:

							this.showError(selected);

							break;

						case 2:

							this.showNotNull(selected);

							break;

						case 3:

							this.hideTip(selected);

							break;

					}

					break;

			}

		},

		hideTip: function (selected) {

			$(selected.error).hide();

			$(selected.correct).hide();

		},

		showNotNull: function (selected) {

			$(selected.error).hide();

			$(selected.correct).hide();

			$(selected.notNullSelected).show();

		},

		showError: function (selected) {

			$(selected.error).show();

			$(selected.correct).hide();

			$(selected.notNullSelected).hide();

		},

		showCorrect: function (selected) {

			$(selected.error).hide();

			$(selected.correct).show();

			$(selected.notNullSelected).hide();

		},

		ValidationEvent: {

			notNull: function (json, str) {

				var notNull = json.selected.notNull;

				if (str.length == 0) {

					if (notNull == 'true') {

						$.jValidation.tip(json, 2);

						return false;

					} else {

						$.jValidation.tip(json, 3);

						return true;

					}

				}

				return true;

			},

			TelePhone: function (json) {

				var str = $(json.selected.selected).val();

				if (str.search(/\-/ig) > 0) {

					if (str.replace(/\d{3,4}\-\d{6,8}/ig, '') != '') {

						$.jValidation.tip(json, 1);

						return false;

					}

				} else {

					if (str.replace(/\d{6,12}/ig, '') != '') {

						$.jValidation.tip(json, 1);

						return false;

					}

				}

				$.jValidation.tip(json, 0);

				if (!this.notNull(json, str)) {

					return false;

				}

				return true;

			},

			Email: function (json) {

				var str = $(json.selected.selected).val();

				if (str.replace(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/ig, '') != '') {

					$.jValidation.tip(json, 1);

					return false;

				}

				$.jValidation.tip(json, 0);

				if (!this.notNull(json, str)) {

					return false;

				}

				return true;

			},

			MobilePhone: function (json) {

				var str = $(json.selected.selected).val();

				if (str.replace(/^1[3-9]\d{9}$/ig, '') != '') {

					$.jValidation.tip(json, 1);

					return false;

				}

				$.jValidation.tip(json, 0);

				if (!this.notNull(json, str)) {

					return false;

				}

				return true;

			},

			QQ: function (json) {

				var str = $(json.selected.selected).val();

				if (str.search(/\@/ig) > 0) {

					if (str.replace(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/ig, '') != '') {

						$.jValidation.tip(json, 1);

						return false;

					}

				} else {

					if (str.replace(/\d{5,11}/ig, '') != '') {

						$.jValidation.tip(json, 1);

						return false;

					}

				}

				$.jValidation.tip(json, 0);

				if (!this.notNull(json, str)) {

					return false;

				}

				return true;

			},

			ZipCode: function (json) {

				var str = $(json.selected.selected).val();

				if (str.replace(/\d{6}/ig, '') != '') {

					$.jValidation.tip(json, 1);

					return false;

				}

				$.jValidation.tip(json, 0);

				if (!this.notNull(json, str)) {

					return false;

				}

				return true;

			},

			ID: function (json) {

				var str = $(json.selected.selected).val();

				if (str.replace(/(\d{16})|(\d{17})x|(\d{18})/ig, '') != '') {

					$.jValidation.tip(json, 1);

					return false;

				}

				$.jValidation.tip(json, 0);

				if (!this.notNull(json, str)) {

					return false;

				}

				return true;

			},

			Limit: function (json) {

				return true;

			},

			Digital: function (json) {

				$(json.selected.selected).val(function (i, c) {

					return c.replace(/\D/ig, '');

				});

				return true;

			},

			CheckBox: function (json) {

				alert($(json.selected.selected).size());

				$(json.selected.selected).each(

					function () {

						//alert($(this).children('[name='+$(this).attr('name')+']').children(':checked').size());

					}

				);

				return false;

			}

		}

	}

});