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
 * @module NodePosition
 */
define([ 'jquery' ], function($) {
	/**
	 * The "_get_hidden_node_metrics()" helper function is used to get metrics of
	 * hidden nodes.
	 *
	 * @function
	 * @param {Object} $node jQuery node instance
	 * @param {Boolean} additional_metrics True to calculate additional metrics
	 * @return {Object} Node metrics
	 */
	function _get_hidden_node_metrics($node, additional_metrics) {
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

		if (additional_metrics) {
			_return.top = ((top_value == undefined) ? undefined : parseInt(top_value));
		}

		var css_attributes = { };

		if (display_value != undefined) {
			css_attributes['display'] = display_value;
		}

		if (position_value != undefined) {
			css_attributes['position'] = position_value;
		}

		if (top_value != undefined) {
			css_attributes['top'] = top_value;
		}

		if (visibility_value != undefined) {
			css_attributes['visibility'] = visibility_value;
		}

		$node.css(css_attributes);

		return _return;
	}

	/**
	 * The "_get_node_metrics()" helper function is used to get metrics of
	 * nodes.
	 *
	 * @function
	 * @param {Object} $node jQuery node instance
	 * @param {Boolean} additional_metrics True to calculate additional metrics
	 * @return {Object} Node metrics
	 */
	function _get_node_metrics($node, additional_metrics) {
		if (additional_metrics == null) {
			additional_metrics = false;
		}

		var _return = { width: 0, height: 0 };

		var $hidden_node = $node.filter(':hidden');

		if ($hidden_node.length > 0) {
			_return = _get_hidden_node_metrics($node);
		} else {
			_return.width = $node.outerWidth();
			_return.height = $node.outerHeight();

			if (additional_metrics) {
				var offset = $node.offset();

				_return['top'] = offset.top;
				_return['left'] = offset.left;
				_return['contentWidth'] = $node.width();
				_return['contentHeight'] = $node.height();
				_return['innerWidth'] = $node.innerWidth();
				_return['innerHeight'] = $node.innerHeight();
				_return['outerWidth'] = $node.outerWidth(true);
				_return['outerHeight'] = $node.outerHeight(true);
			}
		}

		return _return;
	}

	/**
	 * "NodePosition" provides calculation and automated reposition of referenced
	 * blocks.
	 *
	 * @class NodePosition
	 * @param {Object} args Arguments to initialize a given NodePosition
	 */
	function NodePosition(args) {
		if (args === undefined) {
			throw new Error('Missing required argument');
		}

		this.$at = null;
		this.at_reference_configuration = { x: 'center', y: 'bottom' };
		this.event_id = Math.random().toString();
		this.$my = null;
		this.my_reference_configuration = { x: 'center', y: 'top' };

		if ('at_id' in args) {
			this.$at = $("#" + args.at_id);
		} else if ('jQat' in args && args.jQat.length > 0) {
			this.$at = args.jQat;
		}

		if ('my_id' in args) {
			this.$my = $("#" + args.my_id);
		} else if ('jQmy' in args && args.jQmy.length > 0) {
			this.$my = args.jQmy;
		}

		if (this.$my == null) {
			throw new Error('Missing required argument');
		}

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

		if ('jQviewport' in args) {
			this.$viewport = args.viewport;
		} else if ('viewport' in args) {
			this.$viewport = $(args.viewport);
		} else {
			this.$viewport = $(self.document);
		}

		this.reposition();

		var _this = this;

		$(self).on("resize." + this.event_id, function() {
			if (_this.$my.attr('display') != 'none') {
				_this.reposition();
			}
		});
	}

	/**
	 * Destroys the node position instance and its attached event listeners.
	 *
	 * @method
	 */
	NodePosition.prototype.destroy = function() {
		this.$at = null;
		this.$my = null;

		$(self).off("resize." + this.event_id);
	}

	/**
	 * "get_at_metrics()" returns the metrics for the "at" node.
	 *
	 * @method
	 * @param {Boolean} additional_metrics True to calculate additional metrics
	 * @return {Object} Node metrics
	 */
	NodePosition.prototype.get_at_metrics = function(additional_metrics) {
		if (additional_metrics === undefined) {
			additional_metrics = false;
		}

		var _return = null;

		if (this.$at != null) {
			_return = _get_node_metrics(this.$at, additional_metrics);
		}

		return _return;
	}

	/**
	 * "get_my_metrics()" returns the metrics for the "my" node.
	 *
	 * @method
	 * @param {Boolean} additional_metrics True to calculate additional metrics
	 * @return {Object} Node metrics
	 */
	NodePosition.prototype.get_my_metrics = function(additional_metrics) {
		if (additional_metrics === undefined) {
			additional_metrics = false;
		}

		return _get_node_metrics(this.$my, additional_metrics);
	}

	/**
	 * Returns the offset information for the "at" node based on the "my" node.
	 *
	 * @method
	 * @param {Object} my_metrics "my" metrics
	 * @param {Object} at_metrics "at" metrics
	 * @return {Object} Offset x and y coordinates
	 */
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

		x = ((x < 0) ? 0 : x);

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

		y = ((y < 0) ? 0 : y);

		return { x: x, y: y };
	}

	/**
	 * Returns the offset information for the "at" node based on the "my" node.
	 *
	 * @method
	 * @param {Object} my_metrics "my" metrics
	 * @param {Object} at_metrics "at" metrics
	 */
	NodePosition.prototype.reposition = function(classname) {
		if (this.$at != null) {
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
	}

	return NodePosition;
});

//j// EOF