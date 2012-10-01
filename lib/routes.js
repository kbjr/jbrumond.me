
/**
 * This script simply loads all of the files in the ./routes directory
 */

var fs    = require('fs');
var path  = require('path');

var routes = path.join(__dirname, '../routes');

fs.readdirSync(routes).forEach(function(routeFile) {
	require(path.join(routes, routeFile));
});

