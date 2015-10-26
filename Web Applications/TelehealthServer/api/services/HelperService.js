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
    }
}