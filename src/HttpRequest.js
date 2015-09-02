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
 * @module HttpRequest
 */
define([ 'jquery' ], function($) {
	var requests = { };

	/**
	 * "HttpRequest" is based on a jQuery wrapped XmlHttpRequest AJAX class.
	 *
	 * @class HttpRequest
	 * @param {Object} args Arguments to initialize a given HttpRequest
	 */
	function HttpRequest(args) {
		if (args === undefined) {
			args = { };
		}

		this.id = null;
		this.url = null;

		if ('id' in args) {
			this.id = args.id;
		}

		if ('url' in args) {
			this.url = args.url;
		}
	}

	/**
	 * Calls the URL asynchronously by default.
	 *
	 * @method
	 * @param {Object} args Arguments to override default call parameter
	 * @return {Object} jQuery AJAX promise
	 */
	HttpRequest.prototype.call = function(args) {
		var _return = null;

		if (args === undefined) {
			args = { };
		}

		var call_id = (('id' in args) ? args.id : this.id);

		if (call_id != null && call_id in requests) {
			_return = requests[call_id];
		} else {
			args = this._prepare_request_args(args);

			if (this.url != null) {
				args = $.extend({ }, { url: this.url }, args);
			}

			if (!('url' in args)) {
				throw new Error('URL is not defined');
			}

			query_string = this._prepare_query_string(('data' in args) ? args['data'] : '');

			if (query_string.length > 0) {
				args['data'] = query_string;
			}

			_return = $.ajax(args);

			if (call_id != null) {
				requests[call_id] = _return;
				var id = call_id;

				_return.always(function() {
					delete requests[id];
				});
			}
		}

		return _return;
	}

	/**
	 * Prepares the query string.
	 *
	 * @method
	 * @param {Object} args Query string arguments
	 * @return {String} Prepared query string
	 */
	HttpRequest.prototype._prepare_query_string = function(args) {
		return ((typeof args == 'string') ? args : $.param(args));
	}

	/**
	 * Prepares and extends the given request arguments.
	 *
	 * @method
	 * @param {Object} args Base arguments
	 * @return {Object} Prepared and extended arguments
	 */
	HttpRequest.prototype._prepare_request_args = function(args) {
		return $.extend({ },
		                { method: 'GET',
		                  global: false
		                },
		                args
		               );
	}

	return HttpRequest;
});

//j// EOF