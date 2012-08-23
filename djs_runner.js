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
#echo(sWGcoreVersion)#
sWG/#echo(__FILEPATH__)#
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