
/**
 * This module modifies the res.render method to automatically merge
 * in some default local values when rendering templates.
 */

var app    = require('./app');
var merge  = require('merge-recursive');

var defaults = {
	env: {
		value: app.settings.env,
		is: {
			production: (app.settings.env === 'production'),
			development: (app.settings.env === 'development')
		}
	}
};

app._render = app.render;
app.render = function(view, options, fn) {
	options = options || { };
	if (typeof options === 'object') {
		options = merge.recursive({ }, defaults, options);
	}
	return this._render.call(this, view, options, fn);
};

