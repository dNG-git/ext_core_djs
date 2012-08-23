//j// BOF

/*n// NOTE
----------------------------------------------------------------------------
Extended direct JavaScript files
Our common functions based on JQuery
----------------------------------------------------------------------------
(C) direct Netware Group - All rights reserved
http://www.direct-netware.de/redirect.php?ext_djs

This work is distributed under the W3C (R) Software License, but without any
warranty; without even the implied warranty of merchantability or fitness
for a particular purpose.
----------------------------------------------------------------------------
http://www.direct-netware.de/redirect.php?licenses;w3c
----------------------------------------------------------------------------
#echo(djsVersion)#
djs/#echo(__FILEPATH__)#
----------------------------------------------------------------------------
NOTE_END //n*/

function djs_AJAX_insert_javascript (f_params)
{
	if (('data' in f_params)&&('id' in f_params))
	{
		jQuery("<script type='text/javascript'></script>").append(f_params.data).appendTo ("#" + f_params.id);
		if (('onInserted' in f_params)&&(f_params.onInserted !== null)) { djs_run (f_params.onInserted,f_params,false); }
	}
}

function djs_swgAJAX_parse_reply (f_params,f_data)
{
	var f_return = { content_hide:false,title:null,width:-1,width_max:-1,window_closeable:true,window_modal:true },f_content_hide = f_data.getElementsByTagName ('content_hide'),f_title = f_data.getElementsByTagName ('title'),f_width = f_data.getElementsByTagName ('width'),f_window_closeable = f_data.getElementsByTagName ('window_closeable'),f_window_modal = f_data.getElementsByTagName ('window_modal');

	if ((f_content_hide.length == 1)&&(f_content_hide[0].firstChild.nodeValue == '1')) { f_return.content_hide = true; }
	if (f_title.length == 1) { f_return.title = f_title[0].firstChild.nodeValue; }
	if (!('width_max' in f_params)) { f_return.width_max = jQuery(self).width (); }

	if (f_width.length == 1)
	{
		switch (f_width[0].firstChild.nodeValue)
		{
		case 's':
		{
			f_return.width = Math.round (f_return.width_max * 0.3);
			break;
		}
		case 'm':
		{
			f_return.width = Math.round (f_return.width_max * 0.55);
			break;
		}
		case 'l':
		{
			f_return.width = Math.round (f_return.width_max * 0.8);
			break;
		}
		default: { f_return.width = f_width[0].firstChild.nodeValue; }
		}
	}
	else if ('width' in f_params) { f_return.width = f_params.width; }
	else { f_return.width = Math.round (f_return.width_max * 0.8); }

	if ((f_window_closeable.length == 1)&&(f_window_closeable[0].firstChild.nodeValue == '0')) { f_return.window_closeable = false; }

	if ('modal' in f_params) { f_return.window_modal = f_params.modal; }
	else if ((f_window_modal.length == 1)&&(f_window_modal[0].firstChild.nodeValue == '0')) { f_return.window_modal = false; }

	return f_return;
}

//j// EOF