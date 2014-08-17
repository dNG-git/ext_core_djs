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

define([ 'jquery', 'djs/NodePosition.min', 'Hammer' ], function($, NodePosition, Hammer) {
	return {
		option_button_class: null,
		option_widget_class: null,

		option_button_init: function(args) {
			var _return = false;

			if ('id' in args) {
				if (this.option_button_class == null) {
					if ('djs_config' in self && 'uiX_option_button_class' in self.djs_config) { this.option_button_class = self.djs_config.uiX_option_button_class; }
					else { this.option_button_class = 'djs-ui-uiX-option-button'; }
				}

				if (this.option_widget_class == null) {
					if ('djs_config' in self && 'uiX_option_widget_class' in self.djs_config) { this.option_widget_class = self.djs_config.uiX_option_widget_class; }
					else { this.option_widget_class = 'djs-ui-uiX-option-widget'; }
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

				NodePosition._set_position($options, 'top center', $option_button, 'bottom center');

				var option_button_listener = new Hammer($option_button.get(0));

				$(self).on('resize', function() {
					if ($options.attr('display') != 'none') {
						NodePosition._set_position($options, 'top center', $option_button, 'bottom center');
					}
				});

				option_button_listener.on('tap', function() {
					NodePosition._set_position($options, 'top center', $option_button, 'bottom center');
					$options.toggle();
				});

				_return = true;
			}

			return _return;
		},

		set_option_button_class: function(classname) {
			this.option_button_class = classname;
		},

		set_option_widget_class: function(classname) {
			this.option_widget_class = classname;
		},

		show_link_if_js_supported: function(args) {
			var _return = false;

			if ('id' in args) {
				var $placeholder_node = $("#" + args.id);
				var url_href = $placeholder_node.data('href');
				var url_target = $placeholder_node.data('target');
				var url_class = $placeholder_node.data('class');
				var url_style = $placeholder_node.data('style');
				var $link_content = $placeholder_node.contents();

				$node = $('<a href="' + url_href + '" />');
				if (url_target != undefined) { $node.attr('target', url_target); }
				if (url_class != undefined) { $node.addClass(url_class); }
				if (url_style != undefined) { $node.attr('style', url_style); }

				$link_content.detach();
				$placeholder_node.replaceWith($node);
				$node.append($link_content);

				_return = true;
			}

			return _return;
		}
	};
});

//j// EOF