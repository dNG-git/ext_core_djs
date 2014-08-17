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

define([ 'jquery' ], function($) {
	return {
		_get_hidden_node_dimensions: function($node, additional_metrics) {
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

			var _return = this._get_node_metrics($node, additional_metrics);

			if (additional_metrics) {
				if (top_value == undefined) { _return.top = undefined; }
				else { _return.top = parseInt(top_value); }
			}

			var css_attributes = { };

			if (display_value != undefined) { css_attributes['display'] = display_value; }
			if (position_value != undefined) { css_attributes['position'] = position_value; }
			if (top_value != undefined) { css_attributes['top'] = top_value; }
			if (visibility_value != undefined) { css_attributes['visibility'] = visibility_value; }

			$node.css(css_attributes);

			return _return;
		},

		_get_node_metrics: function($node, additional_metrics) {
			if (additional_metrics == null) {
				additional_metrics = false;
			}

			var $hidden_node = $node.filter(':hidden');
			var _return = { width: 0, height: 0 };

			if ($hidden_node.length > 0) { _return = this._get_hidden_node_dimensions($node); }
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
		},

		_get_reference_offset: function($my, my_reference, my_metrics, $at, at_reference, at_metrics, viewport) {
			if (viewport == null) {
				viewport = self.document;
			}

			var $viewport = $(viewport);
			var x, y;

			var my_reference_configuration = { x: 'center', y: 'top' };
			var my_reference_values = my_reference.split(' ');

			if (my_reference_values.length > 1) {
				my_reference_configuration.y = my_reference_values[0];
				my_reference_configuration.x = my_reference_values[1];
			}

			var at_reference_configuration = { x: 'center', y: 'bottom' };
			var at_reference_values = at_reference.split(' ');

			if (at_reference_values.length > 1) {
				at_reference_configuration.y = at_reference_values[0];
				at_reference_configuration.x = at_reference_values[1];
			}

			if (at_reference_configuration.x == 'center') {
				x = at_metrics.width / 2;
			} else if (at_reference_configuration.x == 'right') {
				x = at_metrics.width;
			} else {
				x = 0;
			}

			if (at_reference_configuration.y == 'middle') {
				y = at_metrics.height / 2;
			} else if (at_reference_configuration.y == 'bottom') {
				y = at_metrics.height;
			} else {
				y = 0;
			}

			x += at_metrics.left;

			if (my_reference_configuration.y == 'left') {
				x += 1;
			}

			var viewport_width = $viewport.outerWidth(true);

			if (my_reference_configuration.x == 'center') {
				if ((my_metrics.width / 2) + x > viewport_width) {
					x = viewport_width - (my_metrics.width / 2);
				}

				x -= my_metrics.width / 2;
			} else if (my_reference_configuration.x == 'right') {
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

			if (my_reference_configuration.y == 'top') {
				y += 1;
			}

			var viewport_height = $viewport.outerHeight(true);

			if (my_reference_configuration.y == 'middle') {
				if ((my_metrics.height / 2) + y > viewport_height) {
					y = viewport_height - (my_metrics.height * 1.5);
				}

				y -= my_metrics.height / 2;
			} else if (my_reference_configuration.y == 'bottom') {
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
		},

		set_position: function(args) {
			var _return = false;

			if ('my_id' in args && 'at_id' in args) {
				var $my = $("#" + args.my_id);

				var my_reference = 'top center';

				if ('my_reference' in args) {
					my_reference = args.my_reference;
				}

				var $at = $("#" + args.at_id);

				var at_reference = 'bottom center';

				if ('at_reference' in args) {
					at_reference = args.at_reference;
				}

				var viewport = null;

				if ('viewport' in args) {
					viewport = args.viewport;
				}

				this._set_position($my, my_reference, $at, at_reference, viewport);
				_return = true;
			}

			return _return;
		},

		_set_position: function($my, my_reference, $at, at_reference, viewport) {
			var my_metrics = this._get_node_metrics($my);
			var at_metrics = this._get_node_metrics($at, true);

			$my.css({
				position: 'absolute',
				margin: 0
			});

			my_offset = this._get_reference_offset($my, my_reference, my_metrics, $at, at_reference, at_metrics, viewport);

			$my.css({
				top: my_offset.y + 'px',
				left: my_offset.x + 'px'
			});
		}
	};
});

//j// EOF