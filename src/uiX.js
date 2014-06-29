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
			var $placeholder_node = $("#" + id);
			var url_href = $placeholder_node.data('href');
			var url_target = $placeholder_node.data('target');
			var url_class = $placeholder_node.data('class');
			var url_style = $placeholder_node.data('style');
			var $link_content = $("#" + id).contents();

			$node = $('<a href="' + url_href + '" />');
			if (url_target != undefined) { $node.attr('target', url_target); }
			if (url_class != undefined) { $node.addClass(url_class); }
			if (url_style != undefined) { $node.attr('style', url_style); }

			$link_content.detach();
			$node.append($link_content);

			$placeholder_node.replaceWith($node);
		}
	};
});

//j// EOF