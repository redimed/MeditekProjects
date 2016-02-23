var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');

var ssl_options = {
        key: fs.readFileSync('key/star_redimed_com_au.key'),
        cert: fs.readFileSync('key/star_redimed_com_au.pem')
};

var compress = require('compression');
app.use(compress({
	threshold : 0, // or whatever you want the lower threshold to be
	 filter    : function(req, res) {
	    var ct = res.get('content-type');
	    return true;
	 }
}));

app.set('view engine', 'ejs');
app.use('/client', express.static(__dirname + '/client'));
app.use('/metronic', express.static(__dirname + '/metronic'));

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/client/favicon.ico'));

app.get('/', function(req, res){
	res.render('index.ejs');
});

https.createServer(ssl_options, app).listen('3014', function() {
        console.log('Express server listening on port https 3014');
});