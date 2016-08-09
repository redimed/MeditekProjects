var express = require('express');
var http = require('http');

var app = express();

var compress = require('compression');
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

var server = http.createServer(app);

var port  = 3020;
server.listen(port);

server.on('listening', function(){
    console.log('Listening on ' + port);
});