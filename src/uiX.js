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
		show_link_if_js_supported: function(id) {
			var $PlaceholderNode = $("#" + id);
			var url_href = $PlaceholderNode.data('href');
			var url_target = $PlaceholderNode.data('target');
			var url_class = $PlaceholderNode.data('class');
			var url_style = $PlaceholderNode.data('style');
			var $LinkContent = $("#" + id).contents();

			$Node = $('<a href="' + url_href + '" />');
			if (url_target != undefined) { $Node.attr('target', url_target); }
			if (url_class != undefined) { $Node.addClass(url_class); }
			if (url_style != undefined) { $Node.attr('style', url_style); }

			$LinkContent.detach();
			$Node.append($LinkContent);

			$PlaceholderNode.replaceWith($Node);
		}
	};
});

//j// EOF