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

var djs_html5_datetime_ready = false;
var djs_html5_datetime_time_format = null;

function djs_html5_datetime (f_params,f_jquery_objects,f_callbacks)
{
	if (djs_html5_datetime_time_format === null) { djs_html5_datetime_time_format = ((/\W(am|pm)/i.test ((new Date ()).toLocaleTimeString ())) ? 'g:i a' : 'H:i'); }
	if (f_jquery_objects === undefined) { f_jquery_objects = (((f_params !== undefined)&&('id' in f_params)) ? jQuery ("#" + f_params.id) : jQuery('input[type="date"],input[type="datetime"],input[type="datetime-local"],input[type="month"],input[type="time"]').filter (':visible')); }
	var f_continue_check;

	if ((f_jquery_objects.length < 1)||(('valueAsDate' in f_jquery_objects[0])&&('valueAsNumber' in f_jquery_objects[0])&&(!isNaN (f_jquery_objects[0].valueAsNumber))))
	{
		if ('onCompleted' in f_params) { f_callbacks = [ f_params.onCompleted ]; }
		f_continue_check = true;
	}
	else
	{
		f_continue_check = false;

		if (djs_html5_datetime_ready === false)
		{
			djs_html5_datetime_ready = { objects:f_jquery_objects,callbacks:[ ] };
			if ('onCompleted' in f_params) { djs_html5_datetime_ready.callbacks.push (f_params.onCompleted); }

			var f_path = '';
			if (('djs_var' in self)&&('base_path' in djs_var)) { f_path = djs_var.base_path + "/"; }

			var f_deferred = jQuery.when (
				jQuery.ajax ({ cache:true,dataType:'script',url:f_path + "ext_jquery/jquery.ui.core.min.js" }),
				jQuery.ajax ({ cache:true,dataType:'script',url:f_path + "ext_jquery/jquery.ui.widget.min.js" }),
				jQuery.ajax ({ cache:true,dataType:'script',url:f_path + "ext_jquery/jquery.ui.datepicker.min.js" })
			),f_done_function = (function ()
			{
				f_callbacks = djs_html5_datetime_ready.callbacks;
				f_jquery_objects = djs_html5_datetime_ready.objects;

				djs_html5_datetime_ready = true;
				djs_html5_datetime (f_params,f_jquery_objects,f_callbacks);
			});

			if ('datetime_lang' in f_params) { f_deferred.done (function () { jQuery.ajax({ cache:true,dataType:'script',url:f_path + "ext_jquery/jquery.ui.datepicker-" + f_params.datetime_lang + ".js" }).done (f_done_function); }); }
			else { f_deferred.done (f_done_function); }
		}
		else if (f_jquery_objects !== undefined)
		{
			var f_datetime_id,f_datetime_value,f_jquery_datetime,f_time_format = djs_html5_datetime_time_format;
			if ('time_format' in f_params) { f_time_format = f_params.time_format; }

			jQuery.each (f_jquery_objects,(function ()
			{
				f_jquery_datetime = jQuery (this);
				f_datetime_id = f_jquery_datetime.attr ('id');

				if (f_datetime_id === undefined)
				{
					f_datetime_id = ("djsi" + (Math.random ())).replace (/\W/,'_');
					f_jquery_datetime.attr ('id',f_datetime_id);
				}

				f_datetime_value = f_jquery_datetime.attr ('type');

				if (f_datetime_value == 'time') { djs_html5_time_replace ({ id:f_datetime_id,object:f_jquery_datetime,time_format:f_time_format }); }
				else { djs_html5_datetime_replace ({ id:f_datetime_id,object:f_jquery_datetime,time_format:f_time_format }); }
			}));

			if ((f_callbacks === undefined)&&('onCompleted' in f_params)) { f_callbacks = [ f_params.onCompleted ]; }
			f_continue_check = true;
		}
		else
		{
			if ('onCompleted' in f_params) { djs_html5_datetime_ready.callbacks.push (f_params.onCompleted); }
			djs_html5_datetime_ready.objects.concat (f_jquery_objects);
		}
	}

	if ((f_continue_check)&&(f_callbacks !== undefined)&&(f_callbacks.length > 0)) { jQuery.each (f_callbacks,(function () { djs_run (this); })); }
}

