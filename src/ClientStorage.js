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
 * @module ClientStorage
 */
define(function() {
	/**
	 * Initialized storage instance in use.
	 */
	var _storage = null;

	/**
	 * "ClientStorage" instances provide easier access to localStorage of the
	 * client or fallback solutions.
	 *
	 * @class ClientStorage
	 *
	 * @param {object} args Arguments to initialize a given ClientStorage
	 */
	function ClientStorage(args) {
		if (args === undefined) {
			args = { };
		}

		if (_storage != null) {
			this._setup_instance();
		} else if ('localStorage' in self) {
			this._init();
		} else {
			var _this = this;

			require([ 'jquery' ], function($) {
				var deferred = $.Deferred();

				var promise = $.ajax({ cache: true,
				                       dataType: 'script',
				                       url: require.basePath + '/xhtml5/localStorage.min.js?swfURL=' + require.basePath + '/xhtml5/localStorage.swf'
				                     });

				promise.done(function() {
					if ('isLoaded' in self.localStorage) {
						self.localStorage.isLoaded(function() { deferred.resolve(); });
					} else {
						deferred.resolve();
					}
				});

				$.when(deferred, promise).then(function() {
					_this._init();
				});
			});
		}
	}

	/**
	 * Returns the number of keys stored.
	 *
	 * @method
	 *
	 * @return {number} Number of keys
	 */
	ClientStorage.prototype.count = function() {
		this._ensure_storage_instance();
		return _storage.length;
	}

	/**
	 * Checks that the storage object has been initialized.
	 *
	 * @method
	 */
	ClientStorage.prototype._ensure_storage_instance = function() {
		if (_storage == null) {
			throw new Error('Storage not initialized');
		}
	}

	/**
	 * w3.org: The method must return the current value associated with the given
	 * key.
	 *
	 * @method
	 *
	 * @param {string} key Key identifying the string value requested
	 *
	 * @return {string} Value associated with the given key; null if not defined
	 */
	ClientStorage.prototype.get = function(key) {
		this._ensure_storage_instance();
		return _storage.getItem(key);
	}

	/**
	 * Returns the one-dimensional object associated with the given key.
	 *
	 * @method
	 *
	 * @param {string} key Key identifying the one-dimensional object requested
	 *
	 * @return {object} Object associated with the given key; null if not defined
	 */
	ClientStorage.prototype.get_data = function(key) {
		var _return = null;

		if (this.get(key + ':object_proto') == '1') {
			_return = { };

			var data_keys = this.get(key + ':object_keys');

			if (data_keys == null) {
				throw new Error('Storage object keys not stored as required by protocol');
			}

			var data_key = null;
			var data_value = null;
			var data_keys_array = data_keys.split(' ');

			for (var i = 0; i < data_keys_array.length; i++) {
				data_key = data_keys_array[i];
				data_value = this.get(key + '[' + data_key + ']');
				_return[data_key] = data_value;
			}
		}

		return _return;
	}

	/**
	 * Initializes the storage instance to be used.
	 *
	 * @method
	 */
	ClientStorage.prototype._init = function() {
		_storage = self.localStorage;

		this._setup_instance();
	}

	/**
	 * Returns true if the storage has been initialized.
	 *
	 * @method
	 *
	 * @return {boolean} True if ready
	 */
	ClientStorage.prototype.is_ready = function() {
		return (_storage != null);
	}

	/**
	 * Returns true if the given key has been set.
	 *
	 * @method
	 *
	 * @return {boolean} True if set
	 */
	ClientStorage.prototype.is_set = function(key) {
		return (this.get(key) != null);
	}

	/**
	 * w3.org: The method must cause the key/value pair with the given key to be
	 * removed from the list associated with the object, if it exists.
	 *
	 * @method
	 *
	 * @param {string} key Key to be removed
	 */
	ClientStorage.prototype.remove = function(key) {
		this._ensure_storage_instance();
		_storage.removeItem(key);
	}

	/**
	 * Removes all data from the storage.
	 *
	 * @method
	 */
	ClientStorage.prototype.remove_all = function() {
		this._ensure_storage_instance();
		_storage.clear();
	}

	/**
	 * Removes all data of the one-dimensional object associated with the given
	 * key.
	 *
	 * @method
	 *
	 * @param {string} key Key identifying the one-dimensional object to be removed
	 */
	ClientStorage.prototype.remove_data = function(key) {
		if (this.is_set(key + ':object_proto')) {
			this.remove(key + ':object_proto');

			var data_keys = this.get(key + ':object_keys');

			if (data_keys != null) {
				var data_keys_array = data_keys.split(' ');

				for (var i = 0; i < data_keys_array.length; i++) {
					data_key = data_keys_array[i];
					this.remove(key + '[' + data_key + ']');
				}
			}

			this.remove(key + ':object_keys');
		}
	}

	/**
	 * The method sets the value associated with the given key.
	 *
	 * @method
	 *
	 * @param {string} key Key identifying the value
	 * @param {string} value String value
	 */
	ClientStorage.prototype.set = function(key, value) {
		var _return = true;

		this._ensure_storage_instance();

		try {
			_storage.setItem(key, value);
		} catch (handled_exception) {
			_return = false;
		}

		return _return;
	}

	/**
	 * Sets data of the one-dimensional object associated with the given key.
	 *
	 * @method
	 *
	 * @param {string} key Key identifying the one-dimensional object
	 * @param {object} data One-dimensional object
	 */
	ClientStorage.prototype.set_data = function(key, data) {
		var is_saved = this.set(key + ':object_proto', '1');

		var data_keys = [ ];
		var _this = this;

		$.each(data, function(data_key, data_value) {
			if (typeof data_value != 'string') {
				is_saved = false;
				return false;
			}

			if (!(is_saved && _this.set(key + '[' + data_key + ']', data_value))) {
				is_saved = false;
				return false;
			}

			data_keys.push(data_key);
		});

		if (!this.set(key + ':object_keys', data_keys.join(' '))) {
			is_saved = false;
		}

		if (!(is_saved)) {
			this.remove_data(key);
			throw new Error('Storage reported an error while saving data');
		}
	}

	/**
	 * Sets up data for this ClientStorage instance.
	 *
	 * @method
	 */
	ClientStorage.prototype._setup_instance = function() { }

	return ClientStorage;
});

//j// EOF