var env='localServer'; //local,meditekServer,testApp,app

var configRestBaseUrl={
	'local':'http://localhost:3005',
	'meditekServer':'http://telehealthvietnam.com.vn:3005',
	'testApp':'http://testapp.redimed.com.au:3005',
	'app':'http://apps.redimed.com.au:3005',
};

if(env="local")
{
	var _restBaseURL=configRestBaseUrl.local;
}
else if(env='meditekServer')
{
	var _restBaseURL=configRestBaseUrl.meditekServer;
	// var _uploadBase= configRestBaseUrl.meditekServer;
	// var _enableFileBase=configRestBaseUrl.meditekServer;
	// var _downloadFileBase=configRestBaseUrl.meditekServer;
}
else if(env='testApp')
{
	var _restBaseURL=configRestBaseUrl.testApp;
	// var _uploadBase= configRestBaseUrl.testApp;
	// var _enableFileBase=configRestBaseUrl.testApp;
	// var _downloadFileBase=configRestBaseUrl.testApp;
}
else if (env = 'testAppLocal')
{
	var _restBaseURL=configRestBaseUrl.local;
	// var _uploadBase= configRestBaseUrl.local;
	// var _enableFileBase=configRestBaseUrl.local;
	// var _downloadFileBase=configRestBaseUrl.local;
}
else if(env='app')
{
	var _restBaseURL=configRestBaseUrl.app;
	// var _uploadBase= configRestBaseUrl.testApp;
	// var _enableFileBase=configRestBaseUrl.testApp;
	// var _downloadFileBase=configRestBaseUrl.testApp;
}