function djs_html5_datetime_event_set (f_event)
{
	if ((f_event.data.type == 't')||(f_event.data.type == 'tz'))
	{
		var f_date_object = jQuery("#" + f_event.data.id + "t").data ('timeObject'),f_jquery_object = jQuery("#djs_" + f_event.data.id + "_i"),f_tz_value = '';

		if (f_event.data.type == 'tz')
		{
			f_tz_value = f_date_object.getTimezoneOffset ();

			if (f_tz_value == 0) { f_tz_value = 'Z'; }
			else
			{
				var f_tz_hours = (f_tz_value / -60),f_tz_minutes;

				if (f_tz_hours > 0)
				{
					f_tz_minutes = (f_tz_value % -60);
					f_tz_value = ((f_tz_hours < 10) ? "+0" + f_tz_hours : "+" + f_tz_hours);
				}
				else
				{
					f_tz_minutes = (f_tz_value % 60);
					f_tz_value = ((f_tz_hours > -10) ? "-0" + (-1 * f_tz_hours) : f_tz_hours);
				}

				f_tz_value += ((f_tz_minutes < 10) ? ":0" + f_tz_minutes : ":" + f_tz_minutes);
			}
		}

		f_jquery_object.val (f_jquery_object.val().replace (/[ T].*?$/,'T') + (jQuery("#djs_" + f_event.data.id + "t_i").val ()) + f_tz_value);
	}
}

function djs_html5_datetime_replace (f_params)
{
	if (('id' in f_params)&&('object' in f_params))
	{
		var f_datetime_input,f_datetime_value,f_jquery_object,f_jquery_parent,f_time_object = null;

		f_jquery_parent = f_params.object.wrap("<div style='display:inline-block' />").parent ();
		f_jquery_parent.append (f_params.object.clone(true).attr ({ id:"djs_" + f_params.id + "_i",type:'hidden' }));

		f_datetime_input = f_params.object.attr ('type');
		f_datetime_value = f_params.object.attr ('value');

		f_params.object.remove ();
		f_jquery_object = f_jquery_parent.attr('id',f_params.id).data('djsHtml5Replaced',true).datepicker ({ altField:"#djs_" + f_params.id + "_i",changeMonth:true,changeYear:true,gotoCurrent:true });

		switch (f_datetime_input)
		{
		case 'date':
		{
			f_jquery_object.datepicker('option','altFormat','yy-mm-dd');
			var f_re_object = /^0*(\d+)\-0*(\d+)\-0*(\d+)$/.exec (f_datetime_value);
			if ((f_datetime_value !== undefined)&&(f_re_object !== null)) { f_jquery_object.datepicker ('setDate',(new Date (parseInt (f_re_object[1]),(parseInt (f_re_object[2]) - 1),(parseInt (f_re_object[3]))))); }

			break;
		}
		case 'datetime':
		{
			f_jquery_object.datepicker('option','altFormat','yy-mm-ddT').on ('change',{ id:f_params.id,type:'tz' },djs_html5_datetime_event_set);
			var f_re_object = /^0*(\d+)\-0*(\d+)\-0*(\d+)[ T](\d+):(\d+)(:\d+\.\d+|:\d+|)(Z|[\+-]\d+:\d+)$/.exec (f_datetime_value);

			if ((f_datetime_value !== undefined)&&(f_re_object !== null))
			{
				f_jquery_object.datepicker ('setDate',(new Date (parseInt (f_re_object[1]),(parseInt (f_re_object[2]) - 1),(parseInt (f_re_object[3])))));
				f_time_object = jQuery("<input id=\"" + f_params.id + "t\" type='time' value=\"" + f_re_object[4] + ":" + f_re_object[5] + f_re_object[6] + f_re_object[7] + "\" />").on ('change',{ id:f_params.id,type:'tz' },djs_html5_datetime_event_set);
			}

			break;
		}
		case 'datetime-local':
		{
			f_jquery_object.datepicker('option','altFormat','yy-mm-ddT').on ('change',{ id:f_params.id,type:'t' },djs_html5_datetime_event_set);
			var f_re_object = /^0*(\d+)\-0*(\d+)\-0*(\d+)[ T](\d+):(\d+)(:\d+\.\d+|:\d+|)$/.exec (f_datetime_value);

			if ((f_datetime_value !== undefined)&&(f_re_object !== null))
			{
				f_jquery_object.datepicker ('setDate',(new Date (parseInt (f_re_object[1]),(parseInt (f_re_object[2]) - 1),(parseInt (f_re_object[3])))));
				f_time_object = jQuery("<input id=\"" + f_params.id + "t\" type='time' value=\"" + f_re_object[4] + ":" + f_re_object[5] + f_re_object[6] + "\" />").on ('change',{ id:f_params.id,type:'t' },djs_html5_datetime_event_set);
			}

			break;
		}
		case 'month':
		{
			f_jquery_object.datepicker ('option','altFormat','yy-mm');
			var f_re_object = /^0*(\d+)\-0*(\d+)$/.exec (f_datetime_value);
			if ((f_datetime_value !== undefined)&&(f_re_object !== null)) { f_jquery_object.datepicker ('setDate',(new Date (parseInt (f_re_object[1]),(parseInt (f_re_object[2]) - 1),1))); }

			break;
		}
		}

		if (f_time_object !== null)
		{
			f_jquery_parent = f_jquery_parent.wrap("<div style='display:inline-block' />").parent ();
			f_jquery_parent.append('<br />').append('<br />').append (f_time_object);
			djs_html5_datetime ({ id:f_params.id + "t",time_format:f_params.time_format });
		}

		f_jquery_object.trigger ('change');
	}
}

