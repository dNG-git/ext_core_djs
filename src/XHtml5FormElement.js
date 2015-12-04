//j// BOF

/*
direct JavaScript Toolbox
All-in-one toolbox for HTML5 presentation and manipulation
----------------------------------------------------------------------------
(C) direct Netware Group - All rights reserved
https://www.direct-netware.de/redirect?js;djt

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file, You can
obtain one at http://mozilla.org/MPL/2.0/.
----------------------------------------------------------------------------
https://www.direct-netware.de/redirect?licenses;mpl2
----------------------------------------------------------------------------
#echo(jsDjtVersion)#
#echo(__FILEPATH__)#
*/

define([ 'jquery', 'Hammer', 'Modernizr' ], function($, Hammer, Modernizr) {
	var NEW_INPUT_ATTRIBUTES_COPIED = [ 'id', 'name', 'type', 'size', 'class', 'style', 'multiple', 'tabindex' ];
	var tabindex_count = 1;

	function XHtml5FormElement(args) {
		if (args === undefined || (!('id' in args)) || (!('type' in args))) {
			throw new Error('Missing required arguments');
		}

		this.id = args.id;
		this.$node = $("#" + args.id);
		this.type = args.type;

		this.focused_class = (('djt_config' in self && 'XHtml5FormElement_focused_class' in self.djt_config) ? self.djt_config.XHtml5FormElement_focused_class : 'djt-ui-xhtml5formelement-input-focus');
		this.focused_duration = (('djt_config' in self && 'XHtml5FormElement_focused_duration' in self.djt_config) ? self.djt_config.XHtml5FormElement_focused_duration : 0);
		this.selected_file_class = (('djt_config' in self && 'XHtml5FormElement_selected_file_class' in self.djt_config) ? self.djt_config.XHtml5FormElement_selected_file_class : 'djt-ui-xhtml5formelement-input-selected-file');
		this.selected_file_details_class = (('djt_config' in self && 'XHtml5FormElement_selected_file_details_class' in self.djt_config) ? self.djt_config.XHtml5FormElement_selected_file_details_class : 'djt-ui-xhtml5formelement-input-selected-file-details');
		this.temporarily_disabled_duration = (('djt_config' in self && 'XHtml5FormElement_temporarily_disabled_duration' in self.djt_config) ? self.djt_config.XHtml5FormElement_temporarily_disabled_duration : 3000);

		var _this = this;

		if ($.inArray(this.type, [ 'datepicker', 'form', 'form_section', 'range', 'timepicker' ]) < 0) {
			this.$node.on('focus', function() {
				_this.focus();
			});

			this.propagate_tabindex();
		}

		if (this.type == 'button') {
			if (this.$node.attr('type') == 'submit' && !(this.$node.prop('disabled'))) {
				$(this.$node.prop('form')).on('submit', function(event) {
					_this.disable_input_temporarily(event);
				})
			}
		}

		if (this.type == 'file') {
			this._init_file_input();
		}

		if (this.$node.attr('placeholder') != undefined
		    && (('placeholder' in Modernizr && (!Modernizr.placeholder))
		        || ('input' in Modernizr && (!Modernizr.input.placeholder))
		       )
		   ) {
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

			self.setTimeout(function() {
				$("#" + id).removeAttr('disabled');
			}, duration);
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
			var _this = this;

			var unfocus_callback = function() {
				$("#" + _this.id).removeClass(_this.focused_class);
			};

			if (duration > 0) {
				self.setTimeout(unfocus_callback, duration);
			} else {
				this.$node.one('focusout', unfocus_callback);
			}
		}
	}

	XHtml5FormElement.prototype._get_cleared_new_input = function($node) {
		var new_input = '<input ';

		var node_attribute_name;
		var node_value;

		for (var i = 0; i < NEW_INPUT_ATTRIBUTES_COPIED.length; i++) {
			node_attribute_name = NEW_INPUT_ATTRIBUTES_COPIED[i];

			node_value = $node.attr(node_attribute_name);
			if (node_value !== undefined) { new_input += " " + node_attribute_name + "=\"" + node_value + "\""; }
		}

		new_input += '></input>';
		var _return = $(new_input);

		node_value = $node.data();
		if (node_value !== undefined) { _return.data(node_value); }

		return _return;
	}

	XHtml5FormElement.prototype._get_file_input_details = function(input_file_data) {
		var _return = input_file_data.name;

		if ('size' in input_file_data) {
			_return += " <span class=\"" + this.selected_file_details_class + "\">(" + input_file_data.size + " B)</span>";
		}

		return _return;
	}

	XHtml5FormElement.prototype._init_file_input = function() {
		var _this = this;

		this.$node.on('change', function(event) {
			_this.on_file_input_selected(event);
		});
	}

	XHtml5FormElement.prototype.on_file_input_deselected = function(event, $selected_file_wrapper) {
		if (this.$node.attr('multiple') === undefined) {
			var $old_node = this.$node;
			this.$node = this._get_cleared_new_input($old_node);
			$old_node.remove();

			$selected_file_wrapper.after(this.$node);
			$selected_file_wrapper.remove();

			this.$node.css('display', 'initial');
			this._init_file_input();
		} else {
			$selected_file_wrapper.remove();
		}
	}

	XHtml5FormElement.prototype.on_file_input_selected = function(event) {
		if ('files' in event.target && event.target.files.length > 0) {
			var selected_file_wrapper = "<div class=\"" + this.selected_file_class + "\"></div>";
			var selected_files = event.target.files;

			this.$node.wrap(selected_file_wrapper);
			var $selected_file_wrapper = this.$node.parent();

			this.$node.css('display', 'none');

			if (selected_files.length == 1) {
				$selected_file_wrapper.append("<span>" + this._get_file_input_details(selected_files[0]) + "</span>");
			} else {
				var $selected_files_list = $('<ul></ul>');

				for (var i = 0; i < selected_files.length; i++) {
					$selected_files_list.append('<li>' + this._get_file_input_details(selected_files[i]) + '</li>');
				}

				$selected_file_wrapper.append($selected_files_list);
			}

			if (this.$node.attr('multiple') !== undefined) {
				var $old_node = this.$node;
				this.$node = this._get_cleared_new_input($old_node);
				$old_node.removeAttr('id');
				$old_node.removeAttr('tabindex');

				$selected_file_wrapper.after(this.$node);

				this.$node.css('display', 'initial');
				this._init_file_input();
			}

			var _this = this;

			Hammer($selected_file_wrapper.get(0)).on('tap', function(event) {
				_this.on_file_input_deselected(event, $selected_file_wrapper);
			});
		}
	}

	XHtml5FormElement.prototype.propagate_tabindex = function() {
		if (this.$node.attr('tabindex') === undefined) {
			this.$node.attr('tabindex', tabindex_count);
			tabindex_count += 1;
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

	return XHtml5FormElement;
});

//j// EOF