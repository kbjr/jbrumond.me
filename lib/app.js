
require('exists-patch').patch();

var path     = require('path');
var http     = require('http');
var consts   = require('consts');
var express  = require('express');
var conf     = require('node-conf');
var socket   = require('socket.io');

consts.define('LIB_PATH',     __dirname);
consts.define('VIEW_PATH',    path.join(__dirname, '../views'));
consts.define('PUBLIC_PATH',  path.join(__dirname, '../public'));

var app     = module.exports         = express();
var server  = module.exports.server  = http.createServer(app);
var io      = module.exports.io      = socket.listen(server);

app.conf = conf.load(app.settings.env);

// ------------------------------------------------------------------

app.configure(function() {
	app.set('view engine', 'hbs');
	app.set('views', consts.VIEW_PATH);
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	if (app.conf.cors.enabled) {
		app.use(function(req, res, next) {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Credentials', true);
			res.header('Access-Control-Allow-Methods', app.conf.cors.methods.join(','));
			res.header('Access-Control-Allow-Headers', app.conf.cors.headers.join(','));

			next();
		});
	}
	app.use(express.logger());
	app.use(app.router);
});

app.configure('development', function() {
	app.use(express.static(consts.PUBLIC_PATH));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
	app.use(express.static(consts.PUBLIC_PATH, {maxAge: 31557600000}));
	app.use(express.errorHandler());
});

// ------------------------------------------------------------------

require('./render');
require('./routes');

// ------------------------------------------------------------------

var port = app.conf.core.port || process.env.PORT;

server.listen(port, function() {
	console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});

