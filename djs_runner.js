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

function djs_run (f_params,f_perm_params,f_is_perm_params)
{
	if (('func' in f_params)&&('params' in f_params)&&(f_params.func in self))
	{
		if (f_perm_params !== undefined)
		{
			if (f_is_perm_params) { f_params.params['perm_params'] = f_perm_params; }
			else
			{
				if ('perm_params' in f_perm_params)
				{
					f_params.params['perm_params'] = f_perm_params.perm_params;
					f_perm_params = f_perm_params.perm_params;
				}
				else { f_perm_params = [ ]; }
			}

			for (var f_param in f_perm_params)
			{
				if (!(f_param in f_params.params)) { f_params.params[f_param] = f_perm_params[f_param]; }
			}
		}

		try { self[f_params.func] (f_params.params); }
		catch (f_unhandled_exception) { }
	}
}

//j// EOF