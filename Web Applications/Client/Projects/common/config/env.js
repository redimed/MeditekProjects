var env='local';

var configRestBaseUrl={
	'local':'http://localhost:3005',
	'localServer':'http://telehealthvietnam.com.vn:3005',
	'testApp':'http://testapp.redimed.com.au:3005',
	'app':'http://apps.redimed.com.au:3005'
};

if(env="local")
{
	var _restBaseURL=configRestBaseUrl.local;
	var _uploadBase= configRestBaseUrl.testApp;
	var _enableFileBase=configRestBaseUrl.testApp;
	var _downloadFileBase=configRestBaseUrl.testApp;
}
else if(env='localServer')
{
	var _restBaseURL=configRestBaseUrl.localServer;
	var _uploadBase= configRestBaseUrl.testApp;
	var _enableFileBase=configRestBaseUrl.testApp;
	var _downloadFileBase=configRestBaseUrl.testApp;
}
else if(env='testApp')
{
	var _restBaseURL=configRestBaseUrl.testApp;
	var _uploadBase= configRestBaseUrl.testApp;
	var _enableFileBase=configRestBaseUrl.testApp;
	var _downloadFileBase=configRestBaseUrl.testApp;
}
else if(env='app')
{
	var _restBaseURL=configRestBaseUrl.app;
	var _uploadBase= configRestBaseUrl.testApp;
	var _enableFileBase=configRestBaseUrl.testApp;
	var _downloadFileBase=configRestBaseUrl.testApp;
}

