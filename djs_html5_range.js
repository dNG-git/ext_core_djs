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

var djs_html5_range_ready = false;

function djs_html5_range (f_params)
{
	var f_jquery_check,f_jquery_objects = (((f_params !== undefined)&&('id' in f_params)) ? jQuery ("#" + f_params.id) : jQuery('input[type="range"]').filter (':visible'));

	if ((f_jquery_objects.length < 1)||('stepUp' in (f_jquery_objects.get (0)))) { f_jquery_check = false; }
	else
	{
		f_jquery_check = false;

		if (djs_html5_range_ready === false)
		{
			djs_html5_range_ready = f_jquery_objects;
			var f_path = '';

			if (('djs_var' in self)&&('base_path' in djs_var)) { f_path = djs_var.base_path + '/'; }

jQuery.when (
	jQuery.ajax ({ cache:true,dataType:'script',url:f_path + "ext_jquery/jquery.ui.core.min.js" }),
	jQuery.ajax ({ cache:true,dataType:'script',url:f_path + "ext_jquery/jquery.ui.mouse.min.js" }),
	jQuery.ajax ({ cache:true,dataType:'script',url:f_path + "ext_jquery/jquery.ui.widget.min.js" })
).done (function () { jQuery.ajax({ cache:true,dataType:'script',url:f_path + "ext_jquery/jquery.ui.slider.min.js" }).done (djs_html5_range_replace); });
		}
		else if (typeof (djs_html5_range_ready) == 'boolean') { f_jquery_check = true; }
		else { djs_html5_range_ready = djs_html5_range_ready.add (f_jquery_objects); }
	}

	if (f_jquery_check) { djs_html5_range_replace (f_jquery_objects); }
}

function djs_html5_range_event_set (f_event) { jQuery("#djs_" + f_event.data.id + "_i").val ($(this).slider ('value')); }

function djs_html5_range_replace (f_jquery_objects)
{
	if (typeof (djs_html5_range_ready) != 'boolean')
	{
		f_jquery_objects = djs_html5_range_ready;
		djs_html5_range_ready = true;
	}

	var f_jquery_object,f_jquery_parent,f_range_id,f_range_value;

	f_jquery_objects.each (function ()
	{
		f_jquery_object = jQuery (this);
		f_jquery_parent = f_jquery_object.wrap("<div style='display:inline-block' />").parent().data ({ djsHtml5Replaced:true });

		f_range_id = f_jquery_object.attr ('id');

		if (f_range_id === undefined)
		{
			f_range_id = ("djsi" + (Math.random ())).replace (/\W/,'_');
			f_jquery_parent.attr ('id',f_range_id);
		}

		f_range_value = f_jquery_object.css ('width');
		f_jquery_parent.css ('width',((f_range_value === null) ? (f_jquery_object.width () + "px") : f_range_value));

		f_range_value = f_jquery_object.css ('height');
		f_jquery_parent.css ('height',((f_range_value === null) ? (f_jquery_object.height () + "px") : f_range_value));

		f_range_value = f_jquery_object.val ();
		var f_range_value_max = f_jquery_object.attr ('max'),f_range_value_min = f_jquery_object.attr ('min'),f_range_value_step = f_jquery_object.attr ('step');

		f_jquery_parent.append (f_jquery_object.clone(true).attr ({ id:"djs_" + f_range_id + "_i",type:'hidden' }));
		f_jquery_object.remove ();

		f_jquery_object = f_jquery_parent.slider ();
		if (f_range_value_max !== undefined) { f_jquery_object.slider ('option','max',(parseFloat (f_range_value_max))); }

		if (f_range_value_min !== undefined) { f_jquery_object.slider ('option','min',(parseFloat (f_range_value_min))); }
		else { f_range_value_min = 0; }

		if (f_range_value_step !== undefined) { f_jquery_object.slider ('option','step',(parseFloat (f_range_value_step))); }
		f_jquery_object.on('slidechange',{ id:f_range_id },djs_html5_range_event_set).slider ('value',((f_range_value === undefined) ? f_range_value_min : (parseFloat (f_range_value))));
	});
}

function djs_html5_range_set (f_params)
{
	if (('id' in f_params)&&('value' in f_params))
	{
		if (djs_html5_range_ready === true) { jQuery("#" + f_params.id).slider ('value',f_params.value); }
		else { jQuery("#" + f_params.id).val (f_params.value); }
	}
}

//j// EOF