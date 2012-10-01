
var consts  = require('consts');
var app     = require(consts.LIB_PATH + '/app');
var json    = require('json-output');

app.get('/', function(req, res) {
	res.render('index');
});

// ------------------------------------------------------------------

app.io.sockets.on('connection', function(socket) {
	socket.on('load', function(data) {
		var view = data.href.slice(1);
		app.render(view, { layout: false }, function(err, content) {
			if (err) {
				return socket.emit('error', json.error(err));
			}
			socket.emit('render', { content: content });
		});
	});
});

