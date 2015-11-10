var env='meditekServer'; //local,meditekServer,testApp,app


var configRestBaseUrl={
	// 'local':'http://192.168.1.97:3000',
	'local':'http://192.168.1.235:3005',
	// 'local':'http://localhost:3005',
	'meditekServer':'http://telehealthvietnam.com.vn:3005',
	'testApp':'http://testapp.redimed.com.au:3005',
	'app':'http://apps.redimed.com.au:3005',
};


if(env == "local")
{
	var _restBaseURL=configRestBaseUrl.local;
	var _fileBaseURL=configRestBaseUrl.local;
}
else if(env == 'meditekServer')
{
	var _restBaseURL=configRestBaseUrl.meditekServer;
	var _fileBaseURL=configRestBaseUrl.meditekServer;
}
else if(env == 'testApp')
{
	var _restBaseURL=configRestBaseUrl.testApp;
	var _fileBaseURL=configRestBaseUrl.testApp;
}
else if (env == 'testAppLocal')
{
	var _restBaseURL=configRestBaseUrl.local;
	var _fileBaseURL=configRestBaseUrl.local;
}
else if(env =='app')
{
	var _restBaseURL=configRestBaseUrl.app;
	var _fileBaseURL=configRestBaseUrl.app;
}

