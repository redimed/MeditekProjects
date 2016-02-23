var env='meditekServer'; //local,meditekServer,testApp,app


var configRestBaseUrl={
	//'local':'http://localhost:3005',
	 'local':'https://192.168.1.235:3005',
	'meditekServer':'http://telehealthvietnam:3005',
	'testApp':'https://testapp.redimed.com.au:3005',
	'app':'https://apps.redimed.com.au:3005'
};

var configAuthBaseUrl={
	'local':'http://localhost:3006',
	// 'local':'https://192.168.1.215:3006',
	'meditekServer':'https://telehealthvietnam.com.vn:3006',
	'testApp':'https://testapp.redimed.com.au:3006',
	'app':'https://apps.redimed.com.au:3006',
};

var configTelehealthBaseUrl = {
	'local':'http://localhost:3009',
	'meditekServer':'https://telehealthvietnam.com.vn:3009',
	'testApp':'https://testapp.redimed.com.au:3009',
	'app':'https://apps.redimed.com.au:3009',
};

var configNcBaseUrl={
	'local':'https://localhost:3016',
	'meditekServer':'http://telehealthvietnam.com.vn:3016',
	'testApp':'https://testapp.redimed.com.au:3016',
	'app':'https://apps.redimed.com.au:3016',
};

var configEFormUrl={
	'local':'https://localhost:3014',
	// 'local':'http://192.168.1.235:3005',
	'meditekServer':'https://localhost:3014',
	'testApp':'https://testapp.redimed.com.au:3005',
	'app':'https://apps.redimed.com.au:3005'
};

if(env == "local")
{
	var _restBaseURL=configRestBaseUrl.local;
	var _fileBaseURL=configRestBaseUrl.local;
	var _authBaseURL=configAuthBaseUrl.local;
	var _telehealthBaseURL=configTelehealthBaseUrl.local;
	var _eFormBaseURL=configEFormUrl.local;
	var _ncBaseURL=configNcBaseUrl.local;
}
else if(env == 'meditekServer')
{
	var _restBaseURL=configRestBaseUrl.meditekServer;
	var _fileBaseURL=configRestBaseUrl.meditekServer;
	var _authBaseURL=configAuthBaseUrl.meditekServer;
	var _telehealthBaseURL=configTelehealthBaseUrl.meditekServer;
	var _eFormBaseURL=configEFormUrl.meditekServer;
	var _ncBaseURL=configNcBaseUrl.meditekServer;
}
else if(env == 'testApp')
{
	var _restBaseURL=configRestBaseUrl.testApp;
	var _fileBaseURL=configRestBaseUrl.testApp;
	var _authBaseURL=configAuthBaseUrl.testApp;
	var _telehealthBaseURL=configTelehealthBaseUrl.testApp;
	var _eFormBaseURL=configEFormUrl.testApp;
	var _ncBaseURL=configNcBaseUrl.testApp;
}
else if (env == 'testAppLocal')
{
	var _restBaseURL=configRestBaseUrl.local;
	var _fileBaseURL=configRestBaseUrl.local;
	var _authBaseURL=configAuthBaseUrl.local;
	var _telehealthBaseURL=configTelehealthBaseUrl.local;
	var _eFormBaseURL=configEFormUrl.local;
	var _ncBaseURL=configNcBaseUrl.local;
}
else if(env =='app')
{
	var _restBaseURL=configRestBaseUrl.app;
	var _fileBaseURL=configRestBaseUrl.app;
	var _authBaseURL=configAuthBaseUrl.app;
	var _telehealthBaseURL=configTelehealthBaseUrl.app;
	var _ncBaseURL=configNcBaseUrl.app;
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