
var consts  = require('consts');
var app     = require(consts.LIB_PATH + '/app');
var crypto  = require('crypto');
var yesNo   = require('yes-no');

app.get('/hashkey', function(req, res) {
	var str = String(Math.random()) + 'abc' + String(Math.random());
	var result = hash('sha1', str);
	var query = yesNo.parse(req.query || { });
	if (query.json) {
		res.json({hashkey: result});
	} else {
		res.header('content-type', 'text/plain');
		res.send(result);
	}
});

function hash(alg, str) {
	var hashsum = crypto.createHash(alg);
	hashsum.update(str);
	return hashsum.digest('hex');
}
