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
			var $Node = $("#" + id);

			if ($Node.length > 0) {
				var $NodeParent = $Node.parent();

				while ($NodeParent != undefined && $NodeParent != null && $NodeParent.children().length < 2) {
					$Node = $NodeParent;
					$NodeParent = $Node.parent();
				}

				$Node.slideUp(100, function() { $(this).remove(); });
			}
		},

		init: function(args) {
			var _return = false;

			if ('id' in args && 'width' in args && 'height' in args && 'timeout' in args) {
				_return = true;
				var _this = this;

				if (!("_djs_closing_block" in self)) {
					self._djs_closing_block = function(id) {
						_this.close(id);
					};
				}

				var spinner_args = args;
				spinner_args['value'] = 0;
				var $Node = $("#" + args['id']);

				try {
					Spinner.init(spinner_args);

					var $Spinner = $("#" + args['id'] + "_djs_spinner_canvas");
					$Node.append($('<a href="javascript:self._djs_closing_block(\'' + args['id'] + '\')" />').append($Spinner.detach()));
					Spinner.show();

					var timeout = args['timeout'] * 10;
					self.setTimeout('require([ "djs/ClosingBlock.min" ], function(ClosingBlock) { ClosingBlock._tick("' + args['id'] + '", ' + timeout + '); });', timeout);
				} catch (handled_exception) {
					$CloseLink = $('<a href="javascript:self._djs_closing_block(\'' + args['id'] + '\')">x</a>');
					if ('css_class' in args) { $CloseLink.addClass(args['css_class']); }
					if ('css_style' in args) { $CloseLink.css(args['css_style']); }
					$Node.append($CloseLink);

					self.setTimeout('require([ "djs/ClosingBlock.min" ], function(ClosingBlock) { ClosingBlock.close("' + args['id'] + '"); });', args['timeout'] * 1000);
				}
			}

			return _return;
		},

		_tick: function(id, timeout) {
			var TickedSpinner = $("#" + id + "_djs_spinner_canvas").data('_djs_spinner_instance');

			if (TickedSpinner != undefined) {
				var spinner_value = TickedSpinner.get_value();
				spinner_value += 1;

				if (spinner_value <= 100) {
					TickedSpinner.set_value(spinner_value);
					self.setTimeout('require([ "djs/ClosingBlock.min" ], function(ClosingBlock) { ClosingBlock._tick("' + id + '", ' + timeout + '); });', timeout);
				} else { this.close(id); }
			}
		}
	};
});

//j// EOF