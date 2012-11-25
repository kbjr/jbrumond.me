
var consts  = require('consts');
var app     = require(consts.LIB_PATH + '/app');
var json    = require('json-output');

app.get('/contact', function(req, res) {
	res.render('contact');
});

app.post('/contact', function(req, res) {
	handleContactFormSubmission(req.body, function(err, validationErrors) {
		if (err) {
			return json.respondTo(res).error(err, 500);
		}
		res.render('contact', { });
	});
});

// ------------------------------------------------------------------

//app.io.sockets.on('connection', function(socket) {
//	socket.on('load', function(data) {
//		var view = data.href.slice(1);
//		app.render(view, { layout: false }, function(err, content) {
//			if (err) {
//				return socket.emit('error', json.error(err));
//			}
//			socket.emit('render', { content: content });
//		});
//	});
//});

// ------------------------------------------------------------------

function handleContactFormSubmission(data, callback) {
	
}

