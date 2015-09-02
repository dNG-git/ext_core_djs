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
 * @module FixableBlock
 */
define([ 'jquery', 'djs/NodePosition.min' ], function($, NodePosition) {
	/**
	 * "FixableBlock" is an automatically top-fixed block.
	 *
	 * @class FixableBlock
	 * @param {Object} args Arguments to initialize a given FixableBlock
	 */
	function FixableBlock(args) {
		if (args === undefined || (!('id' in args))) {
			throw new Error('Missing required argument');
		}

		this.event_id = Math.random().toString();
		this.fixable_block_enabled = true;
		this.fixable_block_fixed = false;
		this.fixable_block_metrics = null;

		this.$fixable_block = $("#" + args.id);

		if ('FixableBlock_fixed_class' in args) {
			this.fixable_block_fixed_class = args.FixableBlock_fixed_class;
		} else if (this.$fixable_block.data('djs-ui-fixableblock-fixed-class') != undefined) {
			this.fixable_block_fixed_class = this.$fixable_block.data('djs-ui-fixableblock-fixed-class');
		} else if ('djs_config' in self && 'FixableBlock_fixed_class' in self.djs_config) {
			this.fixable_block_fixed_class = self.djs_config.FixableBlock_fixed_class;
		} else {
			this.fixable_block_fixed_class = 'djs-ui-FixableBlock-fixed';
		}

		this.fixable_block_node_position = new NodePosition({ jQmy: this.$fixable_block });

		this.$fixable_block_dummy = $("<div style='display: none; visibility: hidden'></div>").insertAfter(this.$fixable_block);
		this.recalculate_and_update();
		this.update_node_css();

		var _this = this;

		$(self).on("resize." + this.event_id, function() {
			if (_this.$fixable_block.attr('display') != 'none') {
				_this.recalculate_and_update();
			}
		});

		$(self).on("scroll." + this.event_id, function() {
			if (_this.$fixable_block.attr('display') != 'none') {
				_this.update_fixed_state();
			}
		});
	}

	/**
	 * Destroys the fixable block instance and its attached event listeners.
	 *
	 * @method
	 */
	NodePosition.prototype.destroy = function() {
		$(self).off("resize." + this.event_id);
		$(self).off("scroll." + this.event_id);
	}

	/**
	 * The "recalculate_and_update()" method is called after changes that may
	 * impact the fixed state of the block.
	 *
	 * @method
	 */
	FixableBlock.prototype.recalculate_and_update = function() {
		var is_fixed = this.fixable_block_fixed;

		if (is_fixed) {
			var css_attributes = {
				'position': 'static',
				'width': 'auto',
				'top': 'initial',
				'left': 'initial'
			};

			this.$fixable_block.css(css_attributes);
		}

		var block_metrics = this.fixable_block_node_position.get_my_metrics(true);

		if (this.fixable_block_metrics == null
		    || this.fixable_block_metrics['width'] != block_metrics['width']
		    || this.fixable_block_metrics['height'] != block_metrics['height']
		   ) {
			this.$fixable_block_dummy.css({
				'width': block_metrics['width'] + 'px',
				'height': block_metrics['height'] + 'px'
			});
		}

		this.fixable_block_metrics = block_metrics;

		this.update_fixed_state();

		if (is_fixed && is_fixed == this.fixable_block_fixed) {
			this.update_node_css();
		}
	}

	/**
	 * Enables or disables the fixed state of the block.
	 *
	 * @method
	 * @param {Boolean} enabled False to disable
	 */
	FixableBlock.prototype.set_fixable_block_enabled = function(enabled) {
		if (enabled === undefined) {
			enabled = true;
		}

		this.fixable_block_enabled = enabled;

		if (this.fixable_block_fixed) {
			this.update_fixed_state();
		}
	}

	/**
	 * Sets the CSS class to be added to the block if the fixed state is active.
	 *
	 * @method
	 * @param {String} classname CSS class name
	 */
	FixableBlock.prototype.set_fixable_block_fixed_class = function(classname) {
		if (this.fixable_block_fixed) {
			this.$fixable_block.removeClass(this.fixable_block_fixed_class).addClass(classname);
		}

		this.fixable_block_fixed_class = classname;
	}

	/**
	 * Checks and updates if the block is in the fixed state.
	 *
	 * @method
	 */
	FixableBlock.prototype.update_fixed_state = function() {
		if (this.fixable_block_enabled && $(self).scrollTop() > this.fixable_block_metrics['top']) {
			if (!this.fixable_block_fixed) {
				this.$fixable_block.addClass(this.fixable_block_fixed_class);
				this.fixable_block_fixed = true;

				this.update_node_css();
			}
		} else if (this.fixable_block_fixed) {
			this.$fixable_block.removeClass(this.fixable_block_fixed_class);
			this.fixable_block_fixed = false;

			this.update_node_css();
		}
	}

	/**
	 * Updates the block CSS to correspond to the calculated state.
	 *
	 * @method
	 */
	FixableBlock.prototype.update_node_css = function() {
		var css_attributes = {
			'position': 'static',
			'width': 'auto',
			'top': 'initial',
			'left': 'initial'
		};

		if (this.fixable_block_fixed) {
			css_attributes['position'] = 'fixed';
			css_attributes['width'] = this.fixable_block_metrics['width'] + 'px';
			css_attributes['top'] = '0px';
			css_attributes['left'] = this.fixable_block_metrics['left'] + 'px';
		}

		this.$fixable_block.css(css_attributes);
		this.$fixable_block_dummy.css('display', (this.fixable_block_fixed ? 'block' : 'none'));
	}

	return FixableBlock;
});

//j// EOF