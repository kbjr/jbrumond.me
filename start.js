
const { Server } = require('node-static');
const { createServer } = require('@celeri/http-server');

const server = createServer();
const static_www = new Server(__dirname + '/www');

const host = '0.0.0.0';
const port = process.env.PORT || 8080;

server.use(server.router({
	notFound: function notFoundHandler({ req, res }) {
		static_www.serve(req, res);
	}
}));

server
	.get('/test')
	.use(({ req, res }) => {
		res.writeHead(200, { 'content-type': 'text/plain' });
		res.end('success');
	});

server.server.listen(port, host, () => {
	console.log(`Listening for HTTP traffic at ${host}:${port}...`);
});
