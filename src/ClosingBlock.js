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

define([ 'jquery', 'djs/Spinner.min' ], function($, Spinner) {
	return {
		close: function(id) {
			var $node = $("#" + id);

			if ($node.length > 0) {
				var $node_parent = $node.parent();

				while ($node_parent != undefined && $node_parent != null && $node_parent.children().length < 2) {
					$node = $node_parent;
					$node_parent = $node.parent();
				}

				$node.slideUp(100, function() { $(this).remove(); });
			}
		},

		init: function(args) {
			var _return = false;

			if ('id' in args && 'width' in args && 'height' in args && 'timeout' in args) {
				var _this = this;

				if (!("_djs_ClosingBlock_close" in self)) {
					self._djs_ClosingBlock_close = function(id) {
						_this.close(id);
					};
				}

				if (!("_djs_ClosingBlock_tick" in self)) {
					self._djs_ClosingBlock_tick = function(id, timeout) {
						_this._tick(id, timeout);
					};
				}

				var spinner_args = args;
				spinner_args['value'] = 0;
				var $node = $("#" + args['id']);

				try {
					Spinner.init(spinner_args);

					var $spinner = $("#" + args['id'] + "_djs_spinner_canvas");
					$node.append($('<a href="javascript:self._djs_ClosingBlock_close(\'' + args['id'] + '\')" />').append($spinner.detach()));
					Spinner.show();

					var timeout = args['timeout'] * 10;
					self.setTimeout('self._djs_ClosingBlock_tick("' + args['id'] + '", ' + timeout + ')', timeout);
				} catch (handled_exception) {
					$close_link = $('<a href="javascript:self._djs_ClosingBlock_close(\'' + args['id'] + '\')">x</a>');
					if ('css_class' in args) { $close_link.addClass(args['css_class']); }
					if ('css_style' in args) { $close_link.css(args['css_style']); }
					$node.append($close_link);

					self.setTimeout('self._djs_ClosingBlock_close("' + args['id'] + '")', args['timeout'] * 1000);
				}

				_return = true;
			}

			return _return;
		},

		_tick: function(id, timeout) {
			var ticked_spinner = $("#" + id + "_djs_spinner_canvas").data('_djs_spinner_instance');

			if (ticked_spinner != undefined) {
				var spinner_value = ticked_spinner.get_value();
				spinner_value += 1;

				if (spinner_value <= 100) {
					ticked_spinner.set_value(spinner_value);
					self.setTimeout('self._djs_ClosingBlock_tick("' + id + '", ' + timeout + ')', timeout);
				} else { this.close(id); }
			}
		}
	};
});

//j// EOF