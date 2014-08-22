//j// BOF

/* -------------------------------------------------------------------------
direct PAS
Python Application Services
----------------------------------------------------------------------------
(C) direct Netware Group - All rights reserved
https://www.direct-netware.de/redirect?pas;http;js

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file, You can
obtain one at http://mozilla.org/MPL/2.0/.
----------------------------------------------------------------------------
https://www.direct-netware.de/redirect?licenses;mpl2
----------------------------------------------------------------------------
#echo(pasHttpJsVersion)#
#echo(__FILEPATH__)#
------------------------------------------------------------------------- */

define([ 'jquery' ], function($) {
	function _get_hidden_node_dimensions($node, additional_metrics) {
		var display_value = $node.css('display');
		var position_value = $node.css('position');
		var top_value = $node.css('top');
		var visibility_value = $node.css('visibility');

		$node.css({
			position: 'absolute',
			display: 'block',
			visibility: 'visible',
			top: -10000 + 'px'
		});

		var _return = _get_node_metrics($node, additional_metrics);
		if (additional_metrics) { _return.top = ((top_value == undefined) ? undefined : parseInt(top_value)); }

		var css_attributes = { };

		if (display_value != undefined) { css_attributes['display'] = display_value; }
		if (position_value != undefined) { css_attributes['position'] = position_value; }
		if (top_value != undefined) { css_attributes['top'] = top_value; }
		if (visibility_value != undefined) { css_attributes['visibility'] = visibility_value; }

		$node.css(css_attributes);

		return _return;
	}

	function _get_node_metrics($node, additional_metrics) {
		if (additional_metrics == null) { additional_metrics = false; }

		var $hidden_node = $node.filter(':hidden');
		var _return = { width: 0, height: 0 };

		if ($hidden_node.length > 0) { _return = _get_hidden_node_dimensions($node); }
		else {
			_return.width = $node.outerWidth();
			_return.height = $node.outerHeight();

			if (additional_metrics) {
				var offset = $node.offset();

				_return['top'] = Math.floor(offset.top);
				_return['left'] = Math.floor(offset.left);
				_return['contentWidth'] = Math.floor($node.width());
				_return['contentHeight'] = Math.floor($node.height());
				_return['innerWidth'] = Math.floor($node.innerWidth());
				_return['innerHeight'] = Math.floor($node.innerHeight());
				_return['outerWidth'] = Math.floor($node.outerWidth(true));
				_return['outerHeight'] = Math.floor($node.outerHeight(true));
			}
		}

		return _return;
	}

	function NodePosition(args) {
		this.$at = null;
		this.at_reference_configuration = { x: 'center', y: 'bottom' };
		this.$my = null;
		this.my_reference_configuration = { x: 'center', y: 'top' };
		this.$viewport = null;

		if ('at_id' in args) { this.$at = $("#" + args.at_id); }
		else if ('jQat' in args) { this.$at = args.jQat; }

		if ('my_id' in args) { this.$my = $("#" + args.my_id); }
		else if ('jQmy' in args) { this.$my = args.jQmy; }

		if (this.$at != null && this.$my != null) {
			if ('at_reference' in args) {
				var at_reference_values = args.at_reference.split(' ');

				if (at_reference_values.length > 1) {
					this.at_reference_configuration.y = at_reference_values[0];
					this.at_reference_configuration.x = at_reference_values[1];
				}
			}

			if ('my_reference' in args) {
				var my_reference_values = args.my_reference.split(' ');

				if (my_reference_values.length > 1) {
					this.my_reference_configuration.y = my_reference_values[0];
					this.my_reference_configuration.x = my_reference_values[1];
				}
			}

			if ('jQviewport' in args) { this.$viewport = args.viewport; }
			else if ('viewport' in args) { this.$viewport = $(args.viewport); }
			else { this.$viewport = $(self.document); }

			this.reposition();

			var _this = this;

			$(self).on('resize', function() {
				if (_this.$my.attr('display') != 'none') {
					_this.reposition();
				}
			});
		}
	}

	NodePosition.prototype.get_reference_offset = function(my_metrics, at_metrics) {
		var x, y;

		if (this.at_reference_configuration.x == 'center') {
			x = at_metrics.width / 2;
		} else if (this.at_reference_configuration.x == 'right') {
			x = at_metrics.width;
		} else {
			x = 0;
		}

		if (this.at_reference_configuration.y == 'middle') {
			y = at_metrics.height / 2;
		} else if (this.at_reference_configuration.y == 'bottom') {
			y = at_metrics.height;
		} else {
			y = 0;
		}

		x += at_metrics.left;

		if (this.my_reference_configuration.y == 'left') {
			x += 1;
		}

		var viewport_width = this.$viewport.outerWidth(true);

		if (this.my_reference_configuration.x == 'center') {
			if ((my_metrics.width / 2) + x > viewport_width) {
				x = viewport_width - (my_metrics.width / 2);
			}

			x -= my_metrics.width / 2;
		} else if (this.my_reference_configuration.x == 'right') {
			if (x > viewport_width) {
				x = viewport_width;
			}

			x -= my_metrics.width;
		} else if ((x + my_metrics.width) > viewport_width) {
			x = viewport_width - my_metrics.width;
		}

		if (x < 0) {
			x = 0;
		} else {
			x = Math.floor(x);
		}

		y += at_metrics.top;

		if (this.my_reference_configuration.y == 'top') {
			y += 1;
		}

		var viewport_height = this.$viewport.outerHeight(true);

		if (this.my_reference_configuration.y == 'middle') {
			if ((my_metrics.height / 2) + y > viewport_height) {
				y = viewport_height - (my_metrics.height * 1.5);
			}

			y -= my_metrics.height / 2;
		} else if (this.my_reference_configuration.y == 'bottom') {
			if (y > viewport_height) {
				y = viewport_height;
			}

			y -= my_metrics.height;
		} else if ((y + my_metrics.height) > viewport_height) {
			y = viewport_height - my_metrics.height;
		}

		if (y < 0) {
			y = 0;
		} else {
			y = Math.floor(y);
		}

		return { x: x, y: y };
	}

	NodePosition.prototype.reposition = function(classname) {
		var my_metrics = _get_node_metrics(this.$my);
		var at_metrics = _get_node_metrics(this.$at, true);

		this.$my.css({
			position: 'absolute',
			margin: 0
		});

		my_offset = this.get_reference_offset(my_metrics, at_metrics);

		this.$my.css({
			top: my_offset.y + 'px',
			left: my_offset.x + 'px'
		});
	}

	return NodePosition;
});

//j// EOF