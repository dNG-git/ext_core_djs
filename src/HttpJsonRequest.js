//j// BOF

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
 * @module HttpJsonRequest
 */
define([ 'jquery', 'djt/HttpRequest.min' ], function($, _super) {
	/**
	 * "HttpJsonRequest" extends "HttpRequest" and expects JSON encoded responses.
	 *
	 * @class HttpJsonRequest
	 *
	 * @param {object} args Arguments to initialize a given HttpJsonRequest
	 */
	function HttpJsonRequest(args) {
		_super.call(this, args);
	}

	$.extend(HttpJsonRequest.prototype, _super.prototype);

	/**
	 * Prepares and extends the given request arguments.
	 *
	 * @method
	 *
	 * @param {object} args Base arguments
	 *
	 * @return {object} Prepared and extended arguments
	 */
	HttpJsonRequest.prototype._prepare_request_args = function(args) {
		var _return = _super.prototype._prepare_request_args.call(this, args);
		_return['dataType'] = 'json';
		return _return;
	}

	return HttpJsonRequest;
});

//j// EOF