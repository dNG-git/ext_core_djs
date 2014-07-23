//j// BOF

/* -------------------------------------------------------------------------
direct PAS
Python Application Services
----------------------------------------------------------------------------
(C) direct Netware Group - All rights reserved
http://www.direct-netware.de/redirect.py?pas;http;js

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file, You can
obtain one at http://mozilla.org/MPL/2.0/.
----------------------------------------------------------------------------
http://www.direct-netware.de/redirect.php?licenses;mpl2
----------------------------------------------------------------------------
#echo(pasHttpJsVersion)#
#echo(__FILEPATH__)#
------------------------------------------------------------------------- */

define([ 'jquery', 'Modernizr' ], function($, Modernizr) {
	return {
		focused_class: null,
		focused_duration: null,
		temporarily_disabled_duration: null,

		disable_input_temporarily: function(id, event, duration) {
			var _return = true;

			if (duration == null) { duration = this.temporarily_disabled_duration; }
			var $button = $("#" + id);

			if ($button.prop('disabled')) { _return = false; }
			else {
				$button.attr('disabled', 'disabled');
				self.setTimeout('self._djs_formX_enable_input("' + id + '")', duration);
			}

			if (event == null) { return _return; }
			else if (!_return) { event.preventDefault(); }
		},

		enable_input: function(id) { $("#" + id).removeAttr('disabled'); },

		focus: function(id, duration) {
			if (duration == null) { duration = this.focused_duration; }
			var _this = this;

			if ($("#" + id).addClass(this.focused_class) != null) {
				if (duration > 0) { self.setTimeout('self._djs_formX_unfocus("' + id + '")', duration); }
				else { $("#" + id).one('focusout', function() { _this.unfocus(id); }); }
			}
		},

		init: function(args) {
			var _return = false;

			var $node = null;
			var _this = this;
			var _type = null;

			if ('id' in args && 'type' in args) {
				if (!("_djs_formX_enable_input" in self)) {
					self._djs_formX_enable_input = function(id) {
						_this.enable_input(id);
					};
				}

				if (!("_djs_formX_unfocus" in self)) {
					self._djs_formX_unfocus = function(id) {
						_this.unfocus(id);
					};
				}

				if (this.focused_class == null) {
					if ('djs_config' in self && 'formX_focused_class' in self.djs_config) { this.focused_class = self.djs_config.formX_focused_class; }
					else { this.focused_class = 'djs-ui-formX-input-focus'; }
				}

				if (this.focused_duration == null) {
					if ('djs_config' in self && 'formX_focused_duration' in self.djs_config) { this.focused_duration = self.djs_config.formX_focused_duration; }
					else { this.focused_duration = 0; }
				}

				if (this.temporarily_disabled_duration == null) {
					if ('djs_config' in self && 'formX_temporarily_disabled_duration' in self.djs_config) { this.temporarily_disabled_duration = self.djs_config.formX_temporarily_disabled_duration; }
					else { this.temporarily_disabled_duration = 3000; }
				}

				$node = $("#" + args.id);
				_type = args.type;
				_return = true;
			}

			if (_type != null && _type != 'datepicker' && _type != 'form' && _type != 'form_section' && _type != 'range' && _type != 'timepicker') {
				$node.on('focus', function() { _this.focus(args.id); });
				this.tabindex(args);
			}

			if (_type == 'button') {
				if ($node.attr('type') == 'submit' && !($node.prop('disabled'))) {
					$($node.prop('form')).on('submit', function(event) {
						_this.disable_input_temporarily(args.id, event);
					})
				}
			}

			if ($node.attr('placeholder') != undefined && (!Modernizr.input.placeholder)) {
				require([ 'jquery', 'jquery.placeholder' ], function($, $placeholder) { $node.placeholder(); });
			}

			return _return;
		},

		set_focused_class: function(classname) {
			this.focused_class = classname;
		},

		set_focused_duration: function(duration) {
			this.focused_duration = classname;
		},

		tabindex: function(args) {
		},

		unfocus: function(id) { $("#" + id).removeClass(this.focused_class); }
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
	};
});

//j// EOF