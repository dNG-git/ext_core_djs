//j// BOF

/*n// NOTE
----------------------------------------------------------------------------
Extended direct JavaScript files
Our common functions based on JQuery
----------------------------------------------------------------------------
(C) direct Netware Group - All rights reserved
http://www.direct-netware.de/redirect.php?ext_core_djs

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file, You can
obtain one at http://mozilla.org/MPL/2.0/.
----------------------------------------------------------------------------
http://www.direct-netware.de/redirect.php?licenses;mpl2
----------------------------------------------------------------------------
#echo(djsVersion)#
djs/#echo(__FILEPATH__)#
----------------------------------------------------------------------------
NOTE_END //n*/

var djs_storage_handler = null;

if (typeof (self.localStorage) == 'object') { djs_storage_handler = self.localStorage; }
if ((djs_storage_handler == null)&&(typeof (self.globalStorage) == 'object')) { djs_storage_handler = self.globalStorage[self.location.hostname]; }
if ((djs_storage_handler == null)&&(typeof (self.sessionStorage) == 'object')) { djs_storage_handler = self.sessionStorage; }

function djs_storage_delete (f_key) { return djs_storage_set (f_key,null); }

function djs_storage_delete_all ()
{
	var f_return = false;

	if (djs_storage_handler != null)
	{
		if (djs_storage_handler.length < 1) { f_return = true; }
		else
		{
			for (var f_i = 0;f_i < djs_storage_handler.length;f_i++) { djs_storage_delete (djs_storage_handler.key (f_i)); }
		}
	}

	return f_return;
}

function djs_storage_get (f_key) { return ((djs_storage_handler != null) ? djs_storage_handler.getItem (f_key) : null); }

function djs_storage_set (f_key,f_value)
{
	var f_return = null;

	if (djs_storage_handler != null)
	{
		if (f_value == null)
		{
			f_return = djs_storage_handler.getItem (f_key);
			if (f_return != null) { djs_storage_handler.removeItem (f_key); }
		}
		else if (typeof (f_value) == 'string')
		{
			djs_storage_handler.setItem (f_key,f_value);
			f_return = f_value;
		}
	}

	return f_return;
}

//j// EOF