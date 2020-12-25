
const { Server } = require('node-static');
const { createServer } = require('@celeri/http-server');
const { queryParser } = require('@celeri/query-parser');
const { requestLogger } = require('@celeri/request-logger');
const { random_buffer } = require('./rand');

const server = createServer();
const static_www = new Server(__dirname + '/www');

const host = '0.0.0.0';
const port = process.env.PORT || 8080;

server.use(requestLogger({
	log(message, req, res, duration, finished) {
		console.log(
			JSON.stringify({
				message: 'Inbound HTTP request',
				method: req.method,
				path: req.pathname,
				status: finished ? res.statusCode : null,
				duration,
				finished
			})
		);
	}
}));

server.use(server.router({
	notFound: function notFoundHandler({ req, res }) {
		static_www.serve(req, res);
	}
}));

server
	.get('/random')
	.use(queryParser())
	.use(async ({ req, res }) => {
		if (! req.query.size) {
			res.writeHead(400, { 'content-type': 'text/plain' });
			res.end('expected query string parameter "size"');
			return;
		}

		const size = parseInt(req.query.size, 10);

		if (! size || size < 1 || size > 4096 || (size | 0) !== size) {
			res.writeHead(400, { 'content-type': 'text/plain' });
			res.end('expected parameter "size" to be an integer between 1 and 4096');
			return;
		}

		const data = await random_buffer(size);
		
		let encoded;

		switch (req.query.format) {
			case 'hex':
				encoded = data.toString('hex');
				break;

			case 'base64':
			default:
				encoded = data.toString('base64');
				break;
		}

		res.writeHead(200, { 'content-type': 'text/plain' });
		res.end(encoded);
	});

server.server.listen(port, host, () => {
	console.log(`Listening for HTTP traffic at ${host}:${port}...`);
});
