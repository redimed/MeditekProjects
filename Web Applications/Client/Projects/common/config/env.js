<<<<<<< HEAD
var env='testApp'; //local,meditekServer,testApp,app
=======
var env='local'; //local,meditekServer,testApp,app
>>>>>>> push fileDownload, update config

var configRestBaseUrl={
	'local':'http://localhost:3005',
	'meditekServer':'http://telehealthvietnam.com.vn:3005',
	'testApp':'http://testapp.redimed.com.au:3005',
	'app':'http://apps.redimed.com.au:3005',
};

<<<<<<< HEAD
if(env == "local")
=======
if(env=="local")
>>>>>>> push fileDownload, update config
{
	var _restBaseURL=configRestBaseUrl.local;
	var _fileBaseURL=configRestBaseUrl.local;
}
<<<<<<< HEAD
else if(env == 'meditekServer')
=======
else if(env=='meditekServer')
>>>>>>> push fileDownload, update config
{
	var _restBaseURL=configRestBaseUrl.meditekServer;
	var _fileBaseURL=configRestBaseUrl.meditekServer;
}
<<<<<<< HEAD
else if(env == 'testApp')
=======
else if(env=='testApp')
>>>>>>> push fileDownload, update config
{
	var _restBaseURL=configRestBaseUrl.testApp;
	var _fileBaseURL=configRestBaseUrl.testApp;
}
else if (env == 'testAppLocal')
{
	var _restBaseURL=configRestBaseUrl.local;
	var _fileBaseURL=configRestBaseUrl.local;
}
<<<<<<< HEAD
else if(env =='app')
=======
else if(env=='app')
>>>>>>> push fileDownload, update config
{
	var _restBaseURL=configRestBaseUrl.app;
	var _fileBaseURL=configRestBaseUrl.app;
}