function djs_html5_time_event_set (f_event)
{
	var f_date_object,f_jquery_object = jQuery("#" + f_event.data.id);
	f_date_object = f_jquery_object.data ('timeObject');

	switch (f_event.data.type)
	{
	case 'a':
	case 'h':
	{
		var f_hours = parseInt (jQuery("#djs_" + f_event.data.id + "_ih").val ());

		if (jQuery("#djs_" + f_event.data.id + "_ia").val () == 'pm') { f_hours += 12; }
		else if (f_hours > 11) { f_hours = 0; }

		f_date_object.setHours (f_hours);

		break;
	}
	case 'H':
	{
		f_date_object.setHours (parseInt (jQuery("#djs_" + f_event.data.id + "_iH").val ()));
		break;
	}
	case 'i':
	{
		f_date_object.setMinutes (parseInt (jQuery("#djs_" + f_event.data.id + "_ii").val ()));
		break;
	}
	}

	jQuery("#djs_" + f_event.data.id + "_i").val(djs_html5_time_get_formatted (f_date_object.getHours (),(f_date_object.getMinutes ()),(f_date_object.getSeconds ()),(f_date_object.getMilliseconds ()))).trigger ('change');
}

function djs_html5_time_get_formatted (f_hours,f_minutes,f_seconds,f_milliseconds)
{
	var f_return = "";

	if (f_hours < 10) { f_return += "0"; }
	f_return += f_hours + ":";
	if (f_minutes < 10) { f_return += "0"; }
	f_return += f_minutes + ":";
	if (f_seconds < 10) { f_return += "0"; }
	f_return += f_seconds + "." + f_milliseconds;

	return f_return;
}

