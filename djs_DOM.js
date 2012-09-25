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

function djs_DOM_insert (f_params)
{
	if (('data' in f_params)&&('id' in f_params)&&('insert_mode' in f_params))
	{
		if (('hide' in f_params)&&(f_params.hide)) { f_params['animate'] = false; }
		else if (!('animate' in f_params)) { f_params['animate'] = true; }

		var f_jquery_object = djs_DOM_insert_prepare (f_params.data,f_params.hide);
		if (f_params.id != f_params.id_inserted) { f_jquery_object.attr ('id',f_params.id_inserted); }

		switch (f_params.insert_mode)
		{
		case 'append':
		{
			jQuery("#" + f_params.id).append (f_jquery_object);
			break;
		}
		case 'before':
		{
			jQuery("#" + f_params.id).before (f_jquery_object);
			break;
		}
		case 'prepend':
		{
			jQuery("#" + f_params.id).prepend (f_jquery_object);
			break;
		}
		default: { jQuery("#" + f_params.id).after (f_jquery_object); }
		}

		if (('onInsert' in f_params)&&(f_params.onInsert !== null))
		{
			var f_perm_params = { };
			if ('perm_params' in f_params) { f_perm_params = f_params['perm_params']; }
			f_perm_params['data'] = f_params.data;

			djs_run (f_params.onInsert,{ perm_params:f_perm_params },false);
		}

		if ((f_params.animate)&&((!('hide' in f_params))||(!f_params.hide)))
		{
			if (('onInserted' in f_params)&&(f_params.onInserted !== null)) { f_jquery_object.fadeIn ('fast',function () { djs_run (f_params.onInserted,f_params,false); }); }
			else { f_jquery_object.fadeIn ('fast'); }
		}
		else if (('onInserted' in f_params)&&(f_params.onInserted !== null)) { djs_run (f_params.onInserted,f_params,false); }
	}
}

function djs_DOM_insert_after (f_params)
{
	f_params['insert_mode'] = 'after';
	djs_DOM_insert (f_params);
}

function djs_DOM_insert_append (f_params)
{
	f_params['insert_mode'] = 'append';
	djs_DOM_insert (f_params);
}

function djs_DOM_insert_before (f_params)
{
	f_params['insert_mode'] = 'before';
	djs_DOM_insert (f_params);
}

function djs_DOM_insert_prepare (f_data,f_hide)
{
	try
	{
		if ((typeof (f_data) != 'object')||('nodeName' in f_data)) { f_data = jQuery (f_data); }
		if ((f_hide === null)||(f_hide)) { f_data.hide (); }
	}
	catch (f_handled_exception) { f_data = jQuery (); }

	return f_data;
}

function djs_DOM_insert_prepend (f_params)
{
	f_params['insert_mode'] = 'prepend';
	djs_DOM_insert (f_params);
}

var djs_DOM_cache = { };

function djs_DOM_replace (f_params)
{
	if (('data' in f_params)&&('id' in f_params))
	{
		if (('hide' in f_params)&&(f_params.hide)) { f_params['animate'] = false; }
		else if (!('animate' in f_params)) { f_params['animate'] = true; }

		var f_jquery_object = djs_DOM_insert_prepare (f_params.data,f_params.animate).attr ('id',f_params.id);

		if (!('id_replaced' in f_params)) { f_params['id_replaced'] = f_params.id; }
		if (!('onReplace' in f_params)) { f_params['onReplace'] = null; }
		if (!('onReplaced' in f_params)) { f_params['onReplaced'] = null; }
		if (!('speed' in f_params)) { f_params['speed'] = 'fast'; }

		djs_DOM_cache[f_params.id] = { animate:f_params.animate,id:f_params.id_replaced,jquery_object:f_jquery_object,onReplace:f_params.onReplace,onReplaced:f_params.onReplaced,speed:f_params.speed };
		if ('perm_params' in f_params) { djs_DOM_cache[f_params.id]['perm_params'] = f_params.perm_params; }

		jQuery('body').append ("<div id='" + f_params.id_replaced + "phdiv' style='position:absolute;top:0px;left:0px;width:1px;height:" + (jQuery(self.document).height ()) + "px;z-index:-256'>&#0160;</div>");
		jQuery("#" + f_params.id).fadeOut (f_params.speed,djs_DOM_replace_with);
	}
}

function djs_DOM_replace_with ()
{
	var f_jquery_object = jQuery(this);
	var f_id = f_jquery_object.attr ('id');

	if (f_id in djs_DOM_cache)
	{
		var f_params = djs_DOM_cache[f_id];

		delete (djs_DOM_cache[f_id]);
		var f_id_new = f_params.id;

		f_jquery_object.replaceWith ((f_id == f_id_new) ? f_params.jquery_object : f_params.jquery_object.attr ('id',f_id_new));
		if (f_params.onReplace !== null) { djs_run (f_params.onReplace,f_params,false); }

		if ((f_params.animate)&&((!('hide' in f_params))||(!f_params.hide)))
		{
			if (f_params.onReplaced === null) { jQuery("#" + f_id_new).fadeIn (f_params.speed,function () { jQuery("#" + f_id_new + "phdiv").remove (); }); }
			else
			{
				jQuery("#" + f_id_new).fadeIn (f_params.speed,function ()
				{
					jQuery("#" + f_id_new + "phdiv").remove ();
					djs_run (f_params.onReplaced,f_params,false);
				});
			}
		}
		else
		{
			jQuery("#" + f_id_new + "phdiv").remove ();
			if (f_params.onReplaced !== null) { djs_run (f_params.onReplaced,f_params,false); }
		}
	}
	else { f_jquery_object.fadeIn ('fast'); }
}

//j// EOF