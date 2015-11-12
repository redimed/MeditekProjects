var fs = require('fs');
function checkData(value) {
    var result = true;
    if (value === undefined || value === null || value === '') {
        result = false;
    } else if (_.isObject(value) && _.isEmpty(value)) {
        result = false;
    }
    return result;
}
module.exports = {
    const: {
        systemType: {
            ios: 'IOS',
            website: 'WEB',
            android: 'ARD'
        },
        roles: {
            admin: 'ADMIN',
            assistant: 'ASSISTANT',
            internalPractitioner: 'INTERNAL_PRACTITIONER', //DOCTOR
            externalPractitioner: 'EXTERTAL_PRACTITIONER', //GP
            patient: 'PATIENT',
        },
        fileType: {
            image: 'MedicalImage',
            document: 'MedicalDocument',
            avatar: 'ProfileImage',
            signature: 'Signature'
        },
        imageExt: ['jpg', 'png', 'gif', 'webp', 'tif', 'bmp', 'psd', 'jxr'],
        verificationCodeLength: 6,
        verificationTokenLength: 150,
        tokenExpired: 15, //seconds
        codeExpired: 3, //Số lần có thể nhập sai
    },
    toJson: function(str) {
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
    },
    isExpired: function(createdDate, seconds) {
        if (checkData(seconds)) {
            var date = moment(createdDate);
            var expiredDate = date.clone().add(seconds, 'seconds');
            var current = moment();
            if (current.isBefore(expiredDate)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    cleanObject: function(obj) {
        if (_.isObject(obj)) {
            for (var key in obj) {
                if (!checkData(obj[key])) {
                    delete obj[key];
                }
            }
        } else {
            obj = {};
        }
        return obj;
    }
}