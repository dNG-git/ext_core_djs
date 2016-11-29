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
 * @module JsLink
 */
define([ 'jquery' ], function($) {
    /**
     * "JsLink" rewrites deactivated links if JavaScript is available.
     *
     * @class JsLink
     *
     * @param {object} args Arguments to initialize a given JsLink
     */
    function JsLink(args) {
        if (args === undefined || (!('id' in args))) {
            throw new Error('Missing required argument');
        }

        var $placeholder_node = $("#" + args.id);
        var url_href = $placeholder_node.data('href');
        var url_target = $placeholder_node.data('target');
        var url_class = $placeholder_node.data('class');
        var url_style = $placeholder_node.data('style');
        var $link_content = $placeholder_node.contents();

        $node = $('<a href="' + url_href + '" />');

        if (url_target != undefined) {
            $node.attr('target', url_target);
        }

        if (url_class != undefined) {
            $node.addClass(url_class);
        }

        if (url_style != undefined) {
            $node.attr('style', url_style);
        }

        $link_content.detach();
        $placeholder_node.replaceWith($node);
        $node.append($link_content);
    }

    return JsLink;
});