function djs_html5_time_replace (f_params)
{
	if (('id' in f_params)&&('object' in f_params)&&('time_format' in f_params))
	{
		var f_date_object = new Date (),f_escaped_check = false,f_jquery_parent,f_pm_check = false,f_time_input,f_re_object,f_re_sub_object,f_time_options,f_time_value = f_params.object.val (),f_timezone_H_diff = 0,f_timezone_i_diff = 0;
		f_time_input = f_params.object.clone(true).attr ({ id:"djs_" + f_params.id + "_i",type:'hidden' });

		f_re_object = /^(\d+):(\d+)(:\d+\.\d+|:\d+|)(Z|[\+-]\d+:\d+)$/.exec (f_time_value);

		if (f_re_object === null) { f_re_object = /^(\d+):(\d+)(:\d+\.\d+|:\d+|)$/.exec (f_time_value); }
		else if (f_re_object[4] !== 'Z')
		{
			f_re_sub_object = /^([\+-])(\d+):(\d+)$/.exec (f_re_object[4]);

			if (f_re_sub_object !== null)
			{
				if (f_re_sub_object[1] == '+')
				{
					f_timezone_H_diff = parseInt (f_re_sub_object[2]);
					f_timezone_i_diff = parseInt (f_re_sub_object[3]);
				}
				else
				{
					f_timezone_H_diff -= parseInt (f_re_sub_object[2]);
					f_timezone_i_diff -= parseInt (f_re_sub_object[3]);
				}
			}
		}

		if (f_re_object !== null)
		{
			f_date_object.setHours (parseInt (f_re_object[1]) + f_timezone_H_diff);
			f_date_object.setMinutes (parseInt (f_re_object[2]) + f_timezone_i_diff);

			if (f_re_object[3] != '')
			{
				f_re_sub_object = /^:(\d+)\.(\d+)$/.exec (f_re_object[3]);

				if (f_re_sub_object === null) { f_date_object.setSeconds (parseInt (f_re_object[3].substring (1))); }
				else
				{
					f_date_object.setSeconds (parseInt (f_re_sub_object[1]));
					f_date_object.setMilliseconds (parseInt (f_re_sub_object[2]));
				}
			}
		}

		f_jquery_parent = f_params.object.wrap("<div class='ui-widget ui-widget-content ui-corner-all' style='display:inline-block' />").parent ();
		f_params.object.remove ();

		f_jquery_parent.append (f_time_input.val (djs_html5_time_get_formatted (f_date_object.getHours (),(f_date_object.getMinutes ()),(f_date_object.getSeconds ()),(f_date_object.getMilliseconds ()))));

		for (var f_i = 0;f_i < f_params.time_format.length;f_i++)
		{
			if (f_escaped_check)
			{
				f_escaped_check = false;
				f_jquery_parent.append (self.document.createTextNode (f_params.time_format[f_i]));
			}
			else if (f_params.time_format[f_i] == '\\') { f_escaped_check = true; }
			else if ((f_params.time_format[f_i] == 'G')||(f_params.time_format[f_i] == 'H'))
			{
				f_time_value = f_date_object.getHours ();
				if (f_time_value < 12) { f_time_value = "0" + f_time_value; }

				f_time_options = ' 00  01  02  03  04  05  06  07  08  09  10  11  12  13  14  15  16  17  18  19  20  21  22  23 ';
				f_time_options = f_time_options.replace (new RegExp (" (" + f_time_value + ") "),"\n<option value='$1' selected='selected'>$1</option>");
				f_time_options = f_time_options.replace (/ (\d+) /g,"\n<option value='$1'>$1</option>");

				f_jquery_parent.append (jQuery("<select id='djs_" + f_params.id + "_iH' size='1'>" + f_time_options + "\n</select>").on ('change',{ id:f_params.id,type:'H' },djs_html5_time_event_set));
			}
			else if ((f_params.time_format[f_i] == 'g')||(f_params.time_format[f_i] == 'h'))
			{
				f_time_value = f_date_object.getHours ();

				if (f_time_value > 12)
				{
					f_time_value -= 12;
					f_pm_check = true;
				}
				else if (f_time_value == 12) { f_pm_check = true; }
				else if (!f_time_value) { f_time_value = 12; }

				if (f_time_value < 12) { f_time_value = "0" + f_time_value; }

				f_time_options = ' 12  01  02  03  04  05  06  07  08  09  10  11 ';
				f_time_options = f_time_options.replace (new RegExp (" (" + f_time_value + ") "),"\n<option value='$1' selected='selected'>$1</option>");
				f_time_options = f_time_options.replace (/ (\d+) /g,"\n<option value='$1'>$1</option>");

				f_jquery_parent.append (jQuery("<select id='djs_" + f_params.id + "_ih' size='1'>" + f_time_options + "\n</select>").on ('change',{ id:f_params.id,type:'h' },djs_html5_time_event_set));
			}
			else if ((f_params.time_format[f_i] == 'a')||(f_params.time_format[f_i] == 'A')) { f_jquery_parent.append (jQuery("<select id='djs_" + f_params.id + "_ia' size='1'>\n" + (f_pm_check ? "<option value='am'>am</option>\n<option value='pm' selected='selected'>pm</option>" : "<option value='am' selected='selected'>am</option>\n<option value='pm'>pm</option>") + "\n</select>").on ('change',{ id:f_params.id,type:'a' },djs_html5_time_event_set)); }
			else if (f_params.time_format[f_i] == 'i')
			{
				f_time_value = f_date_object.getMinutes ();
				if (f_time_value < 12) { f_time_value = "0" + f_time_value; }

				f_time_options = ' 00  01  02  03  04  05  06  07  08  09 ';
				for (var f_minute = 10;f_minute < 60;f_minute++) { f_time_options += " " + f_minute + " "; }

				f_time_options = f_time_options.replace (new RegExp (" (" + f_time_value + ") "),"\n<option value='$1' selected='selected'>$1</option>");
				f_time_options = f_time_options.replace (/ (\d+) /g,"\n<option value='$1'>$1</option>");

				f_jquery_parent.append (jQuery("<select id='djs_" + f_params.id + "_ii' size='1'>" + f_time_options + "\n</select>").on ('change',{ id:f_params.id,type:'i' },djs_html5_time_event_set));
			}
			else { f_jquery_parent.append (self.document.createTextNode (f_params.time_format[f_i])); }
		}

		f_jquery_parent.attr('id',f_params.id).data ({ djsHtml5Replaced:true,timeObject:f_date_object });
	}
}

//j// EOF