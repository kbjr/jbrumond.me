
/**
 * This module modifies the app.render method to automatically merge
 * in some default local values when rendering templates.
 *
 * It also defines all handlebars helpers.
 */

var hbs         = require('hbs');
var app         = require('./app');
var dateformat  = require('dateformat');
var merge       = require('merge-recursive');

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

// ------------------------------------------------------------------
	
hbs.registerHelper('now', function(format) {
	return dateformat(new Date(), format);
});

hbs.registerHelper('github', function(uri, content) {
	if (typeof content === 'function') {
		content = content();
	}
	return new hbs.handlebars.SafeString(
		'<a href="https://github.com/' + uri + '">' + content + '</a>'
	);
});

