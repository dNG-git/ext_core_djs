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
 * @module HttpRequest
 */
define([ 'jquery' ], function($) {
	/**
	 * Object holding currently active request promises.
	 *
	 * @static
	 */
	var _requests = { };

	/**
	 * "HttpRequest" is based on a jQuery wrapped XmlHttpRequest AJAX class.
	 *
	 * @class HttpRequest
	 *
	 * @param {object} args Arguments to initialize a given HttpRequest
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
	 *
	 * @param {object} args Arguments to override default call parameter
	 *
	 * @return {object} jQuery AJAX promise
	 */
	HttpRequest.prototype.call = function(args) {
		var _return = null;

		if (args === undefined) {
			args = { };
		}

		var call_id = (('id' in args) ? args.id : this.id);

		if (call_id != null && call_id in _requests) {
			_return = _requests[call_id];
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
				_requests[call_id] = _return;
				var id = call_id;

				_return.always(function() {
					delete _requests[id];
				});
			}
		}

		return _return;
	}

	/**
	 * Parses the given query string and returns a key-value object.
	 *
	 * @method
	 *
	 * @param {string} query_string Query string to parse
	 * @param {string} argument_separator Argument separator (default is ';')
	 * @param {string} value_separator Key-value separator (default is '=')
	 *
	 * @return {object} Key-value query object
	 */
	HttpRequest.prototype.parse_query_string = function(query_string, argument_separator, value_separator) {
		if (argument_separator === undefined) {
			argument_separator = ';';
		}

		if (value_separator === undefined) {
			value_separator = '=';
		}

		var _return = { };

		var element_data = null;
		var element_key = null;
		var element_value = null;
		var field_arrays = { };
		var query_data = query_string.split(argument_separator);
		var re_array = /^(.+)\\[(\\S*)\\]$/;
		var re_result = null;

		$.each(query_data, function(i, element_string) {
			element_data = element_string.split(value_separator);

			element_key = element_data.shift();
			element_value = ((element_data.length > 1) ? element_data.join(value_separator) : element_data[0]);

			re_result = re_array.exec(element_key);

			if (re_result == null) {
				_return[element_key] = element_value;
			} else if (re_result[1] in field_arrays) {
				field_arrays[re_result[1]].append({ "key": re_result[2], "value": element_value });
			} else {
				field_arrays[re_result[1]] = [ { "key": re_result[2], "value": element_value } ];
			}
		});

		$.each(field_arrays, function(field_key, field_array) {
			var element_position = 0;

			if (field_key in _return) {
				field_array[field_key].unshift(_return[field_key]);
			}

			_return[field_key] = { };

			$.each(field_array, function(i, element) {
				if (element.key.length > 0) {
					_return[field_key][element.key] = element.value;
				} else {
					_return[field_key][element_position] = element.value;
					element_position += 1;
				}
			});
		});

		return _return;
	}

	/**
	 * Prepares the query string.
	 *
	 * @method
	 *
	 * @param {object} args Query string arguments
	 *
	 * @return {string} Prepared query string
	 */
	HttpRequest.prototype._prepare_query_string = function(args) {
		return ((typeof args == 'string') ? args : $.param(args));
	}

	/**
	 * Prepares and extends the given request arguments.
	 *
	 * @method
	 *
	 * @param {object} args Base arguments
	 *
	 * @return {object} Prepared and extended arguments
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