var config = sails.config.myconf;
//****Twilio Client for sending SMS
var twilioClient = require('twilio')(config.twilioSID, config.twilioToken);
//****Check and parse string to JSON object also lower case all object keys******
function toJson(str) {
    var obj;
    try {
        obj = JSON.parse(str);
    } catch (e) {
        obj = str;
    }
    var key, keys = Object.keys(obj);
    var n = keys.length;
    var newobj = {}
    while (n--) {
        key = keys[n];
        newobj[key.toLowerCase()] = obj[key];
    }
    return newobj;
};
//****Send SMS function******
function SendSMS(toNumber, content, callback) {
    twilioClient.messages.create({
        body: content,
        to: toNumber,
        from: config.twilioPhone
    }, callback());
};

module.exports = {
    Send: function(data, fn) {
        var phoneNumber = typeof data.phone != 'undefined' ? data.phone : null;
        var content = typeof data.content != 'undefined' ? data.content : null;
        var phoneRegex = /^\+[0-9]{9,15}$/;
        if (phoneNumber != null && phoneNumber.match(phoneRegex) && content != null) {
            SendSMS(phoneNumber, content, function(err, message) {
                if (err) {
                    console.log(err);
                    fn(err);
                }
                fn(null);
            });
        } else fn(err);
    }
};
