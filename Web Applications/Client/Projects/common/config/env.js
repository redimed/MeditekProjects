var env='meditekServer',socketAuth, socketRest, socketNc, socketTelehealth ={}; //local,meditekServer,testApp,app

var configRestBaseUrl={
<<<<<<< 80a8965f034d33abd38fdc18d0af5b17585f2bcb
	'local':'https://192.168.1.235:3005',
=======
	'local':'http://192.168.1.217:3005',
>>>>>>> update call
	'meditekServer':'https://meditek.redimed.com.au:3005',
	'testApp':'https://testapp.redimed.com.au:3005',
	'app':'https://apps.redimed.com.au:3005'
};

var configAuthBaseUrl={
<<<<<<< 80a8965f034d33abd38fdc18d0af5b17585f2bcb
	'local':'https://192.168.1.235:3006',
=======
	'local':'http://192.168.1.217:3006',
>>>>>>> update call
	'meditekServer':'https://meditek.redimed.com.au:3006',
	'testApp':'https://testapp.redimed.com.au:3006',
	'app':'https://apps.redimed.com.au:3006',
};

var configTelehealthBaseUrl = {
<<<<<<< 80a8965f034d33abd38fdc18d0af5b17585f2bcb
	'local':'https://192.168.1.235:3009',
=======
	'local':'http://192.168.1.217:3009',
>>>>>>> update call
	'meditekServer':'https://meditek.redimed.com.au:3009',
	'testApp':'https://testapp.redimed.com.au:3009',
	'app':'https://apps.redimed.com.au:3009',
};

var configNcBaseUrl={
<<<<<<< 80a8965f034d33abd38fdc18d0af5b17585f2bcb
	'local':'https://192.168.1.235:3016',
=======
	'local':'http://192.168.1.217:3016',
>>>>>>> update call
	'meditekServer':'https://meditek.redimed.com.au:3016',
	'testApp':'https://testapp.redimed.com.au:3016',
	'app':'https://apps.redimed.com.au:3016',
};

var configEFormUrl={
<<<<<<< 80a8965f034d33abd38fdc18d0af5b17585f2bcb
	'local':'https://192.168.1.235:3014',
=======
	'local':'http://192.168.1.217:3014',
>>>>>>> update call
	'meditekServer':'https://meditek.redimed.com.au:3014',
	'testApp':'https://testapp.redimed.com.au:3014',
	'app':'https://apps.redimed.com.au:3014'
};

var PDFFormUrl={
	'local':'https://192.168.1.173:3013',
	'meditekServer':'https://192.168.1.173:3013',
	'testApp':'https://192.168.1.173:3013',
	'app':'https://192.168.1.173:3013'
};

if(env == "local")
{
	var _restBaseURL=configRestBaseUrl.local;
	var _fileBaseURL=configRestBaseUrl.local;
	var _authBaseURL=configAuthBaseUrl.local;
	var _telehealthBaseURL=configTelehealthBaseUrl.local;
	var _eFormBaseURL=configEFormUrl.local;
	var _ncBaseURL=configNcBaseUrl.local;
	var _PDFFormUrl=PDFFormUrl.meditekServer;
}
else if(env == 'meditekServer')
{
	var _restBaseURL=configRestBaseUrl.meditekServer;
	var _fileBaseURL=configRestBaseUrl.meditekServer;
	var _authBaseURL=configAuthBaseUrl.meditekServer;
	var _telehealthBaseURL=configTelehealthBaseUrl.meditekServer;
	var _eFormBaseURL=configEFormUrl.meditekServer;
	var _PDFFormUrl=PDFFormUrl.meditekServer;
}
else if(env == 'testApp')
{
	var _restBaseURL=configRestBaseUrl.testApp;
	var _fileBaseURL=configRestBaseUrl.testApp;
	var _authBaseURL=configAuthBaseUrl.testApp;
	var _telehealthBaseURL=configTelehealthBaseUrl.testApp;
	var _eFormBaseURL=configEFormUrl.testApp;
	var _ncBaseURL=configNcBaseUrl.testApp;
	var _PDFFormUrl=PDFFormUrl.meditekServer;
}
else if (env == 'testAppLocal')
{
	var _restBaseURL=configRestBaseUrl.local;
	var _fileBaseURL=configRestBaseUrl.local;
	var _authBaseURL=configAuthBaseUrl.local;
	var _telehealthBaseURL=configTelehealthBaseUrl.local;
	var _eFormBaseURL=configEFormUrl.local;
	var _ncBaseURL=configNcBaseUrl.local;
	var _PDFFormUrl=PDFFormUrl.meditekServer;
}
else if(env =='app')
{
	var _restBaseURL=configRestBaseUrl.app;
	var _fileBaseURL=configRestBaseUrl.app;
	var _authBaseURL=configAuthBaseUrl.app;
	var _telehealthBaseURL=configTelehealthBaseUrl.app;
	var _ncBaseURL=configNcBaseUrl.app;
	var _PDFFormUrl=PDFFormUrl.meditekServer;

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
	,"blank.welcomeCampaign"
	,"blank.registerPatient"
	,"blank.searchPatient"
	,"blank.drawing.home"
];