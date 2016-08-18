var express = require('express');
var http = require('http');
var https = require('https');
var app = express();
var fs = require('fs');
var compress = require('compression');


var ssl_options = {
        key: fs.readFileSync('key/star_redimed_com_au.key'),
        cert: fs.readFileSync('key/star_redimed_com_au.pem')
};

app.use(compress({
    threshold : 0, // or whatever you want the lower threshold to be
     filter    : function(req, res) {
        var ct = res.get('content-type');
        return true;
     }
}));

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/themes/favicon.ico'));

app.use(express.static('public'));
app.use(express.static('themes'));

app.set('view engine', 'ejs');

var router = express.Router();
require('./routes')(router);
app.use('/', router);

// var server = http.createServer(app);

var port  = 3020;
// server.listen(port);

if (process.argv.indexOf("--nossl") >= 0) {
    console.log("============================== development");
    http.createServer(app).listen(port, function() {
        console.log('Express server listening on port http 3014');
    });
} else {
    console.log("============================== production");
    https.createServer(ssl_options, app).listen(port, function() {
        console.log('Express server listening on port https 3014');
    });
}