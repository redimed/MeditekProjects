 var express = require('express');
 var http = require('http');
 var path = require('path');


 var app = express();

// all environments
//app.set('env', 'developement');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.set('port', process.env.PORT || 8000); // set port
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


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});