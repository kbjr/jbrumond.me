
var consts  = require('consts');
var app     = require(consts.LIB_PATH + '/app');
var json    = require('json-output');

var icons = [
	{
		href: 'http://facebook.com/jbrumond',
		image: 'facebook.png',
		title: 'Facebook'
	}, {
		href: 'http://www.linkedin.com/in/jbrumond',
		image: 'linkedin.png',
		title: 'LinkedIn'
	}, {
		href: 'https://plus.google.com/102388318696285803986',
		image: 'google-plus.png',
		title: 'Google Plus'
	}, {
		href: 'http://www.last.fm/user/kbjr',
		image: 'last-fm.png',
		title: 'Last.fm'
	}, {
		href: 'http://twitter.com/kbjr14',
		image: 'twitter.png',
		title: 'Twitter'
	}
];

app.get('/', function(req, res) {
	res.render('index', {icons: icons});
});

