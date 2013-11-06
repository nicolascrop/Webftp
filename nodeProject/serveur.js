var express = require('express');
var app = express();
 
app.use("/js", express.static(__dirname + '/app/js'));
app.use("/css", express.static(__dirname + '/app/css'));
app.use("/img", express.static(__dirname + '/app/img'));
app.use("/templates", express.static(__dirname + '/app/templates'));
app.use(express.bodyParser());

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('index.ejs');
}).post('/connect', function(req, res) {
	var Client = require('ftp');
	if (req.body.port == "")
		req.body.port = "21";
	var c = new Client();
	c.on('ready', function() {
		c.list(req.body.path, function(err, list) {
			try {
				if (err) 
					throw err;
	    		res.json(list);
				c.end();
			}
			catch(err)
			{
				res.json(err);
			}
		});
	}).on('error', function(err){
		res.json(err);
	});
	c.connect({host: req.body.host, port: req.body.port, user: req.body.login, password: req.body.password});
}).post('/getfile', function(req, res) {
	var Client = require('ftp');
	var fs = require('fs');
	if (req.body.port == "")
		req.body.port = "21";
	var c = new Client();
	c.on('ready', function() {
		c.get(req.body.file, function(err, stream) {
			try {
				if (err) 
					throw err;
				stream.once('close', function() {
				 c.end();
				});
				stream.pipe(res);
			}
			catch(err)
			{
				res.json(err);
			}
		});
	}).on('error', function(err){
		res.json(err);
	});
	c.connect({host: req.body.host, port: req.body.port, user: req.body.login, password: req.body.password});
}).use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

app.listen(8080);