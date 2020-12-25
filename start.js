
const { fileServer } = require('@celeri/static');
const { createServer } = require('@celeri/http-server');
const { queryParser } = require('@celeri/query-parser');
const { requestLogger } = require('@celeri/request-logger');
const { random_buffer } = require('./rand');

const host_placeholder = /\{\{host}}/g;

const host = '0.0.0.0';
const port = process.env.PORT || 8080;
const hostname_base = process.env.NODE_ENV === 'dev' ? 'localhost:8080' : 'jbrumond.me';

const server = createServer();

const static_www = fileServer(__dirname + '/www', {
	beforeSend: process_html
});

const static_watl = fileServer(__dirname + '/watl', {
	beforeSend: process_html
});

const static_asset = fileServer(__dirname + '/asset');

server.use(requestLogger({
	log(message, req, res, duration, finished) {
		console.log(
			JSON.stringify({
				message: 'Inbound HTTP request',
				method: req.method,
				host: req.headers['host'],
				path: req.pathname,
				status: finished ? res.statusCode : null,
				duration,
				finished
			})
		);
	}
}));

server.use(server.router({
	notFound: serve_static_files
}));

server
	.get('/~scripts/random')
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
	console.log(JSON.stringify({
		message: `Listening for HTTP traffic at ${host}:${port}...`,
		host, port
	}));
});

function process_html(file) {
	if (file.basename === 'index.html') {
		file.content = Buffer.from(file.content.toString('utf8').replace(host_placeholder, hostname_base), 'utf8');
	}
}

function serve_static_files({ req, res }) {
	const host = req.headers['host'].toLowerCase();

	switch (host) {
		case hostname_base:
		case `www.${hostname_base}`:
			return static_www({ req, res });

		case `watl.${hostname_base}`:
			return static_watl({ req, res });

		case `asset.${hostname_base}`:
			return static_asset({ req, res });

		default:
			res.writeHead(404, { 'content-type': 'text/plain' });
			res.end(`Unknown subdomain ${host}`);
	}
}
