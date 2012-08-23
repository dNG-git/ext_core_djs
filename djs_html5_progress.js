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

var djs_html5_progress_ready = false;

function djs_html5_progress (f_params)
{
	var f_return = null;

	if ((f_params !== undefined)&&('id' in f_params)) { var f_jquery_objects = jQuery("#" + f_params.id).toArray (); }
	else { f_jquery_objects = jQuery('progress').filter(':visible').toArray (); }

	var f_jquery_check;

	if ((f_jquery_objects.length < 1)||('value' in f_jquery_objects[0])) { f_jquery_check = false; }
	else
	{
		f_jquery_check = false;

		if (djs_html5_progress_ready === false)
		{
			djs_html5_progress_ready = f_jquery_objects;
			var f_path = '';

			if (('djs_var' in self)&&('base_path' in djs_var)) { f_path = djs_var.base_path + '/'; }

f_return = jQuery.when (
 jQuery.ajax ({ cache:true,dataType:'script',url:f_path + "ext_jquery/jquery.ui.core.min.js" }),
 jQuery.ajax ({ cache:true,dataType:'script',url:f_path + "ext_jquery/jquery.ui.widget.min.js" }),
 jQuery.ajax ({ cache:true,dataType:'script',url:f_path + "ext_jquery/jquery.ui.progressbar.min.js" })
).done(djs_html5_progress_replace).promise ();
		}
		else
		{
			if (typeof (djs_html5_progress_ready) == 'boolean') { f_jquery_check = true; }
			else { djs_html5_progress_ready.concat (f_jquery_objects); }
		}
	}

	if (f_jquery_check) { djs_html5_progress_replace (f_jquery_objects); }
	return f_return;
}

function djs_html5_progress_replace (f_jquery_objects)
{
	if (typeof (djs_html5_progress_ready) != 'boolean')
	{
		f_jquery_objects = djs_html5_progress_ready;
		djs_html5_progress_ready = true;
	}

	var f_jquery_parent,f_jquery_progressbar,f_progress_value;

	for (var f_i = 0;f_i < f_jquery_objects.length;++f_i)
	{
		f_jquery_progressbar = jQuery(f_jquery_objects[f_i]);
		f_jquery_parent = f_jquery_progressbar.wrap("<div style='display:inline-block' />").parent ();

		f_progress_value = f_jquery_progressbar.attr ('id');
		if (f_progress_value !== null) { f_jquery_parent.attr ('id',f_progress_value); }

		f_progress_value = f_jquery_progressbar.css ('width');

		if (f_progress_value === null) { f_jquery_parent.css ('width',f_progress_value); }
		else { f_jquery_parent.css ('width',(f_jquery_progressbar.width () + "px")); }

		f_progress_value = f_jquery_progressbar.css ('height');

		if (f_progress_value === null) { f_jquery_parent.css ('height',f_progress_value); }
		else { f_jquery_parent.css ('height',(f_jquery_progressbar.height () + "px")); }

		f_progress_value = f_jquery_progressbar.attr ('value');

		f_jquery_progressbar.remove ();

		if (f_progress_value === null) { f_jquery_parent.progressbar ({ value:0 }); }
		else { f_jquery_parent.progressbar ({ value:(parseInt (f_progress_value)) }); }
	}
}

function djs_html5_progress_set (f_params)
{
	if (('id' in f_params)&&('value' in f_params))
	{
		if (djs_html5_progress_ready === true) { jQuery("#" + f_params.id).progressbar ('value',f_params.value); }
		else { jQuery("#" + f_params.id).attr ('value',f_params.value); }
	}
}

//j// EOF