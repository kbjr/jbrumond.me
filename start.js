
const { fileServer } = require('@celeri/static');
const { createServer } = require('@celeri/http-server');
const { queryParser } = require('@celeri/query-parser');
const { requestLogger } = require('@celeri/request-logger');
const { cacheControl } = require('@celeri/caching');
const { random_buffer } = require('./rand');
const { extname } = require('path');
const { Converter } = require('showdown');

const markdown_converter = new Converter({
	// 
});

const host_placeholder = /\{\{host}}/g;

// const host = '::';
const host = '0.0.0.0';
const port = process.env.PORT || 8080;
const hostname_base = process.env.NODE_ENV === 'dev' ? `localhost:${port}` : 'jbrumond.me';

const server = createServer();
const caching = cacheControl({ maxAge: 3600 });

const static_www = fileServer(__dirname + '/www', {
	beforeSend: process_html
});

const static_watl = fileServer(__dirname + '/watl', {
	beforeSend: process_html
});

const static_md = fileServer(__dirname + '/md', {
	beforeSend: markdown_to_html
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

const prod_hosts = new Set([
	hostname_base,
	`www.${hostname_base}`,
	`watl.${hostname_base}`,
	`asset.${hostname_base}`,
	`md.${hostname_base}`,
]);

server.use(({ req, res }) => {
	if (hostname_base.startsWith('localhost:')) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		return;
	}

	const host = get_host(req);

	if (prod_hosts.has(host)) {
		res.setHeader('Access-Control-Allow-Origin', `https://${host}`);
	}
});

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

function get_host(req) {
	if (! req.headers['host']) {
		return null;
	}

	return req.headers['host'].toLowerCase();
}

function process_html(file) {
	if (file.basename === 'index.html') {
		file.content = Buffer.from(file.content.toString('utf8').replace(host_placeholder, hostname_base), 'utf8');
	}
}

function markdown_to_html(file) {
	if (extname(file.basename) === '.md') {
		file.content = Buffer.from(markdown_converter.makeHtml(file.content.toString('utf8')), 'utf8');
		file.headers['content-type'] = 'text/html';
	}
}

function serve_static_files({ req, res }) {
	const host = get_host(req);

	caching({ req, res });

	switch (host) {
		case hostname_base:
		case `www.${hostname_base}`:
			return static_www({ req, res });

		case `watl.${hostname_base}`:
			return static_watl({ req, res });

		case `asset.${hostname_base}`:
			return static_asset({ req, res });

		case `md.${hostname_base}`:
			return static_md({ req, res });

		default:
			res.writeHead(404, { 'content-type': 'text/plain' });
			res.end(`Unknown subdomain ${host}`);
	}
}
