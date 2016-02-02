var config = sails.config.myconf;
//****Twilio Client for sending SMS
var twilioClient = require('twilio')(config.twilio.twilioSID, config.twilio.twilioToken);
//****Send SMS function******
var $q=require("q");
var o=require("./HelperService");

var SendSMS=function(phoneNumber,content)
{
    var error=new Error("SendSMS.Error");
    var q=$q.defer();
    try{
        if(!o.checkData(phoneNumber))
        {
            error.pushError("phoneNumber.notProvided");
            throw error;
        }
        if(!o.checkData(content))
        {
            error.pushError("content.notProvided");
            throw error;
        }
        var phoneRegex = /^\+[0-9]{9,15}$/;
        if(!phoneNumber.match(phoneRegex))
        {
            error.pushError("phoneNumber.invalidPattern");
            throw error;
        }

        twilioClient.messages.create({
            to: phoneNumber,
            body: content,
            from: config.twilio.twilioPhone
        }, function(err,responseData){
            if(err)
            {
                console.log(err);
                q.reject(err);
            }
            else
            {
                q.resolve(responseData);
            }   
        });

    }
    catch(e)
    {
        q.reject(e);
    }
    return q.promise;
};

/*SendSMS('+841265154373','hello tan')
.then(function(responseData){
    console.log(responseData);
},function(err){
    console.log(err);
})*/
module.exports = {
    SendSMS:SendSMS,
};
