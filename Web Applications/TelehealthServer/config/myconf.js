var uuid = require('node-uuid');
module.exports.myconf = {
	//============ Twilio SMS Service Key=============
    twilioSID: 'AC7772e542a52ff56dcf0d13f95a99b154',
    twilioToken: '53f0c830cc61f052a5f238fd73f76321',
    twilioPhone: '+61439558227',
    //============ OpenTok Key =======================
    OpentokAPIKey: '45185002',
    OpentokAPISecret: 'b73a1fee03a4da8d01340986312b41e5126d89a5',
    //============ GCM Push Notification =============
    GCMApiKey: 'AIzaSyChaE4-AETpWum-4-TOoxM7HZg3NvaFL6I',
    //============ Token Secret ======================
    TokenSecret: 'ewfn09qu43f09qfj94qf*&H#(R',
    //============ Generate Random UUID ==============
    GenerateUUID: function(){
    	return uuid.v4();
    }
};