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

define([ 'jquery', 'djs/NodePosition.min', 'Hammer' ], function($, NodePosition, Hammer) {
	function OptionButton(args) {
		this.option_button_class = null;
		this.option_widget_class = null;

		if ('id' in args) {
			if (this.option_button_class == null) {
				if ('djs_config' in self && 'OptionButton_class' in self.djs_config) { this.option_button_class = self.djs_config.OptionButton_class; }
				else { this.option_button_class = 'djs-ui-OptionButton'; }
			}

			if (this.option_widget_class == null) {
				if ('djs_config' in self && 'OptionButton_widget_class' in self.djs_config) { this.option_widget_class = self.djs_config.OptionButton_widget_class; }
				else { this.option_widget_class = 'djs-ui-OptionButton-widget'; }
			}

			var button_content = '≡';

			if ('button_content' in args) {
				button_content = args.button_content;
			}

			var $option_nav_node = $("#" + args.id);

			var $options = $option_nav_node.children('ul');
			$options.addClass(this.option_widget_class);
			$options.hide();

			var $option_button = $('<a href="javascript:">' + button_content + '</a>');
			$option_button.addClass(this.option_button_class);
			$options.before($option_button);

			var node_position = new NodePosition({ jQmy: $options, my_reference: 'top center', jQat: $option_button, at_reference: 'bottom center' });
			var option_button_listener = new Hammer($option_button.get(0));

			option_button_listener.on('tap', function() {
				node_position.reposition();
				$options.toggle();
			});
		}
	}

	OptionButton.prototype.set_option_button_class = function(classname) {
		this.option_button_class = classname;
	}

	OptionButton.prototype.set_option_widget_class = function(classname) {
		this.option_widget_class = classname;
	}

	return OptionButton;
});

//j// EOF