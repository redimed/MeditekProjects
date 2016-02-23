var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');

var ssl_options = {
        key: fs.readFileSync('../key/star_redimed_com_au.key'),
        cert: fs.readFileSync('../key/star_redimed_com_au.pem')
};

var compress = require('compression');
app.use(compress({
	threshold : 0, // or whatever you want the lower threshold to be
	 filter    : function(req, res) {
	    var ct = res.get('content-type');
	    return true;
	 }
}));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  	extended: true
}));

var cors = require('cors');
app.use(cors());

var models = require('./models');


/*var knex = require('knex')({
  	client: 'mysql',
  	connection: {
    	host     : '127.0.0.1',
    	user     : 'root',
    	password : '',
    	database : 'redimed'
  	}
});

app.post('/eform/create', function(req, res){
	knex('eform').insert({name: req.body.name, content:'[]'})
	.then(function(data){
		res.json({data: data})
	})
});

app.post('/eform/list', function(req, res){
	knex.select('*')
	.from('eform')
	.then(function(data){
		res.json({data: data})
	})
});

app.post('/eform/detail', function(req, res){
	knex.select('*')
	.from('eform')
	.where('id', req.body.id)
	.then(function(data){
		res.json({data: data})
	})
});

app.post('/eform/update', function(req, res){
	var formId = req.body.id;
	knex('eform')
	.where('id', formId)
	.update({
		name: req.body.name
	})
	.then(function(data){
		res.status(200).json({data: data})
	})
});

app.post('/eform/remove', function(req, res){
	var formId = req.body.id;
	knex('eform')
	.where('id', formId)
	.del()
	.then(function(data){
		res.status(200).json({data: data})
	})
});

app.post('/eform/save', function(req, res){
	var formId = req.body.id;
	knex('eform')
	.where('id', formId)
	.update({
		content: req.body.content
	})
	.then(function(data){
		res.status(200).json({data: data})
	})
});

app.post('/preEform/detail', function(req, res){
	knex.select('*')
	.from('eform_predata')
	.where('id', req.body.id)
	.then(function(data){
		res.json({data: data})
	})
});

app.post('/eformClient/save', function(req, res){
	knex('eform_client')
	.insert({
		formId: req.body.formId,
		appointmentId: req.body.appointmentId,
		formData: req.body.content
	})
	.then(function(data){
		res.json({data: data});
	})
});

app.post('/eformClient/update', function(req, res){
	knex('eform_client')
	.where('id', req.body.id)
	.update({
		formData: req.body.content
	})
	.then(function(data){
		res.json({data: data});
	})
});

app.post('/eformClient/list', function(req, res){
	knex('eform_client')
	.select('eform_client.id','eform_client.formId','eform_client.appointmentId','eform.name')
	.join('eform', 'eform_client.formId', 'eform.id')
	.then(function(data){
		res.json({data: data});
	})
});

app.post('/eformClient/remove', function(req, res){
	knex('eform_client')
	.where('id', req.body.id)
	.del()
	.then(function(data){
		res.json({data: data});
	})
});

app.post('/eformClient/detail', function(req, res){
	knex.select('*')
	.from('eform_client')
	.where('id', req.body.id)
	.then(function(data){
		res.json({data: data})
	})
});*/

var router = express.Router();
var eFormRoutes = require('./routes/eform')(router);
app.use('/', router);

https.createServer(ssl_options, app).listen('3015', function() {
        console.log('Express server listening on port https 3015');
});

models.sequelize.sync().then(function(){
	var server = app.listen(app.get('port'), function(){
		console.log('Listen on port ' + server.address().port);
	});
})