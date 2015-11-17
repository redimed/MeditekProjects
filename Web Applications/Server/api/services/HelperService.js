var crypto = require('crypto'),
    algorithm = 'aes-256-ctr';
var zlib = require('zlib');
var fs = require('fs');
var moment=require("moment");
var jwt = require('jsonwebtoken');
var md5 = require('md5');
/*
check data request
input: request from client
output: false: if data miss or parse failed
        data: if exist data and parse success
*/
/**
 * Kiem tra xem bien hop le hay khong 
 * 
 */
function checkData(value) {
    var result = true;
    if (value === undefined || value === null || value === '') {
        result = false;
    } else if (_.isObject(value) && _.isEmpty(value)) {
        result = false;
    }
    return result;
}
/**
 * Kiem tra danh sach data truyen vao hop le hay kkhong
 */
function checkListData() {
    var result = true;
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] === undefined || arguments[i] === null || arguments[i] === '') {
            result = false;
        } else if (_.isObject(arguments[i]) && _.isEmpty(arguments[i])) {
            result = false;
        }
        if (result === false) {
            console.log(">>>>>>>> Vi tri data truyen den bi loi:", i);
            break;
        }
    }
    return result;
}

function exlog() {
    console.log("\n\nBEGIN REDIMED LOG-------------------------------");
    for (var i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
    }
    console.log("END REDIMED LOG---------------------------------\n\n");
}

