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

/**
 * @module XHtml5FormElement
 */
define([ 'jquery', 'Hammer', 'Modernizr' ], function($, Hammer, Modernizr) {
	/**
	 * While copying an input element the following list of attributes are copied
	 * as well.
	 *
	 * @constant
	 */
	var NEW_INPUT_ATTRIBUTES_COPIED = [ 'id', 'name', 'type', 'size', 'class', 'style', 'multiple', 'tabindex' ];
	/**
	 * "tabindex" applied to the next form field.
	 *
	 * @static
	 */
	var tabindex_count = 1;

	/**
	 * "XHtml5FormElement" provides some fallback and dynamic features to
	 * (X)HTML5 form fields.
	 *
	 * @class XHtml5FormElement
	 *
	 * @param {object} args Arguments to initialize a given XHtml5FormElement
	 */
	function XHtml5FormElement(args) {
		if (args === undefined || (!('type' in args))) {
			throw new Error('Missing required arguments');
		}

		this.$node = null;
		this.type = args.type;

		if ('id' in args) {
			this.$node = $("#" + args.id);
		} else if ('jQnode' in args) {
			this.$node = args.jQnode;
		}

		if (this.$node == null) {
			throw new Error('Missing required arguments');
		}

		this.id = this.$node.attr('id');

		if (this.id === undefined) {
			this.id = ("djt_xhtml5formelement_id_" + Math.random().toString().replace(/\W/,'_'));
			this.$node.attr('id', this.id);
		}

		this.focused_class = (('djt_config' in self && 'XHtml5FormElement_focused_class' in self.djt_config) ? self.djt_config.XHtml5FormElement_focused_class : 'djt-ui-xhtml5formelement-input-focus');
		this.focused_duration = (('djt_config' in self && 'XHtml5FormElement_focused_duration' in self.djt_config) ? self.djt_config.XHtml5FormElement_focused_duration : 0);
		this.selected_file_class = (('djt_config' in self && 'XHtml5FormElement_selected_file_class' in self.djt_config) ? self.djt_config.XHtml5FormElement_selected_file_class : 'djt-ui-xhtml5formelement-input-selected-file');
		this.selected_file_details_class = (('djt_config' in self && 'XHtml5FormElement_selected_file_details_class' in self.djt_config) ? self.djt_config.XHtml5FormElement_selected_file_details_class : 'djt-ui-xhtml5formelement-input-selected-file-details');
		this.temporarily_disabled_duration = (('djt_config' in self && 'XHtml5FormElement_temporarily_disabled_duration' in self.djt_config) ? self.djt_config.XHtml5FormElement_temporarily_disabled_duration : 3000);

		var _this = this;

		if ($.inArray(this.type, [ 'form', 'form_section' ]) < 0
		    && ((!('init_default_behaviour' in args)) || args.init_default_behaviour)
		   ) {
			this.$node.on('focus', function() {
				_this.on_focus();
			});

			//if ($.inArray(this.type, [ 'date', 'datetime-local', 'month', 'range', 'time', 'week' ]) < 0) {
			this.propagate_tabindex();
			//}
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

	/**
	 * Disable input for a given amount of time.
	 *
	 * @method
	 *
	 * @param {object} event Event triggering the disabled state
	 * @param {number} duration Duration of the disabled state
	 */
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
				$("#" + this.id).removeAttr('disabled');
			}, duration);
		}

		if (event == null) {
			return _return;
		} else if (!_return) {
			event.preventDefault();
		}
	}

	/**
	 * Returns a clean copy of the input field.
	 *
	 * @method
	 *
	 * @param {object} $node jQuery node to be copied
	 *
	 * @return {object} Copied jQuery node
	 */
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

	/**
	 * Returns (X)HTML code with details about a given file.
	 *
	 * @method
	 *
	 * @param {object} file_data File data
	 *
	 * @return {string} (X)HTML code with file details
	 */
	XHtml5FormElement.prototype._get_file_input_details = function(file_data) {
		var _return = file_data.name;

		if ('size' in file_data) {
			_return += " <span class=\"" + this.selected_file_details_class + "\">(" + file_data.size + " B)</span>";
		}

		return _return;
	}

	/**
	 * Initializes file input fields.
	 *
	 * @method
	 */
	XHtml5FormElement.prototype._init_file_input = function() {
		var _this = this;

		this.$node.on('change', function(event) {
			_this.on_file_input_selected(event);
		});
	}

	/**
	 * Event listener for deselecting a file upload.
	 *
	 * @method
	 *
	 * @param {object} event Event triggering deselection
	 * @param {object} $selected_file_wrapper File upload wrapper to be removed
	 */
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

	/**
	 * Event listener for selecting a file upload.
	 *
	 * @method
	 *
	 * @param {object} event Event triggering selection
	 */
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

	/**
	 * Event listener for focusing an input field.
	 *
	 * @method
	 *
	 * @param {number} duration Duration to temporarily apply the focused CSS class
	 */
	XHtml5FormElement.prototype.on_focus = function(duration) {
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

	/**
	 * Applies the next "tabindex" number to the input field.
	 *
	 * @method
	 */
	XHtml5FormElement.prototype.propagate_tabindex = function() {
		if (this.$node.attr('tabindex') === undefined) {
			this.$node.attr('tabindex', tabindex_count);
			tabindex_count += 1;
		}
	}

	/**
	 * Sets the focused CSS class used.
	 *
	 * @method
	 *
	 * @param {string} class_name CSS class name
	 */
	XHtml5FormElement.prototype.set_focused_class = function(class_name) {
		this.focused_class = class_name;
	}

	/**
	 * Sets the duration the focused CSS class is applied temporarily.
	 *
	 * @method
	 *
	 * @param {duration} duration Duration to temporarily apply the focused CSS
	 *        class
	 */
	XHtml5FormElement.prototype.set_focused_duration = function(duration) {
		this.focused_duration = duration;
	}

	/**
	 * Sets the duration the input field will be disabled temporarily.
	 *
	 * @method
	 *
	 * @param {duration} duration Duration to temporarily disable the input field
	 */
	XHtml5FormElement.prototype.set_temporarily_disabled_duration = function(duration) {
		this.temporarily_disabled_duration = duration;
	}

	return XHtml5FormElement;
});

//j// EOF