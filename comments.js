// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var comments = [];

var server = http.createServer(function(req, res) {
	var parseUrl = url.parse(req.url, true);
	var pathName = parseUrl.pathname;
	if (pathName === '/') {
		pathName = '/index.html';
	}
	if (pathName === '/index.html') {
		fs.readFile(pathName, function(err, data) {
			if (err) {
				res.writeHead(404, {
					'Content-Type': 'text/html'
				});
				res.end('404 Not Found.');
			} else {
				res.writeHead(200, {
					'Content-Type': 'text/html'
				});
				res.end(data);
			}
		});
	} else if (pathName === '/comments') {
		if (req.method === 'GET') {
			var data = JSON.stringify(comments);
			res.writeHead(200, {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			});
			res.end(data);
		} else if (req.method === 'POST') {
			var str = '';
			req.on('data', function(chunk) {
				str += chunk;
			});
			req.on('end', function() {
				var comment = JSON.parse(str);
				comment.time = new Date();
				comments.push(comment);
				var data = JSON.stringify(comments);
				res.writeHead(200, {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				});
				res.end(data);
			});
		}
	} else {
		var filePath = path.resolve(__dirname + pathName);
		fs.readFile(filePath, function(err, data) {
			if (err) {
				res.writeHead(404, {
					'Content-Type': 'text/html'
				});
				res.end('404 Not Found.');
			} else {
				res.writeHead(200, {
					'Content-Type': 'text/html'
				});
				res.end(data);
			}
		});
	}
});

server.listen(8080, function() {
	console.log('Server is running at http://