 var express = require('express');
 var http = require('http');
 var https = require('https'); 
 var path = require('path');
 var fs = require('fs-extra');


 var app = express();

//**SSL file and passphrase use for server
 var ssl_options = {
    pfx: fs.readFileSync('key/star_redimed_com_au.pfx'),
    passphrase: '1234'
}; 

// all environments
//app.set('env', 'developement');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.set('port', process.env.PORT || 3004); // set port
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('02fnvnwt43fgj93fqmkmmm'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'Projects')));
app.use('/Projects', express.static(__dirname + '/Projects'));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// https.createServer(ssl_options,app).listen(app.get('port'),function(){
// 	console.log('Express server listening on port ' + app.get('port'));
// })
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});