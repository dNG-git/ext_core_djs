//j// BOF

/*
direct JavaScript
All-in-one toolbox for HTML5 presentation and manipulation
----------------------------------------------------------------------------
(C) direct Netware Group - All rights reserved
https://www.direct-netware.de/redirect?js;djs

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file, You can
obtain one at http://mozilla.org/MPL/2.0/.
----------------------------------------------------------------------------
https://www.direct-netware.de/redirect?licenses;mpl2
----------------------------------------------------------------------------
#echo(jsDjsVersion)#
#echo(__FILEPATH__)#
*/

define([ 'jquery', 'Modernizr' ], function($, Modernizr) {
	var tabindex_count = 1;

	function enable_input(id) {
		$("#" + id).removeAttr('disabled');
	}

	function unfocus(id, focused_class) {
		$("#" + id).removeClass(focused_class);
	}

	function XHtml5FormElement(args) {
		if (args === undefined || (!('id' in args)) || (!('type' in args))) {
			throw new Error('Missing required arguments');
		}

		if (!('_djs_XHtml5FormElement_enable_input' in self)) {
			self._djs_XHtml5FormElement_enable_input = function(id) {
				enable_input(id);
			};
		}

		if (!('_djs_XHtml5FormElement_unfocus' in self)) {
			self._djs_XHtml5FormElement_unfocus = function(id, focused_class) {
				unfocus(id, focused_class);
			};
		}

		this.id = args.id;
		this.$node = $("#" + args.id);
		this.type = args.type;

		this.focused_class = (('djs_config' in self && 'XHtml5FormElement_focused_class' in self.djs_config) ? self.djs_config.XHtml5FormElement_focused_class : 'djs-ui-XHtml5FormElement-input-focus');
		this.focused_duration = (('djs_config' in self && 'XHtml5FormElement_focused_duration' in self.djs_config) ? self.djs_config.XHtml5FormElement_focused_duration : 0);
		this.temporarily_disabled_duration = (('djs_config' in self && 'XHtml5FormElement_temporarily_disabled_duration' in self.djs_config) ? self.djs_config.XHtml5FormElement_temporarily_disabled_duration : 3000);

		var _this = this;

		if ($.inArray(this.type, [ 'datepicker', 'form', 'form_section', 'range', 'timepicker' ]) < 0) {
			this.$node.on('focus', function() {
				_this.focus();
			});

			this.tabindex();
		}

		if (this.type == 'button') {
			if (this.$node.attr('type') == 'submit' && !(this.$node.prop('disabled'))) {
				$(this.$node.prop('form')).on('submit', function(event) {
					_this.disable_input_temporarily(event);
				})
			}
		}

		if (this.$node.attr('placeholder') != undefined && (!Modernizr.input.placeholder)) {
			require([ 'jquery', 'jquery.placeholder' ], function($, $placeholder) {
				_this.$node.placeholder();
			});
		}
	}

	XHtml5FormElement.prototype.disable_input_temporarily = function(event, duration) {
		var _return = true;

		if (event === undefined) {
			throw new Error('Missing required arguments');
		}

		if (duration === undefined) {
			duration = this.temporarily_disabled_duration;
		}

		if (this.$node.prop('disabled')) {
			_return = false;
		} else {
			this.$node.attr('disabled', 'disabled');
			self.setTimeout('self._djs_XHtml5FormElement_enable_input("' + id + '")', duration);
		}

		if (event == null) {
			return _return;
		} else if (!_return) {
			event.preventDefault();
		}
	}

	XHtml5FormElement.prototype.focus = function(duration) {
		if (duration === undefined) {
			duration = this.focused_duration;
		}

		if (this.$node.addClass(this.focused_class) != null) {
			if (duration > 0) {
				self.setTimeout('self._djs_XHtml5FormElement_unfocus("' + this.id + '", "' + this.focused_class + '")', duration);
			} else {
				var _this = this;

				this.$node.one('focusout', function() {
					unfocus(_this.id, _this.focused_class);
				});
			}
		}
	}

	XHtml5FormElement.prototype.set_focused_class = function(classname) {
		this.focused_class = classname;
	}

	XHtml5FormElement.prototype.set_focused_duration = function(duration) {
		this.focused_duration = duration;
	}

	XHtml5FormElement.prototype.set_temporarily_disabled_duration = function(duration) {
		this.temporarily_disabled_duration = duration;
	}

	XHtml5FormElement.prototype.tabindex = function() {
		this.$node.attr('tabindex', tabindex_count);
		tabindex_count += 1;
	}

	return XHtml5FormElement;
/*
			if (f_type == 'datepicker')
			{
				djs_load_functions([ { file:'ext_djs/djs_html5_datetime.min.js' } ]).done (function ()
				{
					if (!('css_classes' in f_params)) { f_params['css_classes'] = null; }
					if (!('css_classes_replaced' in f_params)) { f_params['css_classes_replaced'] = null; }
					djs_html5_datetime ({ datetime_lang:"<?php echo $direct_local['lang_iso_domain']; ?>",id:f_params.id,onCompleted:{ func:'djs_formbuilder_set_select_css',params:f_params } });
				});
			}

			if (f_type == 'form')
			{
				if (djs_var.basic_formbuilder_form_ready)
				{
					if (!('id_button' in f_params)) { f_params['id_button'] = null; }
					if (!('url' in f_params)) { f_params['url'] = null; }
					jQuery("#" + f_params.id).on ('submit',function () { return djs_formbuilder_submit (f_params.id,f_params.url,f_params.id_button); });
				}
				else
				{
		djs_load_functions ([
		 { file:'swg_AJAX.php.js',block:'djs_swgAJAX_insert' },
		 { file:'ext_jquery/jquery.ui.core.min.js' },
		 { file:'ext_jquery/jquery.ui.effect.min.js' },
		 { file:'ext_jquery/jquery.ui.effect-transfer.min.js' }
		]).done (function ()
		{
			djs_var.basic_formbuilder_form_ready = true;
			djs_formbuilder_init (f_params);
		});
				}
			}

			if (f_type == 'form_sections')
			{
				if (djs_var.basic_formbuilder_accordion_ready)
				{
					jQuery("#" + f_params.id + " > .ui-accordion-header").removeClass ('pagecontenttitle');
					jQuery("#" + f_params.id).accordion({ header:'.ui-accordion-header',heightStyle:'content' }).on ('activate',function (f_event,f_ui) { f_ui.newPanel.find(':input').first().trigger ('focus'); });
				}
				else
				{
		djs_load_functions ([
		 { file:'ext_jquery/jquery.ui.core.min.js' },
		 { file:'ext_jquery/jquery.ui.widget.min.js' },
		 { file:'ext_jquery/jquery.ui.accordion.min.js' }
		]).done (function ()
		{
			djs_var.basic_formbuilder_accordion_ready = true;
			djs_formbuilder_init (f_params);
		});
				}
			}

			if (f_type == 'email')
			{
				var f_data = jQuery ("#" + f_params.id);
				if (!('formNoValidate' in f_data.get (0))) { djs_DOM_replace ({ animate:false,data:(f_data.clone().attr ('type','text')),id:f_params.id,onReplace:{ func:'djs_formbuilder_init',params:{ id:f_params.id } } }); }
			}

			if (f_type == 'range')
			{
				var f_data = jQuery ("#" + f_params.id);

				if (!('stepUp' in f_data.get (0)))
				{
					if (!djs_var.basic_formbuilder_range_ready)
					{
						djs_load_functions ({ file:'swg_formbuilder.php.js',block:'djs_formbuilder_range' });
						djs_load_functions ({ file:'ext_jquery/jquery.ui.core.min.js' });
						djs_load_functions ({ file:'ext_jquery/jquery.ui.widget.min.js' });
						djs_load_functions ({ file:'ext_jquery/jquery.ui.mouse.min.js' });
						djs_load_functions ({ file:'ext_jquery/jquery.ui.slider.min.js' });

						djs_var.basic_formbuilder_range_ready = true;
					}

					f_data.next('br').remove ();

					var f_range_params = { id:f_params.id,max:(parseFloat (f_data.attr ('max'))),min:(parseFloat (f_data.attr ('min'))),value:f_data.val () };
					if (f_range_params.value == '') { f_range_params.value = f_range_params.min; }
					f_data = "<div><div id='" + f_params.id + "s'></div><input type='hidden' name='" + (f_data.attr ("name")) + "' value=\"" + f_range_params.value + "\" id='" + f_params.id + "i' /><b><span id='" + f_params.id + "o'>" + f_range_params.value + "</span></b></div>";

					djs_DOM_replace ({ data:f_data,id:f_params.id,onReplace:{ func:'djs_formbuilder_range',params:f_range_params } });
				}
			}

			if (f_type == 'resizeable')
			{
				if (djs_var.basic_formbuilder_resizeable_ready) { jQuery("#" + f_params.id).wrap("<div style='padding:<?php echo $direct_settings['theme_form_td_padding']; ?>' />").parent().resizable ({ alsoResize:"#" + f_params.id }); }
				else
				{
		djs_load_functions ([
		 { file:'ext_jquery/jquery.ui.core.min.js' },
		 { file:'ext_jquery/jquery.ui.widget.min.js' },
		 { file:'ext_jquery/jquery.ui.mouse.min.js' },
		 { file:'ext_jquery/jquery.ui.resizable.min.js' }
		]).done (function ()
		{
			djs_var.basic_formbuilder_resizeable_ready = true;
			djs_formbuilder_init (f_params);
		});
				}
			}

			if (f_type == 'search')
			{
				var f_data = jQuery ("#" + f_params.id);
				if (!('formNoValidate' in f_data.get (0))) { djs_DOM_replace ({ animate:false,data:(f_data.clone().attr ('type','text')),id:f_params.id,onReplace:{ func:'djs_formbuilder_init',params:{ id:f_params.id } } }); }
			}

			if (f_type == 'tel')
			{
				var f_data = jQuery ("#" + f_params.id);
				if (!('formNoValidate' in f_data.get (0))) { djs_DOM_replace ({ animate:false,data:(f_data.clone().attr ('type','text')),id:f_params.id,onReplace:{ func:'djs_formbuilder_init',params:{ id:f_params.id } } }); }
			}

			if (f_type == 'timepicker')
			{
				djs_load_functions([ { file:'ext_djs/djs_html5_datetime.min.js' } ]).done (function ()
				{
					if (!('css_classes' in f_params)) { f_params['css_classes'] = null; }
					if (!('css_classes_replaced' in f_params)) { f_params['css_classes_replaced'] = null; }
					djs_html5_datetime ({ datetime_lang:"<?php echo $direct_local['lang_iso_domain']; ?>",id:f_params.id,onCompleted:{ func:'djs_formbuilder_set_select_css',params:f_params } });
				});
			}

			if (f_type == 'url')
			{
				var f_data = jQuery ("#" + f_params.id);
				if (!('formNoValidate' in f_data.get (0))) { djs_DOM_replace ({ animate:false,data:(f_data.clone().attr ('type','text')),id:f_params.id,onReplace:{ func:'djs_formbuilder_init',params:{ id:f_params.id } } }); }
			}
		}

		function djs_formbuilder_range (f_params) { f_jquery_object = jQuery("#" + f_params.id + "s").slider(f_params).on ('slide',function (f_event,f_ui) { djs_formbuilder_range_slide (f_params,f_ui.value); }); }

		function djs_formbuilder_range_slide (f_params,f_value)
		{
			jQuery("#" + f_params.id + "i").val (f_value);
			jQuery("#" + f_params.id + "o").text (f_value);
		}

		function djs_formbuilder_set_select_css (f_params)
		{
			if (('css_classes' in f_params)&&('css_classes_replaced' in f_params)&&('id' in f_params)&&(f_params.css_classes !== null)&&(f_params.css_classes_replaced !== null))
			{
				var f_jquery_object = jQuery ("#" + f_params.id);

				if (f_jquery_object.data ('djsHtml5Replaced') == true) { f_jquery_object.find("select").filter(':visible').addClass (f_params.css_classes_replaced); }
				else
				{
					f_jquery_object.addClass (f_params.css_classes);
					djs_formbuilder_tabindex (f_params);
				}
			}
*/
});

//j// EOF