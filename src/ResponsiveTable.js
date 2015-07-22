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
 * @module ResponsiveTable
 */
define([ 'jquery', 'Modernizr' ], function($, Modernizr) {
	/**
	 * "ResponsiveTable" enables a HTML table to be responsive for layout changes.
	 *
	 * @class ResponsiveTable
	 * @param {Object} args Arguments to initialize a given ResponsiveTable
	 */
	function ResponsiveTable(args) {
		if (args === undefined || (!('id' in args))) {
			throw new Error('Missing required argument');
		}

		this.$responsive_table = null;
		this.responsive_table_class = null;

		// TODO: Rename "display-table" to "displaytable" if that's available
		if ('display-table' in Modernizr && Modernizr['display-table']) {
			this.$responsive_table = $("#" + args.id);

			if ('ResponsiveTable_class' in args) {
				this.responsive_table_class = args.ResponsiveTable_class;
			} else if (this.$responsive_table.data('djs-ui-responsivetable-class') != undefined) {
				this.responsive_table_class = this.$responsive_table.data('djs-ui-responsivetable-class');
			} else if ('djs_config' in self && 'ResponsiveTable_class' in self.djs_config) {
				this.responsive_table_class = self.djs_config.ResponsiveTable_class;
			} else {
				this.responsive_table_class = 'djs-ui-ResponsiveTable-class';
			}

			this.$responsive_table.addClass(this.responsive_table_class);

			if ('ResponsiveTable_style' in args) {
				this.$responsive_table.css(args.ResponsiveTable_style);
			}

			var $table_headers = this.$responsive_table.find('th');

			var headers = [ ];

			$table_headers.each(function(i) {
				headers.push($(this).text().replace(/\r|\n/, ''));
			});

			var $table_rows = this.$responsive_table.find('tbody > tr');

			for (var i = 0; i < headers.length; i++) {
				$table_rows.children('td:nth-child(' + (i + 1) + ')').attr('data-th', headers[i]);
			}
		}
	}

	/**
	 * Sets the CSS class to be added to the responsive table.
	 *
	 * @method
	 * @param {String} classname CSS class name
	 */
	ResponsiveTable.prototype.set_responsive_table_class = function(classname) {
		if (this.$responsive_table != null) {
			this.$responsive_table.removeClass(this.responsive_table_class).addClass(classname);
		}

		this.responsive_table_class = classname;
	}

	return ResponsiveTable;
});

//j// EOF