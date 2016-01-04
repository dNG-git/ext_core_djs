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
 * @module ClosingBlock
 */
define([ 'jquery', 'djt/Spinner.min' ], function($, Spinner) {
	/**
	 * The "close()" helper function is called if the spinner is clicked or after a
	 * timeout.
	 *
	 * @function _djt_ClosingBlock_close
	 * @global
	 *
	 * @param {string} id Block ID to be closed
	 */
	function close(id) {
		var $node = $("#" + id);

		$node.slideUp(100, function() {
			var $node = $(this)

			var $parent_node = $node.parent();

			$node.triggerHandler('xdomremove');
			$node.remove();

			$parent_node.trigger('xdomchanged');
		});
	}

	/**
	 * "ClosingBlock" is a spinner animated block that closes itself after a
	 * given timeout.
	 *
	 * @class ClosingBlock
	 *
	 * @param {object} args Arguments to initialize a given ClosingBlock
	 */
	function ClosingBlock(args) {
		if (args === undefined
		    || (!('width' in args))
		    || (!('height' in args))
		    || (!('timeout' in args))
		   ) {
			throw new Error('Missing required arguments');
		}

		if (!('_djt_ClosingBlock_close' in self)) {
			self._djt_ClosingBlock_close = close;
		}

		var $node = null;

		if ('id' in args) {
			$node = $("#" + args.id);
		} else if ('jQnode' in args) {
			$node = args.jQnode;
		}

		if ($node == null) {
			throw new Error('Missing required arguments');
		}

		var node_id = $node.attr('id');

		if (node_id === undefined) {
			node_id = ("djt_closingblock_id_" + Math.random().toString().replace(/\W/,'_'));
			$node.attr('id', node_id);
		}

		this.id = node_id;
		this.timeout = args.timeout * 10;

		var spinner_args = { parent_id: node_id,
		                     width: args.width,
		                     height: args.height,
		                     value: 0
		                   };

		$.each(args, function(key, value) {
			if (key.indexOf('Spinner_') === 0) {
				spinner_args[key] = value;
			}
		});

		var spinner = new Spinner(spinner_args);

		var $spinner = spinner.get_jQnode();
		$spinner.wrap($('<a href="javascript:self._djt_ClosingBlock_close(\'' + node_id + '\')"></a>'));

		spinner.show();

		$node.data('djt-closingblock', this);
		$node.data('djt-closingblock-spinner', spinner);
		$node.delay(this.timeout).queue(this._tick);
	}

	/**
	 * The "_tick() " helper function is used to increase the spinner value.
	 *
	 * @method
	 *
	 * @param {function} next jQuery function to call that will dequeue the next
	 *                        item
	 */
	ClosingBlock.prototype._tick = function(next) {
		var $node = $(this);
		var _this = $node.data('djt-closingblock');

		var ticked_spinner = $node.data('djt-closingblock-spinner');

		if (ticked_spinner != undefined) {
			var spinner_value = ticked_spinner.get_value();
			spinner_value += 1;

			if (spinner_value <= 100) {
				ticked_spinner.set_value(spinner_value);
				$node.delay(_this.timeout).queue(_this._tick);
			} else {
				close(_this.id);
			}
		}

		next();
	}


	return ClosingBlock;
});

//j// EOF