function exFileJSON(data, fileName) {
    var file = './temp/' + fileName;
    var obj = {
        name: 'JP'
    }
    jf.writeFile(file, data, function(err) {
        console.log(err);
    })
}
module.exports = {
    CheckPostRequest: function(request) {
        var data;
        if (!_.isUndefined(request) && !_.isUndefined(request.body) && !_.isUndefined(request.body.data)) {
            data = request.body.data;
            if (!_.isObject(data)) {
                try {
                    data = JSON.parse(data);
                } catch (err) {
                    console.log(err);
                    return false;
                }
            }
            return data;
        } else {
            return false;
        }
    },
    CheckExistData: function(data) {
        return (!_.isUndefined(data) && !_.isNull(data));
    },
    GetFullName: function(firstName, middleName, lastName) {
        return (!_.isNull(firstName) && !_.isUndefined(firstName) && !_.isEmpty(firstName)) ? firstName : '' + (!_.isNull(middleName) && !_.isUndefined(middleName) && !_.isEmpty(middleName)) ? ' ' + middleName : '' + (!_.isNull(lastName) && !_.isUndefined(lastName) && !_.isEmpty(lastName)) ? ' ' + lastName : '';
    },
    //define regex pattern
    regexPattern: {
        //emailPattern example :
        //  mysite@ourearth.com
        //  my.ownsite@ourearth.org
        //  mysite@you.me.net
        //reference from: http://www.w3resource.com/javascript/form/email-validation.php
        email:  /^\w+([a-zA-Z0-9\.-]?\w+)*@\w+([a-z][\.-]?\w+)*([a-z]\.\w{2,3})+$/,
        date: /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,
        //fullPhonePattern example:
        //  (+351) 282 43 50 50
        //  90191919908
        //  555-8909
        //  001 6867684
        //  001 6867684x1
        //  1 (234) 567-8901
        //  1-234-567-8901 x1234
        //  1-234-567-8901 ext1234
        //  1-234 567.89/01 ext.1234
        //  1(234)5678901x1234
        //  (123)8575973
        //  (0055)(123)8575973
        //reference from: http://stackoverflow.com/questions/14639973/javascript-regex-what-to-use-to-validate-a-phone-number
        //international phone number
        fullPhoneNumber: /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i,
        //autralian phone number
        auPhoneNumber: /^(\+61|0061|0)?4[0-9]{8}$/,
        //except (,),whitespace,- in phone number
        phoneExceptChars: /[\(\)\s\-]/g,
        //autralian home phone number
        auHomePhoneNumber: /^[1-9]{9}$/,

        //character
        character: /^[a-zA-Z\s0-9]{0,255}$/,

        //address
        address: /^[a-zA-Z0-9\s,'-\/]{0,255}$/,

        //postcode
        postcode: /^[0-9]{4}$/
    },
    checkData: checkData,
    checkListData: checkListData,
    const: {
        systemType: {
            ios: 'IOS',
            website: 'WEB',
            android: 'ARD'
        },

        //---------------------------------------------------------
        //---------------------------------------------------------
        //---------------------------------------------------------
        //---------------------------------------------------------
        //---------------------------------------------------------
        roles: {
            admin: 'ADMIN',
            assistant: 'ASSISTANT',
            internalPractitioner: 'INTERNAL_PRACTITIONER', //DOCTOR
            externalPractitioner: 'EXTERTAL_PRACTITIONER', //GP
            patient: 'PATIENT',
            clinicTelehealth: 'CLINIC_TELEHEALTH'
        },
        rolesValue:{
            'ADMIN':100,
            'ASSISTANT':90,
            'INTERNAL_PRACTITIONER':80,
            'EXTERTAL_PRACTITIONER':70,
            'PATIENT':60,
            'CLINIC_TELEHEALTH':50,
        },
        //---------------------------------------------------------
        //---------------------------------------------------------
        //---------------------------------------------------------
        //---------------------------------------------------------
        //---------------------------------------------------------

        authTokenExpired: {
            'IOS': 30 * 60,
            'ARD': 30 * 60,
            'WEB':1 * 60,
        },// second

        // authSecretExprired:{
        //     'IOS':null,
        //     'ARD':null,
        //     'WEB':2*60*60,
        // },// second

        userSecretExpiration:{
            'IOS':{
                'ADMIN':{
                    secretKeyExpired:null,
                    maxTimePlus:null
                },

                'ASSISTANT':{
                    secretKeyExpired:null,
                    maxTimePlus:null
                },

                'INTERNAL_PRACTITIONER':{
                    secretKeyExpired:null,
                    maxTimePlus:null
                },

                'EXTERTAL_PRACTITIONER':{
                    secretKeyExpired:null,
                    maxTimePlus:null
                },

                'PATIENT':{
                    secretKeyExpired:null,
                    maxTimePlus:null
                },

                'CLINIC_TELEHEALTH':{
                    secretKeyExpired:null,
                    maxTimePlus:null
                },

                'null':{
                    secretKeyExpired:null,
                    maxTimePlus:null
                }
            },

            'ARD':{
                'ADMIN':{
                    secretKeyExpired:null,
                    maxTimePlus:null
                },

                'ASSISTANT':{
                    secretKeyExpired:null,
                    maxTimePlus:null
                },

                'INTERNAL_PRACTITIONER':{
                    secretKeyExpired:null,
                    maxTimePlus:null
                },

                'EXTERTAL_PRACTITIONER':{
                    secretKeyExpired:null,
                    maxTimePlus:null
                },

                'PATIENT':{
                    secretKeyExpired:null,
                    maxTimePlus:null
                },

                'CLINIC_TELEHEALTH':{
                    secretKeyExpired:null,
                    maxTimePlus:null
                },
                'null':{
                    secretKeyExpired:null,
                    maxTimePlus:null
                }
            },


            'WEB':{
                'ADMIN':{
                    secretKeyExpired:2*60*60,
                    maxTimePlus:8*60*60
                },

                'ASSISTANT':{
                    secretKeyExpired:2*60*60,
                    maxTimePlus:8*60*60
                },

                'INTERNAL_PRACTITIONER':{
                    secretKeyExpired:2*60*60,
                    maxTimePlus:8*60*60
                },

                'EXTERTAL_PRACTITIONER':{
                    secretKeyExpired:20*60,
                    maxTimePlus:2*60*60
                },

                'PATIENT':{
                    secretKeyExpired:20*60,
                    maxTimePlus:2*60*60
                },

                'CLINIC_TELEHEALTH':{
                    secretKeyExpired:20*60,
                    maxTimePlus:2*60*60
                },
                'null':{
                    secretKeyExpired:20*60,
                    maxTimePlus:2*60*60
                }
            }
        },


        verificationMethod: {
            token: 'TOKEN',
            code: 'CODE'
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

        activationTokenExpired: 15, //seconds

        activationCodeExpired: 3, //Số lần có thể nhập sai

        refreshTokenStatus:{
            waitget:'WAITGET',
            got:'GOT',
        },

        oldRefreshCodeExpired:60,
    },

    getRoleList:function()
    {
        return _.values(this.const.roles);
    },

    getMaxRole:function(roles)
    {
        if(!_.isArray(roles) || _.isEmpty(roles))
        {
            return null;
        }
        var rolesValue=this.const.rolesValue;
        var maxRole=roles[0];
        _.forEach(roles,function(item){
            if(rolesValue[item.RoleCode]>rolesValue[maxRole.RoleCode])
                maxRole=item;
        })
        return maxRole.RoleCode;
    },

    getUserSecretExpiration:function(systemType,role)
    {
        if(role===null)
        {
            role='null';
        }
        if(!this.const.userSecretExpiration[systemType])
        {
            return null;
        }
        if(!this.const.userSecretExpiration[systemType][role])
        {
            return null;
        }
        return this.const.userSecretExpiration[systemType][role];
    },

    exlog: exlog,
    exFileJSON: exFileJSON,
    /**
     * copyAttrsValue: 
     * So sánh 2 object destination và source, nếu 2 object có attribute nào trùng nhau
     * thì copy giá trị attribute từ source vào destination
     */
    copyAttrsValue: function(destination, source) {
        if (_.isObject(destination)) {
            if (_.isObject(source) && !_.isEmpty(source)) {
                for (var key in destination) {
                    if (source[key]) {
                        destination[key] = source[key];
                    }
                }
            }
        } else {
            destination = {};
        }
        return destination;
    },
    /**
     * cleanObject: xóa những thuộc tính nào có giá trị là null, undefined, '' 
     * hoặc giá trị là object rỗng {}
     */
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
    },
    /**
     * rationalizeObject:
     * Hợp lệ hóa destination object bằng source object
     * Nếu destination có attributes mà source cũng có thì copy giá trị attributes từ source qua
     * Nếu destination có attributes mà source không có thì xóa attributes đó của destination
     */
    rationalizeObject: function(destination, source) {
        if (_.isObject(destination)) {
            if (_.isObject(source) && !_.isEmpty(source)) {
                for (var key in destination) {
                    if (!source.hasOwnProperty(key)) {
                        delete destination[key];
                    }
                }
            }
        } else {
            destination = {};
        }
        return destination;
    },

    /**
     * chuyển các thuộc tính của object thành mảng key_value
     * Ví dụ: {name:'abc',address:'vietnam'}==>[{name:'abc'},{address:'vietnam'}]
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    splitAttributesToObjects:function(obj)
    {
        var list=[];
        if(_.isObject(obj))
        {
            for(var key in obj)
            {
                var item={};
                item[key]=obj[key];
                list.push(item);
            }
        }
        return list;
    },


    /**
     * Kiểm tra các attributes của object có giá trị bằng một trong các giá trị trong mảng corrects
     * hay không
     */
    checkCorrectValues: function(obj, corrects) {
        var result = true;
        if (_.isObject(obj) && _.keys(obj).length > 0) {
            for (var key in obj) {
                var t = false;
                for (var i = 0; i < corrects.length; i++) {
                    if (obj[key] == corrects[i]) t = true;
                }
                if (t == false) {
                    result = false;
                    break;
                }
            }
            return result;
        } else {
            result = false;
            return result;
        }
    },
    /*
        get-listcountry: lay danh sach country 
    */
    getListCountry: function() {
        return Country.findAll({}).then(function(result) {
            return result;
        }, function(err) {
            var error = new Error("getListCountry.error");
            error.pushErrors("Country.findAll.error");
            throw error;
        })
    },
    parseAuMobilePhone: function(PhoneNumber) {
        if (!checkData(PhoneNumber)) return null;
        var auPhoneNumberPattern = new RegExp(this.regexPattern.auPhoneNumber);
        PhoneNumber = PhoneNumber.replace(this.regexPattern.phoneExceptChars, '');
        if (!auPhoneNumberPattern.test(PhoneNumber)) {
            return null;
        } else {
            PhoneNumber = PhoneNumber.slice(-9);
            PhoneNumber = '+61' + PhoneNumber;
            return PhoneNumber;
        }
    },
    isValidEmail: function(Email) {
        if (!checkData(Email)) return false;
        var emailPattern = new RegExp(this.regexPattern.email);
        if (emailPattern.test(Email)) {
            return true;
        } else {
            return false;
        }
    },
    /*
        Encrypt file với algorithm AES-256 và password được cung cấp
        -info: là 1 object bao gồm [inputFile, outputFile, password];
        -callback: callback trả về
    */
    EncryptFile: function(info, callback) {
        if (!info.inputFile || !info.outputFile || !info.password) {
            var err = new Error("EncryptFile.Error");
            err.pushError("Invalid Params!");
            return callback(err);
        };
        fs.access(info.inputFile, function(err) {
            if (err) {
                var err = new Error("EncryptFile.Error");
                err.pushError("File Is Not Exist!");
                return callback(err);
            }
            var inputStream = fs.createReadStream(info.inputFile);
            var outputStream = fs.createWriteStream(info.outputFile);
            var encrypt = crypto.createCipher(algorithm, info.password);
            inputStream.on('data', function(data) {
                var buf = new Buffer(encrypt.update(data), 'binary');
                outputStream.write(buf);
            }).on('end', function() {
                var buf = new Buffer(encrypt.final('binary'), 'binary');
                zlib.gzip(buf, {
                    level: 9
                }, function(err, result) {
                    if (err) throw err;
                    outputStream.write(buf);
                    outputStream.end();
                    outputStream.on('close', function() {
                        callback();
                    })
                });
            });
        })
    },
    /*
        Decrypt file với algorithm AES-256 và password được cung cấp
        -info: là 1 object bao gồm [inputFile, outputFile, password];
        -callback: callback trả về
    */
    DecryptFile: function(info, callback) {
        if (!info.inputFile || !info.outputFile || !info.password) {
            var err = new Error("DecryptFile.Error");
            err.pushError("Invalid Params!");
            return callback(err);
        };
        fs.access(info.inputFile, function(err) {
            if (err) {
                var err = new Error("DecryptFile.Error");
                err.pushError("File Is Not Exist!");
                return callback(err);
            }
            var inputStream = fs.createReadStream(info.inputFile);
            var outputStream = fs.createWriteStream(info.outputFile);
            var decrypt = crypto.createDecipher(algorithm, info.password)
            inputStream.on('data', function(data) {
                var buf = new Buffer(decrypt.update(data), 'binary');
                outputStream.write(buf);
            }).on('end', function() {
                var buf = new Buffer(decrypt.final('binary'), 'binary');
                zlib.gunzip(buf, function(err, result) {
                    if (err) throw err;
                    outputStream.write(buf);
                    outputStream.end();
                    outputStream.on('close', function() {
                        callback();
                    });
                });
            });
        })
    },
    GetRole: function(roles) {
        if (_.isArray(roles)) {
            var result = {
                isAdmin: false,
                isAssistant: false,
                isInternalPractitioner: false,
                isExternalPractitioner: false,
                isPatient: false
            };
            roles.forEach(function(role, index) {
                switch (role.RoleCode) {
                    case 'ADMIN':
                        result.isAdmin = true;
                        break;
                    case 'ASSISTANT':
                        result.isAssistant = true;
                        break;
                    case 'INTERNAL_PRACTITIONER':
                        result.isInternalPractitioner = true;
                        break;
                    case 'EXTERTAL_PRACTITIONER':
                        result.isExternalPractitioner = true;
                        break;
                    case 'PATIENT': 
                        result.isPatient = true;
                    break;
                    default:
                        break;
                }
            });
            return result;
        }
    },

    isExpired:function(createdDate,seconds)
    {
        if(checkData(seconds))
        {
            var date=moment(createdDate);
            var expiredDate=date.clone().add(seconds,'seconds');
            var current=moment();
            if(current.isBefore(expiredDate))
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        else
        {
            return false;
        }
    },

    getSystems:function()
    {
        return _.values(this.const.systemType);
    },

    getMobileSystems:function()
    {
        var systems=_.values(this.const.systemType);
        var website=this.const.systemType.website;
        return _.filter(systems,function(item){
            return item!=website;
        })
    },

    md5:function(value)
    {
        if(checkData(value))
        {
            return md5(value);
        }
        else
        {
            return md5(moment().valueOf());
        }
    },
    
}
