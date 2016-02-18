var env='meditekServer'; //local,meditekServer,testApp,app


var configRestBaseUrl={
	'local':'https://localhost:3005',
	// 'local':'http://192.168.1.235:3005',
	'meditekServer':'http://telehealthvietnam.com.vn:3005',
	'testApp':'https://testapp.redimed.com.au:3005',
	'app':'https://apps.redimed.com.au:3005',
};

var configAuthBaseUrl={
	'local':'http://localhost:3006',
	// 'local':'https://192.168.1.215:3006',
	'meditekServer':'http://telehealthvietnam.com.vn:3006',
	'testApp':'https://testapp.redimed.com.au:3006',
	'app':'https://apps.redimed.com.au:3006',
};

var configTelehealthBaseUrl = {
	'local':'http://localhost:3009',
	'meditekServer':'http://telehealthvietnam.com.vn:3009',
	'testApp':'https://testapp.redimed.com.au:3009',
	'app':'https://apps.redimed.com.au:3009',
}


if(env == "local")
{
	var _restBaseURL=configRestBaseUrl.local;
	var _fileBaseURL=configRestBaseUrl.local;
	var _authBaseURL=configAuthBaseUrl.local;
	var _telehealthBaseURL=configTelehealthBaseUrl.local;
}
else if(env == 'meditekServer')
{
	var _restBaseURL=configRestBaseUrl.meditekServer;
	var _fileBaseURL=configRestBaseUrl.meditekServer;
	var _authBaseURL=configAuthBaseUrl.meditekServer;
	var _telehealthBaseURL=configTelehealthBaseUrl.meditekServer;
}
else if(env == 'testApp')
{
	var _restBaseURL=configRestBaseUrl.testApp;
	var _fileBaseURL=configRestBaseUrl.testApp;
	var _authBaseURL=configAuthBaseUrl.testApp;
	var _telehealthBaseURL=configTelehealthBaseUrl.testApp;
}
else if (env == 'testAppLocal')
{
	var _restBaseURL=configRestBaseUrl.local;
	var _fileBaseURL=configRestBaseUrl.local;
	var _authBaseURL=configAuthBaseUrl.local;
	var _telehealthBaseURL=configTelehealthBaseUrl.local;
}
else if(env =='app')
{
	var _restBaseURL=configRestBaseUrl.app;
	var _fileBaseURL=configRestBaseUrl.app;
	var _authBaseURL=configAuthBaseUrl.app;
	var _telehealthBaseURL=configTelehealthBaseUrl.app;
}


var _configStateBlank = [
	 "unAuthentication.login"
	,"unAuthentication.register"
	,"unAuthentication.activation"
	,"unAuthentication.forgot"
	,"unAuthentication.changepass"
	,"unAuthentication.loginPatient"
	,"unAuthentication.registerPatient"
	,"unAuthentication.searchPatient"
	,"blank.call"
	,"blank.welcome"
	,"blank.registerPatient"
	,"blank.searchPatient"
	,"blank.drawing.home"
];