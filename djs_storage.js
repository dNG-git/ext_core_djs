//j// BOF

/*n// NOTE
----------------------------------------------------------------------------
secured WebGine
net-based application engine
----------------------------------------------------------------------------
(C) direct Netware Group - All rights reserved
http://www.direct-netware.de/redirect.php?swg

This work is distributed under the W3C (R) Software License, but without any
warranty; without even the implied warranty of merchantability or fitness
for a particular purpose.
----------------------------------------------------------------------------
http://www.direct-netware.de/redirect.php?licenses;w3c
----------------------------------------------------------------------------
#echo(sWGbasicVersion)#
sWG/#echo(__FILEPATH__)#
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

function djs_storage_get (f_key)
{
	if (djs_storage_handler != null) { return djs_storage_handler.getItem (f_key); }
	else { return null; }
}

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