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
 * @module OverlayButton
 */
define([ 'jquery', 'Hammer', 'djt/NodePosition.min' ], function($, Hammer, NodePosition) {
    /**
     * "OverlayButton" creates a button to show content in a popup overlay.
     *
     * @class OverlayButton
     *
     * @param {object} args Arguments to initialize a given NodePosition
     */
    function OverlayButton(args) {
        if (args === undefined || (!('id' in args))) {
            throw new Error('Missing required argument');
        }

        this.$overlay_widget = $("#" + args.id);

        if ('OverlayButton_class' in args) {
            this.overlay_button_class = args.OverlayButton_class;
        } else if (this.$overlay_widget.data('djt-ui-overlaybutton-class') != undefined) {
            this.overlay_button_class = this.$overlay_widget.data('djt-ui-overlaybutton-class');
        } else if ('djt_config' in self && 'OverlayButton_class' in self.djt_config) {
            this.overlay_button_class = self.djt_config.OverlayButton_class;
        } else {
            this.overlay_button_class = 'djt-ui-overlaybutton';
        }

        if ('OverlayButton_widget_class' in args) {
            this.overlay_button_class = args.OverlayButton_widget_class;
        } else if (this.$overlay_widget.data('djt-ui-overlaybutton-widget-class') != undefined) {
            this.overlay_widget_class = this.$overlay_widget.data('djt-ui-overlaybutton-widget-class');
        } else if ('djt_config' in self && 'OverlayButton_widget_class' in self.djt_config) {
            this.overlay_widget_class = self.djt_config.OverlayButton_widget_class;
        } else {
            this.overlay_widget_class = 'djt-ui-overlaybutton-widget';
        }

        var button_content = (('button_content' in args) ? args.button_content : '≡');

        this.$overlay_widget.addClass(this.overlay_widget_class);

        if ('OverlayButton_widget_style' in args) {
            this.$overlay_widget.css(args.OverlayButton_widget_style);
        }

        this.$overlay_button = $('<a href="javascript:">' + button_content + '</a>');

        this.$overlay_button.addClass(this.overlay_button_class);

        if ('OverlayButton_style' in args) {
            this.$overlay_button.css(args.OverlayButton_style);
        }

        this.$overlay_widget.before(this.$overlay_button);
        this.$overlay_widget.hide();

        var node_position = new NodePosition({ jQmy: this.$overlay_widget, my_reference: 'top center', jQat: this.$overlay_button, at_reference: 'bottom center' });
        var _this = this;

        Hammer(this.$overlay_button.get(0)).on('tap', function() {
            node_position.reposition();
            _this.$overlay_widget.toggle();
        });
    }

    /**
     * Sets the CSS class to be added to the button.
     *
     * @method
     *
     * @param {string} classname CSS class name
     */
    OverlayButton.prototype.set_overlay_button_class = function(classname) {
        this.$overlay_button.removeClass(this.overlay_button_class).addClass(classname);
        this.overlay_button_class = classname;
    }

    /**
     * Sets the CSS class to be added to the overlay popup.
     *
     * @method
     *
     * @param {string} classname CSS class name
     */
    OverlayButton.prototype.set_overlay_widget_class = function(classname) {
        this.$overlay_widget.removeClass(this.overlay_widget_class).addClass(classname);
        this.overlay_widget_class = classname;
    }

    return OverlayButton;
});
