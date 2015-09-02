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

/**
 * @module ProgressBar
 */
define([ 'jquery' ], function($) {
	/**
	 * The "ProgressBar" instance is used for manipulating an HTML5 progress bar.
	 * In case the HTML5 progress tag is not supported it must be a block
	 * element for the fallback to work.
	 *
	 * @class ProgressBar
	 * @param {Object} args Arguments to initialize a given ProgressBar
	 */
	function ProgressBar(args) {
		if (args === undefined || ((!('id' in args)) && (!('parent_id' in args)))) {
			throw new Error('Missing required arguments');
		}

		this.id = null;
		this.indeterminate = true;
		this.max = 100;
		this.$progress_bar = null;
		this.$progress_bar_fallback = null;
		this.progress_bar_width = 0;
		this.value = 0;
		this.visible = false;

		var $progress_bar_parent = null;

		if ('id' in args) {
			this.$progress_bar = $("#" + args.id);
			$progress_bar_parent = this.$progress_bar.parent();

			this.visible = this.$progress_bar.is(':hidden');

			if (this.visible) {
				var css_visibility = this.$progress_bar.css('visibility');

				if (typeof css_visibility == 'string' && css_visibility.toLowerCase() == 'hidden') {
					this.visible = false;
				}
			}
		} else {
			var css_width = 'inherit';
			var css_height = 'inherit';

			$progress_bar_parent = $("#" + args.parent_id);

			if ('width' in args) {
				css_width = ((typeof args.width != 'string' || args.width.indexOf('%') < 0) ? args.width + "px" : args.width);
			}

			if ('height' in args) {
				css_height = ((typeof args.height != 'string' || args.height.indexOf('%') < 0) ? args.height + "px" : args.height);
			}

			this.$progress_bar = $('<progress id="' + args.parent_id + '_djs_progress_bar" max="100" style="width:' + css_width + ';height:' + css_height + ';visibility:hidden"></progress>');
			$progress_bar_parent.append(this.$progress_bar);
		}

		if ('ProgressBar_class' in args) {
			this.$progress_bar.addClass(args.ProgressBar_class);
		} else if ($progress_bar_parent.data('djs-ui-progress-bar-class') != undefined) {
			this.$progress_bar.addClass($progress_bar_parent.data('djs-ui-progress-bar-class'));
		} else if ('djs_config' in self && 'ProgressBar_class' in self.djs_config) {
			this.$progress_bar.addClass(self.djs_config.ProgressBar_class);
		} else {
			this.$progress_bar.addClass('djs-ui-ProgressBar');
		}

		if ('ProgressBar_style' in args) {
			this.$progress_bar.css(args.ProgressBar_style);
		}

		var progress_bar = this.$progress_bar.get(0);

		if ('position' in progress_bar) {
			this.indeterminate = (progress_bar.position < 0);
			this.max = progress_bar.max;
			this.$progress_bar.data('djs-progress-bar', this);
		} else {
			this.$progress_bar.addClass('djs-ui-ProgressBar-fallback');

			this.$progress_bar_fallback = $('<div id="' + args.id + '_djs_progress_bar_fallback" style="position:relative;width:0px;height:inherit"></div>');
			this.$progress_bar.append(this.$progress_bar_fallback);

			if ('ProgressBar_fallback_class' in args) {
				this.$progress_bar_fallback.addClass(args.ProgressBar_fallback_class);
			} else if ($progress_bar_parent.data('djs-ui-progress-bar-fallback-class') != undefined) {
				this.$progress_bar_fallback.addClass($progress_bar_parent.data('djs-ui-progress-bar-fallback-class'));
			} else if ('djs_config' in self && 'ProgressBar_fallback_class' in self.djs_config) {
				this.$progress_bar_fallback.addClass(self.djs_config.ProgressBar_fallback_class);
			} else {
				this.$progress_bar_fallback.css('background-color', this.$progress_bar.css('color'));
			}

			this.$progress_bar_fallback.data('djs-progress-bar', this);
		}

		if ('value' in args) {
			this.indeterminate = false;
			this.set_value(args['value']);
		}
	}

	/**
	 * Returns the progress bar jQuery instance.
	 *
	 * @method
	 * @return {object} jQuery instance
	 */
	ProgressBar.prototype.get_jQnode = function() {
		return ((this.$progress_bar_fallback == null) ? this.$progress_bar : this.$progress_bar_fallback);
	}

	/**
	 * Returns the maximum progress value.
	 *
	 * @method
	 * @return {Number} Progress value
	 */
	ProgressBar.prototype.get_max = function() {
		return this.max;
	}

	/**
	 * Returns the current progress value.
	 *
	 * @method
	 * @return {Number} Progress value
	 */
	ProgressBar.prototype.get_value = function() {
		return this.value;
	}

	/**
	 * Sets the current progress value.
	 *
	 * @method
	 * @param {Number} value Progress value
	 */
	ProgressBar.prototype.set_value = function(value) {
		this.indeterminate = (value == null);
		this.value = value;

		if (this.visible) {
			this.get_jQnode().finish().queue(this._paint);
		}
	}

	/**
	 * Shows the spinner canvas and starts animating it.
	 *
	 * @method
	 */
	ProgressBar.prototype.show = function() {
		this.$progress_bar.css('visibility', 'visible').show();

		if (this.$progress_bar_fallback != null) {
			this.$progress_bar_fallback.css('visibility', 'visible');
		}

		this.progress_bar_width = this.$progress_bar.width();
		this.visible = true;

		this.get_jQnode().queue(this._paint);
	}

	/**
	 * Repaints the progress bar.
	 *
	 * @method
	 * @param {Function} next jQuery function to call that will dequeue the next
	 *                        item
	 */
	ProgressBar.prototype._paint = function(next) {
		var _this = $(this).data('djs-progress-bar');

		if (_this.$progress_bar_fallback != null) {
			var progress_bar_width = _this.progress_bar_width;

			if (_this.indeterminate) {
				var progress_bar_indeterminate_width = Math.floor(progress_bar_width / 10);

				_this.$progress_bar_fallback.css('width', progress_bar_indeterminate_width + "px")
				                            .animate({ left: "0px", width: _this.progress_bar_width + "px" })
				                            .animate({ left: (_this.progress_bar_width - progress_bar_indeterminate_width) + "px", width: progress_bar_indeterminate_width + "px" })
				                            .animate({ left: "0px", width: _this.progress_bar_width + "px" })
				                            .animate({ width: progress_bar_indeterminate_width + "px" })
				                            .queue('fx', _this._paint);
			} else {
				var progress_percentage = (_this.value / _this.max);
				var progress_bar_width = Math.floor(_this.progress_bar_width * progress_percentage);

				if (progress_bar_width >= 0 && progress_bar_width <= _this.progress_bar_width) {
					_this.$progress_bar_fallback.css('width', progress_bar_width + "px");
				}
			}
		} else if (_this.indeterminate) {
			_this.$progress_bar.attr('value', null);
		} else {
			this.value = _this.value;
		}

		next();
	}

	return ProgressBar;
});

//j// EOF