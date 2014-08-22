//j// BOF

/* -------------------------------------------------------------------------
direct PAS
Python Application Services
----------------------------------------------------------------------------
(C) direct Netware Group - All rights reserved
https://www.direct-netware.de/redirect?pas;http;js

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file, You can
obtain one at http://mozilla.org/MPL/2.0/.
----------------------------------------------------------------------------
https://www.direct-netware.de/redirect?licenses;mpl2
----------------------------------------------------------------------------
#echo(pasHttpJsVersion)#
#echo(__FILEPATH__)#
------------------------------------------------------------------------- */

define([ 'jquery' ], function($) {
	function Spinner(args) {
		this.segments = 12;
		this.$canvas = null;
		this.canvas_height = 0;
		this.canvas_width = 0;
		this.id = null;
		this.indeterminate = true;
		this.spinner_position = 0;
		this.value = 0;
		this.visible = false;

		if ('id' in args && 'width' in args && 'height' in args) {
			this.$canvas = $('<canvas id="' + args.id + '_djs_spinner_canvas" width="' + args.width + '" height="' + args.height + '" />');
			$("#" + args.id).append(this.$canvas);

			if (!('getContext' in this.$canvas.get(0))) { throw 'Canvas not supported'; }

			if ('css_class' in args) { this.$canvas.addClass(args.css_class); }
			if ('css_style' in args) { this.$canvas.css(args.css_style); }

			if ('value' in args) {
				this.indeterminate = false;
				this.set_value(args['value']);
			}

			this.$canvas.data('_djs_spinner', this);
		}
	}

	Spinner.prototype.get_value = function() {
		return this.value;
	}

	Spinner.prototype.set_segments = function(segments) {
		this.segments = segments;
	}

	Spinner.prototype.set_value = function(value) {
		this.value = value;
		if (this.visible) { this.$canvas.queue('fx', this._paint).dequeue(); }
	}

	Spinner.prototype.show = function() {
		this.$canvas.show();
		this.visible = true;

		this.canvas_height = this.$canvas.height();
		this.canvas_width = this.$canvas.width();

		this.$canvas.queue('fx', this._paint);
	}

	Spinner.prototype._paint = function(next) {
		var _this = $(this).data('_djs_spinner');

		var circle_radius = Math.round(Math.min(_this.canvas_width, _this.canvas_height) / 2);

		var circle_gap = Math.ceil(circle_radius / 4);
		var circle_x = Math.round(_this.canvas_width / 2);
		var circle_y = Math.round(_this.canvas_height / 2);
		var indicator_fade_percentage = (1 / _this.segments);
		var indicator_intensity = 1;
		var indicator_value = 0;
		var line_length = Math.round(circle_radius - (circle_gap / 2));
		var line_size = Math.round(circle_radius / _this.segments) + 1;

		if (_this.indeterminate) {
			if (_this.spinner_position > 0) { indicator_intensity -= (indicator_fade_percentage * _this.spinner_position); }
		} else {
			if (_this.value >= 0 && _this.value <= 100) { indicator_value = _this.value; }
			if ((indicator_value / 100) < indicator_fade_percentage) { indicator_intensity = 0.5; }
		}

		var ctx = _this.$canvas.get(0).getContext('2d');
		ctx.clearRect(0, 0, _this.canvas_width, _this.canvas_height);

		ctx.lineWidth = line_size;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		ctx.strokeStyle = 'rgba(0, 0, 0, ' + indicator_intensity + ')';

		var arc = ((2 * Math.PI) / _this.segments);
		var arc_position = 0;

		if (_this.indeterminate) {
			arc *= -1;
		} else {
			arc_position = (-0.5 * Math.PI) + (arc / 2);
		}

		for (var i = 0; i < _this.segments; i++) {
			x_end = circle_x + Math.round(Math.cos((arc * i) + arc_position) * line_length);
			y_end = circle_y + Math.round(Math.sin((arc * i) + arc_position) * line_length);
			x_start = circle_x + Math.round(Math.cos((arc * i) + arc_position) * circle_gap);
			y_start = circle_y + Math.round(Math.sin((arc * i) + arc_position) * circle_gap);

			ctx.beginPath();
			ctx.moveTo(x_start, y_start);
			ctx.lineTo(x_end, y_end);
			ctx.stroke();

			var segment = (1 + i + _this.spinner_position);

			if (_this.indeterminate) {
				if (segment < _this.segments) { indicator_intensity = 1 - (indicator_fade_percentage * (_this.spinner_position + i)); }
				else { indicator_intensity = 1 - (indicator_fade_percentage * ((i + _this.spinner_position) - _this.segments)); }

				ctx.strokeStyle = 'rgba(0, 0, 0, ' + indicator_intensity + ')';
			} else if (indicator_intensity > 0.5 && indicator_value < (((1 + segment) / _this.segments) * 100)) {
				indicator_intensity = 0.5;

				ctx.strokeStyle = 'rgba(0, 0, 0, ' + indicator_intensity + ')';
			}
		}

		if (_this.indeterminate) {
			_this.spinner_position += 1;
			if (_this.spinner_position >= _this.segments) { _this.spinner_position = 0; }

			_this.$canvas.delay(100).queue('fx', _this._paint);
			next();
		}
	}

	return Spinner;
});

//j// EOF