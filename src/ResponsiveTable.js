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

define([ 'jquery', 'Modernizr' ], function($, Modernizr) {
	function ResponsiveTable(args) {
		this.responsive_table_class = null;

		// TODO: Rename "display-table" to "displaytable" if that's available
		if ('id' in args && 'display-table' in Modernizr && Modernizr['display-table']) {
			var $table = $("#" + args.id);

			if (this.responsive_table_class == null) {
				if ($table.data('djs-ResponsiveTable-class') != undefined) { this.responsive_table_class = $table.data('djs-ResponsiveTable-class'); }
				else if ('djs_config' in self && 'ResponsiveTable_class' in self.djs_config) { this.responsive_table_class = self.djs_config.ResponsiveTable_class; }
				else { this.responsive_table_class = 'djs-ui-ResponsiveTable-class'; }
			}

			$table.addClass(this.responsive_table_class);
			$table_headers = $table.find('th');

			var headers = [ ];

			$table_headers.each(function(i) {
				headers.push($(this).text().replace( /\r|\n/, ''));
			});

			$table_rows = $table.find('tr');

			for (var i = 0; i < headers.length; i++) {
				$table_rows.children('td:nth-child(' + (i + 1) + ')').attr('data-th', headers[i]);
			}
		}
	}

	ResponsiveTable.prototype.set_responsive_table_class = function(classname) {
		this.responsive_table_class = classname;
	}

	return ResponsiveTable;
});

//j// EOF