var $q = require('q');
var config = sails.config.myconf;
var jwt = require('jsonwebtoken');
var secret = 'ewfn09qu43f09qfj94qf*&H#(R';
//moment
var moment = require('moment');
var check = require('../HelperService');
var twilioClient = require('twilio')(config.twilioSID, config.twilioToken);

function SendSMS(toNumber, content, callback) {
    console.log("vao????????????????????????????????????");
    return twilioClient.messages.create({
        body: content,
        to: toNumber,
        from: config.twilioPhone
    }, callback());
};

//default attributes
var defaultAtrributes = [
    'ID',
    'UID',
    'UserAccountID',
    'Title',
    'FirstName',
    'MiddleName',
    'LastName',
    'DOB',
    'Gender',
    'Occupation',
    'Address1',
    'Address2',
    'Suburb',
    'Postcode',
    'State',
    'CountryID1',
    'CountryID1',
    'Email1',
    'Email2',
    'HomePhoneNumber',
    'WorkPhoneNumber',
    'Enable',
    'MaritalStatus',
    'PreferredName',
    'PreviousName',
    'Indigenous',
    'FaxNumber',
    'InterpreterRequired',
    'InterperterLanguage',
    'OtherSpecialNeed',
    'Education'
];

//generator Password
var generatePassword = require('password-generator');

module.exports = {
    /*
        validation : validate input from client post into server
        input: patient's information
        output: validate patient's information
    */
    validation: function(data, type) {
        var character = new RegExp(check.regexPattern.character);
        var address = new RegExp(check.regexPattern.address);
        var postcode = new RegExp(check.regexPattern.postcode);
        var isCreate = type == true ? true : false;
        var q = $q.defer();
        var errors = [];
        //create a error with contain a list errors input
        var err = new Error("ERRORS");
        if (type == true) {
            try {
                // validate FirstName
                if (data.FirstName != undefined && data.FirstName) {
                    if (data.FirstName.length < 0 || data.FirstName.length > 50) {
                        errors.push({ field: "FirstName", message: "max length" });
                        err.pushErrors(errors);
                    }
                    if (!character.test(data.FirstName)) {
                        errors.push({ field: "FirstName", message: "invalid value" });
                        err.pushErrors(errors);
                    }
                } else {
                    errors.push({ field: "FirstName", message: "required" });
                    err.pushErrors(errors);
                }

                //validate MiddleName
                if (data.MiddleName != undefined && data.MiddleName) {
                    if (data.MiddleName.length < 0 || data.MiddleName.length > 100) {
                        errors.push({ field: "MiddleName", message: "max length" });
                        err.pushErrors(errors);
                    }
                    if (!character.test(data.MiddleName)) {
                        errors.push({ field: "MiddleName", message: "invalid value" });
                        err.pushErrors(errors);
                    }
                }

                //validate LastName
                if (data.LastName != undefined && data.LastName) {
                    if (data.LastName.length < 0 || data.LastName.length > 50) {
                        errors.push({ field: "LastName", message: "max length" });
                        err.pushErrors(errors);
                    }
                    if (!character.test(data.LastName)) {
                        errors.push({ field: "LastName", message: "invalid value" });
                        err.pushErrors(errors);
                    }
                } else {
                    errors.push({ field: "LastName", message: "required" });
                    err.pushErrors(errors);
                }

                //validate Gender
                if (data.Gender != undefined && data.Gender) {
                    if (data.Gender != "Female" && data.Gender != "Male" && data.Gender != "Other") {
                        errors.push({ field: "Gender", message: "invalid value" });
                        err.pushErrors(errors);
                    }
                } 
                // else {
                //     errors.push({ field: "Gender", message: "required" });
                //     err.pushErrors(errors);
                // }

                //validate Address1
                if (data.Address1 != undefined && data.Address1) {
                    if (data.Address1.length < 0 || data.Address1.length > 255) {
                        errors.push({ field: "Address1", message: "max length" });
                        err.pushErrors(errors);
                    }
                    if (!address.test(data.Address1)) {
                        errors.push({ field: "Address1", message: "invalid value" });
                        err.pushErrors(errors);
                    }
                } 
                // else {
                //     errors.push({ field: "Address1", message: "required" });
                //     err.pushErrors(errors);
                // }

                //validate Address2
                if (data.Address2 != undefined && data.Address2) {
                    if (data.Address2.length < 0 || data.Address2.length > 255) {
                        errors.push({ field: "Address2", message: "max length" });
                        err.pushErrors(errors);
                    }
                    if (!address.test(data.Address2)) {
                        errors.push({ field: "Address2", message: "invalid value" });
                        err.pushErrors(errors);
                    }
                }

                //validate DOB
                if (data.DOB != undefined && data.DOB) {
                    if (data.DOB != null || data.DOB != "") {
                        if (!/^(\d{1,2})[/](\d{1,2})[/](\d{4})/.test(data.DOB)) {
                            errors.push({ field: "DOB", message: "invalid value" });
                            err.pushErrors(errors);
                        }
                    }
                } else {
                    errors.push({ field: "DOB", message: "required" });
                    err.pushErrors(errors);
                }

                //validate Occupation
                if (data.Occupation != undefined && data.Occupation) {
                    if (data.Occupation.length < 0 || data.Occupation.length > 255) {
                        errors.push({ field: "Occupation", message: "max length" });
                        err.pushErrors(errors);
                    }
                    if (!character.test(data.Occupation)) {
                        errors.push({ field: "Occupation", message: "invalid value" });
                        err.pushErrors(errors);
                    }
                }

                //validate Suburb
                if (data.Suburb != undefined && data.Suburb) {
                    if (data.Suburb.length < 0 || data.Suburb.length > 100) {
                        errors.push({ field: "Suburb", message: "max length" });
                        err.pushErrors(errors);
                    }
                }

                //validate Postcode
                if (data.Postcode != undefined && data.Postcode) {
                    if (data.Postcode.length < 0 || data.Postcode.length > 100) {
                        errors.push({ field: "Postcode", message: "max length" });
                        err.pushErrors(errors);
                    }
                    if (!postcode.test(data.Postcode)) {
                        errors.push({ field: "Postcode", message: "invalid value" });
                        err.pushErrors(errors);
                    }
                } 
                // else {
                //     errors.push({ field: "Postcode", message: "required" });
                //     err.pushErrors(errors);
                // }

                //validate Email1
                if (data.Email1 != undefined && data.Email1) {
                    var EmailPattern1 = new RegExp(check.regexPattern.email);
                    if (!EmailPattern1.test(data.Email1)) {
                        errors.push({ field: "Email1", message: "invalid value" });
                        err.pushErrors(errors);
                        throw err;
                    }
                }

                //validate Email2
                // if(data.Email2){
                //  var EmailPattern2=new RegExp(check.regexPattern.email);
                //  if(!EmailPattern2.test(data.Email2)){
                //      errors.push({field:"Email2",message:"invalid value"});
                //      err.pushErrors(errors);
                //      throw err;
                //  }
                // }

                //validte State
                if (data.State != undefined && data.State) {
                    if (data.State.length < 0 || data.State.length > 255) {
                        errors.push({ field: "State", message: "max length" });
                        err.pushErrors(errors);
                    }
                    if (!character.test(data.State)) {
                        errors.push({ field: "State", message: "invalid value" });
                        err.pushErrors(errors);
                    }
                } 
                // else {
                //     errors.push({ field: "State", message: "required" });
                //     err.pushErrors(errors);
                // }

                if (data.Title != undefined && data.Title) {
                    if (data.Title != 'Dr' && data.Title != 'Ms' &&
                        data.Title != 'Mr' && data.Title != 'Mrs' &&
                        data.Title != 'Miss' && data.Title != 'Master') {
                        errors.push({ field: "Title", message: "invalid value" });
                        err.pushErrors(errors);
                    }
                } 
                // else {
                //     errors.push({ field: "Title", message: "required" });
                //     err.pushErrors(errors);
                // }

                //validate HomePhoneNumber? hoi a Tan su dung exception
                if (data.HomePhoneNumber != undefined && data.HomePhoneNumber.length > 0) {
                    var auHomePhoneNumberPattern = new RegExp(check.regexPattern.auHomePhoneNumber);
                    // var HomePhone = data.HomePhoneNumber.replace(check.regexPattern.phoneExceptChars, '');
                    if (!auHomePhoneNumberPattern.test(data.HomePhoneNumber)) {
                        errors.push({ field: "HomePhoneNumber", message: "invalid value" });
                        err.pushErrors(errors);
                        throw err;
                    }
                }

                //validate HomePhoneNumber? hoi a Tan su dung exception
                if (data.WorkPhoneNumber != undefined && data.WorkPhoneNumber.length > 0) {
                    var auWorkPhoneNumberPattern = new RegExp(check.regexPattern.auHomePhoneNumber);
                    // var WorkPhoneNumber = data.WorkPhoneNumber.replace(check.regexPattern.phoneExceptChars, '');
                    if (!auWorkPhoneNumberPattern.test(data.WorkPhoneNumber)) {
                        errors.push({ field: "WorkPhoneNumber", message: "invalid value" });
                        err.pushErrors(errors);
                        throw err;
                    }
                }

                if (err.getErrors().length > 0) {
                    throw err;
                } else {
                    q.resolve({ status: 'success' });
                }
                //q.resolve({status:'success'});

            } catch (err) {
                q.reject(err);
            }
        } else {
            try {
                // validate FirstName
                if ('FirstName' in data) {
                    if (data.FirstName) {
                        if (data.FirstName.length < 0 || data.FirstName.length > 50) {
                            errors.push({ field: "FirstName", message: "max length" });
                            err.pushErrors(errors);
                        }
                        if (!character.test(data.FirstName)) {
                            errors.push({ field: "FirstName", message: "invalid value" });
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate MiddleName
                if ('MiddleName' in data) {
                    if (data.MiddleName) {
                        if (data.MiddleName.length < 0 || data.MiddleName.length > 100) {
                            errors.push({ field: "MiddleName", message: "max length" });
                            err.pushErrors(errors);
                        }
                        if (!character.test(data.MiddleName)) {
                            errors.push({ field: "MiddleName", message: "invalid value" });
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate LastName
                if ('LastName' in data) {
                    if (data.LastName) {
                        if (data.LastName.length < 0 || data.LastName.length > 50) {
                            errors.push({ field: "LastName", message: "max length" });
                            err.pushErrors(errors);
                        }
                        if (!character.test(data.LastName)) {
                            errors.push({ field: "LastName", message: "invalid value" });
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate Gender
                if ('Gender' in data) {
                    if (data.Gender) {
                        if (data.Gender != "Female" && data.Gender != "Male" && data.Gender != "Other") {
                            errors.push({ field: "Gender", message: "invalid value" });
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate Address1
                if ('Address1' in data) {
                    if (data.Address1) {
                        if (data.Address1.length < 0 || data.Address1.length > 255) {
                            errors.push({ field: "Address1", message: "max length" });
                            err.pushErrors(errors);
                        }
                        if (!address.test(data.Address1)) {
                            errors.push({ field: "Address1", message: "invalid value" });
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate Address2
                if ('Address2' in data) {
                    if (data.Address2) {
                        if (data.Address2.length < 0 || data.Address2.length > 255) {
                            errors.push({ field: "Address2", message: "max length" });
                            err.pushErrors(errors);
                        }
                        if (!address.test(data.Address2)) {
                            errors.push({ field: "Address2", message: "invalid value" });
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate DOB
                if ('DOB' in data) {
                    if (data.DOB) {
                        if (data.DOB != null || data.DOB != "") {
                            if (!/^(\d{1,2})[/](\d{1,2})[/](\d{4})/.test(data.DOB)) {
                                errors.push({ field: "DOB", message: "invalid value" });
                                err.pushErrors(errors);
                            }
                        }
                    }
                }

                //validate Occupation
                if ('Occupation' in data) {
                    if (data.Occupation) {
                        if (data.Occupation.length < 0 || data.Occupation.length > 255) {
                            errors.push({ field: "Occupation", message: "max length" });
                            err.pushErrors(errors);
                        }
                        if (!character.test(data.Occupation)) {
                            errors.push({ field: "Occupation", message: "invalid value" });
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate Suburb
                if ('Suburb' in data) {
                    if (data.Suburb) {
                        if (data.Suburb.length < 0 || data.Suburb.length > 100) {
                            errors.push({ field: "Suburb", message: "max length" });
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate Postcode
                if ('Postcode' in data) {
                    if (data.Postcode) {
                        if (data.Postcode.length < 0 || data.Postcode.length > 100) {
                            errors.push({ field: "Postcode", message: "max length" });
                            err.pushErrors(errors);
                        }
                        if (!postcode.test(data.Postcode)) {
                            errors.push({ field: "Postcode", message: "invalid value" });
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate Email1
                if ('Email1' in data) {
                    if (data.Email1) {
                        var EmailPattern1 = new RegExp(check.regexPattern.email);
                        if (!EmailPattern1.test(data.Email1)) {
                            errors.push({ field: "Email1", message: "invalid value" });
                            err.pushErrors(errors);
                            throw err;
                        }
                    }
                }

                //validate Email2
                // if(data.Email2){
                //  var EmailPattern2=new RegExp(check.regexPattern.email);
                //  if(!EmailPattern2.test(data.Email2)){
                //      errors.push({field:"Email2",message:"invalid value"});
                //      err.pushErrors(errors);
                //      throw err;
                //  }
                // }

                //validte State
                if ('State' in data) {
                    if (data.State) {
                        if (data.State.length < 0 || data.State.length > 255) {
                            errors.push({ field: "State", message: "max length" });
                            err.pushErrors(errors);
                        }
                        if (!character.test(data.State)) {
                            errors.push({ field: "State", message: "invalid value" });
                            err.pushErrors(errors);
                        }
                    }
                }

                if ('Title' in data) {
                    if (data.Title) {
                        if (data.Title != 'Dr' && data.Title != 'Ms' &&
                            data.Title != 'Mr' && data.Title != 'Mrs' &&
                            data.Title != 'Miss' && data.Title != 'Master') {
                            errors.push({ field: "Title", message: "invalid value" });
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate HomePhoneNumber? hoi a Tan su dung exception
                if ('HomePhoneNumber' in data) {
                    if (data.HomePhoneNumber.length > 0) {
                        var auHomePhoneNumberPattern = new RegExp(check.regexPattern.auHomePhoneNumber);
                        // var HomePhone = data.HomePhoneNumber.replace(check.regexPattern.phoneExceptChars, '');
                        if (!auHomePhoneNumberPattern.test(data.HomePhoneNumber)) {
                            errors.push({ field: "HomePhoneNumber", message: "invalid value" });
                            err.pushErrors(errors);
                            throw err;
                        }
                    }
                }

                //validate HomePhoneNumber? hoi a Tan su dung exception
                if ('WorkPhoneNumber' in data) {
                    if (data.WorkPhoneNumber.length > 0) {
                        var auWorkPhoneNumberPattern = new RegExp(check.regexPattern.auHomePhoneNumber);
                        // var WorkPhoneNumber = data.WorkPhoneNumber.replace(check.regexPattern.phoneExceptChars, '');
                        if (!auWorkPhoneNumberPattern.test(data.WorkPhoneNumber)) {
                            errors.push({ field: "WorkPhoneNumber", message: "invalid value" });
                            err.pushErrors(errors);
                            throw err;
                        }
                    }
                }

                if (err.getErrors().length > 0) {
                    throw err;
                } else {
                    q.resolve({ status: 'success' });
                }
                //q.resolve({status:'success'});

            } catch (err) {
                q.reject(err);
            }
        }
        return q.promise;
    },

    /*
        whereClause : function that create a where clause for query
        input  : information like:
                    "data" :{
                        "Search":{
                            "FirstName":"asvasv",.....
                        }
                    }
        output : if porperty has existed in table Patient, it will defined
    */
    whereClause: function(data) {
        // define whereClause's data
        var whereClause = {};
        //create patient's object in whereClause's data that puts all information to filter in patient table
        whereClause.Patient = {};
        //create UserAccount's object in whereClause's data that puts all information to filter in useraccount table
        whereClause.UserAccount = {};
        if (check.checkData(data.Search)) {
            if (data.Search.FirstName) {
                whereClause.Patient.FirstName = {
                    like: '%' + data.Search.FirstName + '%'
                }
            }
            if (data.Search.MiddleName) {
                whereClause.Patient.MiddleName = {
                    like: '%' + data.Search.MiddleName + '%'
                }
            }
            if (data.Search.LastName) {
                whereClause.Patient.LastName = {
                    like: '%' + data.Search.LastName + '%'
                }
            }
            if (data.Search.Gender) {
                whereClause.Patient.Gender = data.Search.Gender;
            }
            if (data.Search.Email1) {
                whereClause.Patient.Email1 = {
                    like: '%' + data.Search.Email1 + '%'
                }
            }
            if (data.Search.Email2) {
                whereClause.Patient.Email2 = {
                    like: '%' + data.Search.Email2 + '%'
                }
            }
            if (data.Search.Enable) {
                whereClause.UserAccount.Enable = {
                    like: '%' + data.Search.Enable + '%'
                }
            }
            if (data.Search.PhoneNumber) {
                if (data.Search.PhoneNumber[0] == '0') {
                    data.Search.PhoneNumber = data.Search.PhoneNumber.substr(1, data.Search.PhoneNumber.length);
                }
                whereClause.UserAccount.PhoneNumber = {
                    like: '%' + data.Search.PhoneNumber + '%'
                }
            }
        }
        return whereClause;
    },

    /*
        sendMail : service send mail to Patient
        input : email patient
        output: send mail if email has existed.
    */
    sendMail: function(data, transaction, fn) {
        return UserAccount.findOne({
                where: {
                    Email: data.Email
                },
                transaction: transaction
            })
            .then(function(result) {
                console.log('````````````````````````````````````` ', result);
                if (result != null && result != "") {
                    data.UID = result.UID;
                    return Services.UserAccount.sendMail(data, secret, transaction, function(err, responseStatus, html, text) {
                        console.log("toi day ???");
                        if (err) {
                            console.log("loi~");
                            transaction.rollback();
                            fn(err);
                        } else {
                            fn(null);
                        }
                    });
                } else {
                    var err = new Error("sendMail");
                    err.pushError("Email.notFound");
                    fn(err);
                }
            }, function(err) {
                transaction.rollback();
                fn(err);
            });
    },

    sendSMS: function(data, transaction, fn) {
        data.PhoneNumber = check.parseAuMobilePhone(data.PhoneNumber);
        return UserAccount.findOne({
                where: {
                    PhoneNumber: data.PhoneNumber
                },
                transaction: transaction
            })
            .then(function(result) {
                if (result != null && result != "") {
                    var phoneNumber = typeof data.PhoneNumber != 'undefined' ? data.PhoneNumber : null;
                    var content = result.PinNumber;
                    // var phoneRegex = /^\+[0-9]{9,15}$/;
                    if (phoneNumber != null && content != null) {
                        return SendSMS(phoneNumber, content, function(err, message) {
                            console.log("err sms ~~~~~~~~~~~~~~ ", err);
                            if (err && config.twilioEnv == 'product') {
                                console.log("vao err ne ???????????????????");
                                transaction.rollback();
                                fn(err);
                            } else {
                                console.log("da chay thong qua");
                                fn(null);
                            }
                        });
                    } else fn('error');
                } else {
                    var err = new Error("sendSMS");
                    err.pushError("PhoneNumber.notFound");
                    fn(err);
                }
            }, function(err) {
                transaction.rollback();
                fn(err);
            });
    },

    /*
        CreatePatient : service create patient
        input: Patient's information
        output: insert Patient's information into table Patient
    */
    CreatePatient: function(data, other, transaction) {
        var PatientDetail = {};
        var isCreateByPhoneNumber = false;
        var isCreateByName = false;
        var isCreateByEmail = false;
        var isCreateByPhoneAndEmail = false;
        var ishaveUser = false;
        var userInfo = {};
        var defer = $q.defer();
        var patientInfo = {};
        var info = {
            Title: data.Title,
            FirstName: data.FirstName,
            MiddleName: data.MiddleName,
            LastName: data.LastName,
            DOB: data.DOB ? data.DOB : null,
            Gender: data.Gender,
            Occupation: data.Occupation,
            HomePhoneNumber: data.HomePhoneNumber,
            WorkPhoneNumber: data.WorkPhoneNumber,
            CountryID1: data.CountryID1,
            Suburb: data.Suburb,
            Postcode: data.Postcode,
            Email1: data.Email1,
            Email2: data.Email2,
            UID: UUIDService.Create(),
            Address1: data.Address1,
            Address2: data.Address2,
            State: data.State,
            Signature: data.PatientSignatureID ? data.PatientSignatureID : null,
            Enable: "Y"
        };
        sequelize.transaction()
            .then(function(t) {
                Services.Patient.validation(data, true)
                    .then(function(success) {
                        if (data.Email && data.PhoneNumber) {
                            isCreateByPhoneAndEmail = true;
                            userInfo.UserName = data.UserName?data.UserName:check.parseAuMobilePhone(data.PhoneNumber);
                            userInfo.PhoneNumber = data.PhoneNumber;
                            userInfo.Email = data.Email;
                            return success;
                        } else if (data.Email) {
                            isCreateByEmail = true;
                            userInfo.UserName = data.UserName?data.UserName:data.Email;
                            userInfo.Email = data.Email;
                            return success;
                        } else if (data.PhoneNumber) {
                            isCreateByPhoneNumber = true;
                            userInfo.UserName = data.UserName?data.UserName:check.parseAuMobilePhone(data.PhoneNumber);
                            userInfo.PhoneNumber = check.parseAuMobilePhone(data.PhoneNumber);
                            return success;
                        } else {
                            isCreateByName = true;
                            var FirstName = data.FirstName.replace(/[\s]/g,'');
                            var LastName = data.LastName.replace(/[\s]/g,'');
                            userInfo.UserName = data.UserName?data.UserName: FirstName[0] + "." + LastName;
                            return success;
                        }
                    }, function(err) {
                        // t.rollback();
                        throw err;
                    })
                    .then(function(validated) {
                        if (validated && validated.status == 'success') {
                            userInfo.Password = generatePassword(6, false,/^[A-Za-z0-9]$/);
                            userInfo.PinNumber = data.PinNumber ? data.PinNumber : generatePassword(6, false,/^[0-9]$/);
                            userInfo.UserName = userInfo.UserName.replace(/[\s]/g,'');
                            // return Services.UserAccount.CreateUserAccount(userInfo, t);
                            if(!data.PhoneNumber && !data.Email) {
                                function checkUser(arr, numb){
                                    var promise = new Promise(function(a,b) {
                                        for(var i = 0; i < arr.length; i++) {
                                            if(arr[i].UserName == userInfo.UserName) {
                                                userInfo.UserName += numb;
                                                numb++;
                                                checkUser(arr, numb);
                                            }
                                        }
                                        a();
                                    });
                                    return promise;
                                }
                                return UserAccount.findAll({
                                    attributes:['ID','UserName'],
                                    where :{
                                        UserName : {$like: '%'+ userInfo.UserName +'%'},
                                    },
                                    transaction: t,
                                })
                                .then(function(got_user) {
                                    if(got_user == '' || got_user == null) {
                                        return validated;
                                    }
                                    else {
                                        var number = 1;
                                        checkUser(got_user, number)
                                        .then(function() {
                                            return validated;
                                        });
                                    }
                                }, function(err) {
                                    throw err;
                                })
                            }
                            else {
                                return validated;
                            }
                        } else {
                            return validated;
                        }
                    }, function(err) {
                        throw err;
                    })
                    .then(function(begin_createuser) {
                            return Services.UserAccount.CreateUserAccount(userInfo, t);
                    }, function(err) {
                        throw err;
                    })
                    .then(function(user) {
                        console.log("user ", user);
                        info.UserAccountID = user.ID;
                        info.UserAccountUID = user.UID;
                        return Patient.findOne({
                            where: {
                                UserAccountID: info.UserAccountID
                            },
                            transaction: t
                        });
                    }, function(err) {
                        // t.rollback();
                        throw err;
                    })
                    .then(function(got_patient) {

                        if (got_patient == null || got_patient == '') {
                            return Patient.create(info, { transaction: t });
                        } else {
                            var err = new Error("CreatePatient.Error");
                            err.pushError("UserAccount.Has.Used");
                            throw err;
                        }
                    }, function(err) {
                        console.log("errs ", err);
                        // t.rollback();
                        throw err;
                    })
                    .then(function(result) {
                        info.ID = result.ID;
                        if (other != null) {
                            for (var key in other) {
                                other[key].PatientID = result.ID;
                                other[key].UID = UUIDService.Create();
                            }
                            PatientDetail = other;
                        }
                        return RelUserRole.create({
                            UserAccountId: info.UserAccountID,
                            RoleId: 3,
                            SiteId: 1,
                            CreatedDate: new Date()
                        }, { transaction: t });
                    }, function(err) {
                        // t.rollback();
                        console.log("err ", err);
                        throw err;
                    })
                    .then(function(created_reluserrole) {
                        if (created_reluserrole == null || created_reluserrole == '') {
                            var err = new Error("CreatePatient.Error");
                            err.pushError("RelUserRole.createfail");
                            throw err;
                        } else {
                            if (PatientDetail != null && PatientDetail != '') {
                                if (PatientDetail.PatientMedicare != null && PatientDetail.PatientMedicare != '') {
                                    PatientDetail.PatientMedicare.Enable = 'Y';
                                    return PatientMedicare.create(PatientDetail.PatientMedicare, { transaction: t });
                                }
                            }
                        }
                    }, function(err) {
                        throw err;
                    })
                    .then(function(created_patientMedicare) {
                        if (PatientDetail != null && PatientDetail != '') {
                            if (PatientDetail.PatientKin != null && PatientDetail.PatientKin != '') {
                                PatientDetail.PatientKin.Enable = 'Y';
                                return PatientKin.create(PatientDetail.PatientKin, { transaction: t });
                            }
                        }
                    }, function(err) {
                        throw err;
                    })
                    .then(function(created_patientKin) {
                        if (PatientDetail != null && PatientDetail != '') {
                            if (PatientDetail.Fund != null && PatientDetail.Fund != '') {
                                PatientDetail.Fund.Enable = 'Y';
                                return PatientFund.create(PatientDetail.Fund, { transaction: t });
                            }
                        }
                    }, function(err) {
                        throw err;
                    })
                    .then(function(created_patientFund) {
                        if (PatientDetail != null && PatientDetail != '') {
                            if (PatientDetail.PatientDVA != null && PatientDetail.PatientDVA != '') {
                                PatientDetail.PatientDVA.Enable = 'Y';
                                return PatientDVA.create(PatientDetail.PatientDVA, { transaction: t });
                            }
                        }
                    }, function(err) {
                        throw err;
                    })
                    .then(function(created_patientDVA) {
                        if (PatientDetail != null && PatientDetail != '') {
                            if (PatientDetail.PatientGP != null && PatientDetail.PatientGP != '') {
                                PatientDetail.PatientGP.Enable = 'Y';
                                return PatientGP.create(PatientDetail.PatientGP, { transaction: t });
                            }
                        }
                    }, function(err) {
                        throw err;
                    })
                    .then(function(created_patientGP) {
                        if (PatientDetail != null && PatientDetail != '') {
                            if (PatientDetail.PatientPension != null && PatientDetail.PatientPension != '') {
                                PatientDetail.PatientPension.Enable = 'Y';
                                return PatientPension.create(PatientDetail.PatientPension, { transaction: t });
                            }
                        }
                    }, function(err) {
                        throw err;
                    })
                    .then(function(created_patientPension) {
                        if(!data.PatientSignatureUID) {
                            return created_patientPension;
                        }
                        else {
                            return FileUpload.findOne({
                                where: {
                                    UID : data.PatientSignatureUID
                                },
                                transaction: t
                            });
                        }
                    }, function(err) {
                        throw err;
                    })
                    .then(function(found_file) {
                        if(!data.PatientSignatureUID) {
                            return  ;
                        }
                        else {
                            if(found_file == null || found_file == '') {
                                return found_file;
                            }
                            else {
                                return FileUpload.update({
                                    UserAccountID : info.UserAccountID,
                                    FileType      : 'Signature',
                                },{
                                    where:{
                                        UID : data.PatientSignatureUID
                                    },
                                    transaction: t
                                });
                            }
                        }
                    }, function(err) {
                        throw err;
                    })
                    // .then(function(created_patientPension) {
                    //     if (ishaveUser == false) {
                    //         if (isCreateByPhoneAndEmail == true) {
                    //             data.content = data.PinNumber;
                    //             return Services.Patient.sendSMS(data, t, function(err) {
                    //                 console.log("no tra ve cai gi ", err);
                    //                 if (err && config.twilioEnv == 'product') {
                    //                     console.log("vao day ??? xay ra loi ne sms 1");
                    //                     throw err;
                    //                 } else {
                    //                     return Services.Patient.sendMail(data, t, function(err) {
                    //                         if (err) {
                    //                             console.log(err);
                    //                             console.log("vao day ??? xay ra loi ne mail 1");
                    //                             throw err;
                    //                         } else {
                    //                             info.transaction = t;
                    //                             info.PinNumber = userInfo.PinNumber;
                    //                             // defer.resolve(info);
                    //                         }
                    //                     });
                    //                 }
                    //             });
                    //         } else if (isCreateByEmail == true) {
                    //             return Services.Patient.sendMail(data, t, function(err) {
                    //                 if (err) {
                    //                     console.log(err);
                    //                     throw err;
                    //                 } else {
                    //                     info.transaction = t;
                    //                     info.PinNumber = userInfo.PinNumber;
                    //                     // defer.resolve(info);
                    //                 }
                    //             });
                    //         } else if (isCreateByPhoneNumber == true) {
                    //             data.content = data.PinNumber;
                    //             return Services.Patient.sendSMS(data, t, function(err) {
                    //                 console.log("no co loi~ kia ", err);
                    //                 if (err && config.twilioEnv == 'product') {
                    //                     console.log("hay vao day ???");
                    //                     throw err;
                    //                 } else {
                    //                     info.transaction = t;
                    //                     info.PinNumber = userInfo.PinNumber;
                    //                     // defer.resolve(info);
                    //                 }
                    //             });
                    //         } else {
                    //             info.transaction = t;
                    //             info.PinNumber = userInfo.PinNumber;
                    //             // defer.resolve(info);
                    //         }

                    //     } else {
                    //         info.transaction = t;
                    //         // defer.resolve(info);
                    //     }

                    // }, function(err) {
                    //     throw err;
                    // })
                    .then(function(success) {
                        //call send Mail or send SMSs
                        console.log("ishaveUser ", ishaveUser);
                        info.transaction = t;
                        info.PinNumber = userInfo.PinNumber;
                        defer.resolve(info);
                    }, function(err) {
                        //t.rollback();
                        // defer.reject({ err: err, transaction: t, configENV: config.twilioEnv, info: info });
                        // throw err;
                        defer.reject({ err: err, transaction: t, info: info });
                    });
            });
        return defer.promise;
    },

    /*
        UpdatePatient : service update a patient
        input:patient's information
        output:update patient into table Patient
    */
    UpdatePatient: function(data, other, transaction) {

        var isHaveRole = false;
        if (check.checkData(data)) {
            data.ModifiedDate = new Date();
            // data.DOB =moment(data.DOB,'YYYY-MM-DD HH:mm:ss ZZ').format('DD/MM/YYYY');
            data.DOB = data.DOB ? data.DOB : null;
            //get data not required
            var patientInfo = {
                ID: data.ID,
                Title: data.Title,
                FirstName: data.FirstName,
                MiddleName: data.MiddleName,
                LastName: data.LastName,
                DOB: data.DOB,
                Gender: data.Gender,
                Address1: data.Address1,
                Address2: data.Address2,
                Enable: data.Enable,
                Suburb: data.Suburb,
                Postcode: data.Postcode,
                State: data.State,
                Email1: data.Email,
                Occupation: data.Occupation,
                HomePhoneNumber: data.HomePhoneNumber,
                WorkPhoneNumber: data.WorkPhoneNumber,
                InterperterLanguage: data.InterperterLanguage,
                MaritalStatus: data.MaritalStatus,
                Education: data.Education
            };

            //get data required ( if data has values, get it)
            if (data.UserAccountID) patientInfo.UserAccountID = data.UserAccountID;
            if (data.CountryID1) patientInfo.CountryID1 = data.CountryID1;
            if (data.UID) patientInfo.UID = data.UID;
            if (data.DOB == null || data.DOB == '') delete patientInfo['DOB'];
            return sequelize.transaction()
                .then(function(t) {
                    return Services.Patient.validation(data)
                        .then(function(success) {
                            if (data.Signature != null && data.Signature != '') {
                                return FileUpload.findOne({
                                    where: {
                                        UID: data.Signature
                                    },
                                    transaction: t
                                });
                            } else {
                                return success;
                            }

                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                        .then(function(checkedSign) {
                            if (checkedSign == null || checkedSign == '') {
                                return checkedSign;
                            } else {
                                patientInfo.Signature = checkedSign.ID;
                                return Patient.update(patientInfo, {
                                    where: {
                                        UID: patientInfo.UID
                                    },
                                    transaction: t
                                })
                            }
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                        .then(function(user) {
                            if(data.Email || data.EnableUser || data.Activated){
                                var UserWhereClause = {};
                                var UserData = {};
                                if(data.UserAccountUID) {
                                    UserWhereClause.UID = data.UserAccountUID;
                                }
                                else if(data.UserAccountID) {
                                    UserWhereClause.ID = data.UserAccountID;
                                }
                                if(data.Email) {
                                    console.log("data.Email ", data.Email);
                                    var EmailPattern = new RegExp(check.regexPattern.email);
                                    if (!EmailPattern.test(data.Email)) {
                                        t.rollback();
                                        var err = new Error("UpdatePatient.Error");
                                        err.pushError("invalid.Email");
                                        throw err;
                                    }
                                    else {
                                        UserData.Email = data.Email;
                                    }
                                }
                                console.log("Activated ",data.Activated);
                                if(data.EnableUser) UserData.Enable = data.EnableUser;
                                if(data.Activated) UserData.Activated = data.Activated;
                                return UserAccount.update(UserData,{
                                    where: UserWhereClause,
                                    transaction:t
                                });
                            }
                            else {
                                return user;
                            }
                            // if (data.EnableUser != undefined && data.EnableUser != null && data.EnableUser != "") {
                            //     var UserWhereClause = {};
                            //     if(data.UserAccountUID) {
                            //         UserWhereClause.UID = data.UserAccountUID;
                            //     }
                            //     else if(data.UserAccountID) {
                            //         UserWhereClause.ID = data.UserAccountID;
                            //     }
                            //     return UserAccount.update({
                            //         Enable: data.EnableUser
                            //     }, {
                            //         where: UserWhereClause,
                            //         transaction: t
                            //     });
                            // } else {
                            //     if (data.Email && data.Email != null && data.Email != '') {
                            //         var EmailPattern = new RegExp(check.regexPattern.email);
                            //         if (!EmailPattern.test(data.Email)) {
                            //             t.rollback();
                            //             var err = new Error("UpdatePatient.Error");
                            //             err.pushError("invalid.Email");
                            //             throw err;
                            //         } else {
                            //             var UserWhereClause = {};
                            //             if(data.UserAccountUID) {
                            //                 UserWhereClause.UID = data.UserAccountUID;
                            //             }
                            //             else if(data.UserAccountID) {
                            //                 UserWhereClause.ID = data.UserAccountID;
                            //             }
                            //             return UserAccount.update({
                            //                 Email: data.Email
                            //             }, {
                            //                 where: UserWhereClause,
                            //                 transaction: t
                            //             });
                            //         }
                            //     } else
                            //         return user;
                            // }
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                        .then(function(updated_user) {
                            if(data.PinNumber && data.PinNumber != null && data.PinNumber != '') {
                                var PinNumberRegExp = /^[0-9]{6}$/;
                                if (!PinNumberRegExp.test(data.PinNumber)) {
                                    var err = new Error("UpdatePatient.Error");
                                    err.pushError("PinNumber must 6 digits.");
                                    throw err;
                                } else {
                                    return UserAccount.update({
                                        PinNumber: data.PinNumber
                                    }, {
                                        where: {
                                            ID: data.UserAccountID
                                        },
                                        transaction: t
                                    });
                                }

                            }
                            else {
                                return updated_user;
                            }
                        }, function(err) {
                            throw err;
                        })
                        //update 4 bang patient tai day
                        .then(function(result) {
                            console.log("1");
                            if (other != null && other != "") {
                                if (other.hasOwnProperty('PatientPension') == true) {
                                    return PatientPension.update(other.PatientPension, {
                                        where: {
                                            ID: other.PatientPension.ID
                                        },
                                        transaction: t
                                    });
                                }
                            } else
                                return result;
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                        .then(function(updatedPatientPension) {
                            if (other != null && other != "") {
                                if (other.hasOwnProperty('PatientMedicare') == true) {
                                    return PatientMedicare.update(other.PatientMedicare, {
                                        where: {
                                            ID: other.PatientMedicare.ID
                                        },
                                        transaction: t
                                    });
                                }
                            } else
                                return updatedPatientPension;
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                        .then(function(updatedPatientMedicare) {
                            if (other != null && other != "") {
                                if (other.hasOwnProperty('PatientDVA') == true) {
                                    return PatientDVA.update(other.PatientDVA, {
                                        where: {
                                            ID: other.PatientDVA.ID
                                        },
                                        transaction: t
                                    });
                                }
                            } else
                                return updatedPatientMedicare;
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                        .then(function(updatedPatientDVA) {
                            if (other != null && other != "") {
                                if (other.hasOwnProperty('PatientKin') == true) {
                                    return PatientKin.update(other.PatientKin, {
                                        where: {
                                            ID: other.PatientKin.ID
                                        },
                                        transaction: t
                                    });
                                }
                            } else
                                return updatedPatientDVA;

                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                        .then(function(updatedPatientGP) {
                            if (data.hasOwnProperty('PatientMedicare') == true) {
                                return PatientMedicare.findAll({
                                        where: {
                                            ID: data.PatientMedicare.ID
                                        },
                                        transaction: t
                                    })
                                    .then(function(has_PatientMedicare) {
                                        if (has_PatientMedicare == null || has_PatientMedicare == "") {
                                            data.PatientMedicare.PatientID = patientInfo.ID;
                                            data.PatientMedicare.UID = UUIDService.Create();
                                            data.PatientMedicare.ExpiryDate = new Date(moment(data.PatientMedicare.ExpiryDate + data.timezone, 'YYYY-MM-DD').format('YYYY-MM-DD'));
                                            return PatientMedicare.create(data.PatientMedicare, { transaction: t });
                                        } else {
                                            if (data.PatientMedicare.hasOwnProperty('ExpiryDate') == true) {
                                                // console.log('truoc khi convert >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ',data.PatientMedicare.ExpiryDate,' ',data.timezone);
                                                var parts = data.PatientMedicare.ExpiryDate.split('/');
                                                var date = parts[2].toString() + '-' + (parts[1]).toString() + '-' + parts[0].toString() + ' +0700';
                                                // console.log("chuoi ~~~~~~~~~~~~~~~~~~~~~~~~~~~` ",date);
                                                data.PatientMedicare.ExpiryDate = moment(date).toDate();
                                                // console.log('sau khi convert ---------------------------- ',data.PatientMedicare.ExpiryDate);
                                            }
                                            return PatientMedicare.update(data.PatientMedicare, {
                                                where: {
                                                    ID: data.PatientMedicare.ID
                                                },
                                                transaction: t
                                            });
                                        }
                                    }, function(err) {
                                        t.rollback();
                                        throw err;
                                    });
                            } else
                                return updatedPatientGP;
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                        .then(function(updatedPatientMedicare) {
                            if (data.hasOwnProperty('PatientPension') == true) {
                                return PatientPension.findAll({
                                        where: {
                                            ID: data.PatientPension.ID
                                        },
                                        transaction: t
                                    })
                                    .then(function(has_PatientPension) {
                                        if (has_PatientPension == null || has_PatientPension == "") {
                                            data.PatientPension.PatientID = patientInfo.ID;
                                            data.PatientPension.UID = UUIDService.Create();
                                            data.PatientPension.ExpiryDate = new Date(moment(data.PatientPension.ExpiryDate + data.timezone, 'YYYY-MM-DD').format('YYYY-MM-DD'));
                                            return PatientPension.create(data.PatientPension, { transaction: t });
                                        } else {
                                            // console.log('truoc khi convert >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ',data.PatientMedicare.ExpiryDate,' ',data.timezone);
                                            if (data.PatientPension.hasOwnProperty('ExpiryDate') == true) {
                                                var parts = data.PatientPension.ExpiryDate.split('/');
                                                var date = parts[2].toString() + '-' + (parts[1]).toString() + '-' + parts[0].toString() + ' +0700';
                                                // console.log("chuoi ~~~~~~~~~~~~~~~~~~~~~~~~~~~` ",date);
                                                data.PatientPension.ExpiryDate = moment(date).toDate();
                                                // console.log('sau khi convert ---------------------------- ',data.PatientMedicare.ExpiryDate);
                                            }
                                            return PatientPension.update(data.PatientPension, {
                                                where: {
                                                    ID: data.PatientPension.ID
                                                },
                                                transaction: t
                                            });
                                        }
                                    }, function(err) {
                                        t.rollback();
                                        throw err;
                                    });
                            } else return updatedPatientMedicare;
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                        .then(function(updatedPatientPension) {
                            if (data.hasOwnProperty('PatientFund') == true) {
                                return PatientFund.findAll({
                                        where: {
                                            ID: data.PatientFund.ID
                                        },
                                        transaction: t
                                    })
                                    .then(function(has_PatientFund) {
                                        if (has_PatientFund == null || has_PatientFund == "") {
                                            data.PatientFund.PatientID = patientInfo.ID;
                                            data.PatientFund.UID = UUIDService.Create();
                                            return PatientFund.create(data.PatientFund, { transaction: t });
                                        } else {
                                            var id = data.PatientFund.ID;
                                            delete data.PatientFund['ID'];
                                            delete data.PatientFund['UID'];
                                            return PatientFund.update(data.PatientFund, {
                                                where: {
                                                    ID: id
                                                },
                                                transaction: t
                                            });
                                        }
                                    }, function(err) {
                                        t.rollback();
                                        throw err;
                                    });
                            } else return updatedPatientPension;
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                        .then(function(updatedPatientFund) {
                            if (data.hasOwnProperty('PatientDVA') == true) {
                                return PatientDVA.findAll({
                                        where: {
                                            ID: data.PatientDVA.ID
                                        },
                                        transaction: t
                                    })
                                    .then(function(has_PatientDVA) {
                                        if (has_PatientDVA == null || has_PatientDVA == "") {
                                            data.PatientDVA.PatientID = patientInfo.ID;
                                            data.PatientDVA.UID = UUIDService.Create();
                                            return PatientDVA.create(data.PatientDVA, { transaction: t });
                                        } else {
                                            var DVAid = data.PatientDVA.ID;
                                            delete data.PatientDVA['ID'];
                                            delete data.PatientDVA['UID'];
                                            return PatientDVA.update(data.PatientDVA, {
                                                where: {
                                                    ID: DVAid
                                                },
                                                transaction: t
                                            });
                                        }
                                    }, function(err) {
                                        t.rollback();
                                        throw err;
                                    });
                            } else return updatedPatientFund;
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                        .then(function(updatedPatientDVA) {
                            if (data.hasOwnProperty('PatientGP') == true) {
                                return PatientGP.findAll({
                                        where: {
                                            ID: data.PatientGP.ID
                                        },
                                        transaction: t
                                    })
                                    .then(function(has_PatientGP) {
                                        if (has_PatientGP == null || has_PatientGP == "") {
                                            data.PatientGP.PatientID = patientInfo.ID;
                                            data.PatientGP.UID = UUIDService.Create();
                                            return PatientGP.create(data.PatientGP, { transaction: t });
                                        } else {
                                            var GPid = data.PatientGP.ID;
                                            delete data.PatientGP['ID'];
                                            delete data.PatientGP['UID'];
                                            return PatientGP.update(data.PatientGP, {
                                                where: {
                                                    ID: GPid
                                                },
                                                transaction: t
                                            });
                                        }
                                    }, function(err) {
                                        t.rollback();
                                        throw err;
                                    });
                            } else return updatedPatientDVA;
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                        .then(function(updatedPatientGP) {
                            if (data.hasOwnProperty('PatientKin') == true) {
                                return PatientKin.findAll({
                                        where: {
                                            ID: data.PatientKin.ID
                                        },
                                        transaction: t
                                    })
                                    .then(function(has_PatientKin) {
                                        if (has_PatientKin == null || has_PatientKin == "") {
                                            data.PatientKin.PatientID = patientInfo.ID;
                                            data.PatientKin.UID = UUIDService.Create();
                                            return PatientKin.create(data.PatientKin, { transaction: t });
                                        } else {
                                            var Kinid = data.PatientKin.ID;
                                            delete data.PatientKin['ID'];
                                            delete data.PatientKin['UID'];
                                            return PatientKin.update(data.PatientKin, {
                                                where: {
                                                    ID: Kinid
                                                },
                                                transaction: t
                                            });
                                        }
                                    }, function(err) {
                                        t.rollback();
                                        throw err;
                                    });
                            } else return updatedPatientGP;
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                        //end add

                    //ket thuc update 4 bang
                    .then(function(result) {
                            if (data.RoleId != undefined && data.RoleId != null && data.RoleId != "" && (data.RoleId == 3)) {
                                isHaveRole = true;
                                return Services.Doctor.checkUserRole(data.UserAccountID, t);
                            } else {
                                // t.commit();
                                // var message = "success";
                                return result;
                            }
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                        .then(function(check) {
                            if (isHaveRole == true) {
                                if (check == null) {
                                    console.log("?????");
                                    return RelUserRole.create({
                                        RoleId: data.RoleId,
                                        UserAccountId: data.UserAccountID,
                                        SiteId: 1,
                                        CreatedDate: new Date(),
                                        Enable: 'Y'
                                    }, { transaction: t });
                                } else {
                                    return RelUserRole.update({
                                        RoleId: data.RoleId,
                                        ModifiedDate: new Date()
                                    }, {
                                        transaction: t,
                                        where: {
                                            UserAccountId: data.UserAccountID
                                        }
                                    });
                                }
                            } else {
                                return check;
                            }
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                        .then(function(success) {
                            if (isHaveRole == true) {
                                t.commit();
                                var message = "success";
                                return message;
                            } else {
                                t.commit();
                                var message = "success";
                                return message;
                            }
                        }, function(err) {
                            t.rollback();
                            throw err;
                        });
                });
        }
    },


    /*
        GetPatient : service get a patient with condition
        input:useraccount's UID
        output: get patient's information.
    */
    GetPatient: function(data, transaction) {
        var attributes = [];
        if (data.attributes) {
            if (data.attributes.length > 0) {
                for (var i = 0; i < data.attributes.length; i++) {
                    attributes[i] = data.attributes[i].field;
                };
            } else {
                attributes = defaultAtrributes;
            }
        } else {
            attributes = defaultAtrributes;
        }
        return Services.UserAccount.GetUserAccountDetails(data)
            .then(function(user) {
                //check if UserAccount is found in table UserAccount, get UserAccountID to find patient
                if (check.checkData(user)) {
                    // return Patient.findAll({
                    //     where: {
                    //         UserAccountID : user.ID
                    //     },
                    //     transaction:transaction,
                    //     attributes:attributes,
                    //     include: [
                    //          {
                    //             model: UserAccount,
                    //             attributes: ['PhoneNumber','Email','ID','UID','Enable'],
                    //             required: true,
                    //             include: [
                    //                 {
                    //                     model: FileUpload,
                    //                     attributes: ['ID','UID','FileType'],
                    //                     required: false,
                    //                     where:{
                    //                         FileType:{$in: ['ProfileImage', 'Signature']},
                    //                         Enable:'Y'
                    //                     },
                    //                     // order:['CreatedDate ASC']
                    //                 }
                    //             ],
                    //             order:[[FileUpload,'CreatedDate','ASC']]
                    //         },
                    //         {
                    //             model:Country,
                    //             as:'Country1',
                    //             attributes:['ShortName'],
                    //             required:false
                    //         }
                    //     ],

                    // });
                    return UserAccount.findOne({
                        where: {
                            ID: user.ID
                        },
                        transaction: transaction,
                        attributes: ['PhoneNumber', 'Email', 'ID', 'UID', 'Enable'],
                        include: [{
                            model: Patient,
                            attributes: attributes,
                            required: true,
                            include: [{
                                model: Country,
                                as: 'Country1',
                                attributes: ['ShortName'],
                                required: false
                            }]
                        }, {
                            model: FileUpload,
                            attributes: ['ID', 'UID', 'FileType'],
                            required: false,
                            where: {
                                FileType: { $in: ['ProfileImage', 'Signature'] },
                                Enable: 'Y'
                            },
                            // order:['CreatedDate ASC']
                        }],
                        order: [
                            [FileUpload, 'CreatedDate', 'DESC']
                        ]
                    });
                } else {
                    return null;
                }
            }, function(err) {
                throw err;
            });
    },

    /*
        DetailPatient: service get patient detail by patient's UID
        input: Patient's UID
        output: get patient's detail
    */
    DetailPatient: function(data) {
        var returnData;
        return Patient.findAll({
                where: {
                    UID: data.UID
                },

                include: [{
                    model: UserAccount,
                    attributes: ['PhoneNumber', 'Email', 'ID', 'UID', 'Enable','Activated'],
                    required: true,
                    include: [{
                        model: RelUserRole,
                        attributes: ['RoleId'],
                        required: false
                    }]
                }, {
                    model: Country,
                    as: 'Country1',
                    attributes: ['ShortName'],
                    required: false

                }, {
                    model: Company,
                    through:{
                        where:{Active:'Y'}
                    },
                    required:false
                }]
            })
            .then(function(result) {
                returnData = result;
                return TelehealthUser.findAll({
                    where: {
                        UserAccountID: result[0].UserAccountID
                    }
                });
                // return result;
            }, function(err) {
                throw err;
            })
            .then(function(success) {
                if (success != null && success != "" && success.length != 0){
                    returnData[0].dataValues.TeleUID = success ? success[0].UID : null;
                    returnData[0].dataValues.TeleID = success ? success[0].ID : null;
                }
                return returnData;
            }, function(err) {
                throw err;
            });
    },

    /*
        LoadListPatient : service get list patient
        input: amount patient
        output: get list patient from table Patient
    */
    LoadListPatient: function(data, transaction) {
        var FirstName = '',
            LastName = '';
        var isConcat = false;
        var attributes = [];
        if (data.attributes != undefined && data.attributes != null && data.attributes != '' && data.attributes.length != 0) {
            for (var i = 0; i < data.attributes.length; i++) {
                if (data.attributes[i].field != 'UserAccount') {
                    attributes.push(data.attributes[i].field);
                }
            };
            attributes.push("UID");
        } else {
            attributes = defaultAtrributes;
        }
        var whereClause = Services.Patient.whereClause(data);
        if (data.Search) {
            if (data.Search.FirstName != '' && data.Search.LastName != '' && data.Search.FirstName != undefined && data.Search.LastName != undefined) {
                FirstName = data.Search.FirstName;
                LastName = data.Search.LastName;
                isConcat = true;
            }
        }
        return Patient.findAndCountAll({
                include: [{
                    model: UserAccount,
                    attributes: ['PhoneNumber', 'Enable','Activated'],
                    required: true,
                    include: [{
                        include: [{
                            model: Role,
                            attributes: ['RoleName'],
                            required: false,
                        }],
                        model: RelUserRole,
                        attributes: ['RoleId'],
                        where: {
                            RoleId: { in : [3] }
                        },
                        required: false,

                    }],
                    where: {
                        $or: whereClause.UserAccount
                    }
                }],
                attributes: attributes,
                limit: data.limit,
                offset: data.offset,
                order: data.order,
                where: {
                    $and: [
                        whereClause.Patient,
                        isConcat ? Sequelize.where(Sequelize.fn("concat", Sequelize.col("Patient.FirstName"), ' ', Sequelize.col("Patient.LastName")), {
                            like: '%' + FirstName + ' ' + LastName + '%'
                        }) : null,
                    ]

                },
                transaction: transaction
            })
            .then(function(result) {
                return result;

            }, function(err) {
                throw err;
            });
    },

    /*
        CheckPatient : service check patient has created ?
        input  : patient's PhoneNumber
        output : return object that contain information patient
                 is created or not created
    */
    CheckPatient: function(data, transaction) {
        var fieldData = {};
        var info = {};
        // return Services.Patient.validation(data,false)
        // .then(function(success){
        if (check.checkData(data.PhoneNumber) && check.checkData(data.Email)) {
            var userinfo = {
                phoneNumber: null,
                Email: null
            };
            data.PhoneNumber = data.PhoneNumber.substr(0, 3) == "+61" ? data.PhoneNumber : check.parseAuMobilePhone(data.PhoneNumber);
            return UserAccount.findAll({
                    where: {
                        $or: {
                            PhoneNumber: data.PhoneNumber,
                            Email: data.Email
                        }
                    }
                })
                .then(function(user) {
                    if (user == null || user == '') {
                        return ({
                            isCreated: false

                        });
                    } else {
                        var stringID = [];
                        for (var i = 0; i < user.length; i++) {
                            if (user[i].PhoneNumber == data.PhoneNumber) {
                                userinfo.PhoneNumber = user[i].PhoneNumber;
                            } else if (user[i].Email == data.Email) {
                                userinfo.Email = user[i].Email;
                            }
                            stringID.push(user[i].ID);
                        }
                        return Patient.findAll({
                                where: {
                                    UserAccountID: {
                                        $in: stringID
                                    }
                                },
                            })
                            .then(function(result) {
                                if (result.isCreated == false) {
                                    return ({
                                        isCreated: false,
                                        data: {
                                            Email: info.Email,
                                            PhoneNumber: info.PhoneNumber
                                        }
                                    });
                                } else {
                                    if (result.length == 0) {
                                        return ({ isCreated: false });
                                    } else {
                                        for (var i = 0; i <= result.length; i++) {
                                            if (i == result.length) {
                                                if (fieldData != null && fieldData != '') {
                                                    return ({
                                                        isCreated: true,
                                                        field: fieldData
                                                    });
                                                }
                                            } else {
                                                for (var key in userinfo) {
                                                    if (userinfo.PhoneNumber == check.parseAuMobilePhone(data.PhoneNumber)) {
                                                        fieldData.PhoneNumber = true;
                                                    }
                                                    if (userinfo.Email == data.Email) {
                                                        fieldData.Email = true;
                                                    }

                                                }
                                            }
                                        }
                                    }
                                }
                            }, function(err) {
                                throw err;
                            })
                    }
                }, function(err) {
                    throw err;
                })
        } else if (check.checkData(data.PhoneNumber)) {
            // data.PhoneNumber = data.PhoneNumber.substr(0,3)=="+61"?data.PhoneNumber:"+61"+data.PhoneNumber;
            return Services.UserAccount.FindByPhoneNumber(data.PhoneNumber, transaction)
                .then(function(user) {
                    if (check.checkData(user)) {
                        info.Email = user[0].Email;
                        info.PhoneNumber = user[0].PhoneNumber;
                        return Patient.findAll({
                            where: {
                                UserAccountID: user[0].ID
                            },
                            transaction: transaction
                        });

                    } else
                        return ({
                            isCreated: false
                        });
                }, function(err) {
                    throw err;
                })
                .then(function(result) {
                    if (check.checkData(result) && result.isCreated !== false) {
                        return ({
                            isCreated: true,
                            field: { PhoneNumber: true }
                        });
                    } else
                        return ({
                            isCreated: false,
                            data: {
                                Email: info.Email,
                                PhoneNumber: info.PhoneNumber
                            }
                        });
                }, function(err) {
                    throw err;
                });
        } else if (check.checkData(data.Email)) {
            // data.PhoneNumber = data.PhoneNumber.substr(0,3)=="+61"?data.PhoneNumber:"+61"+data.PhoneNumber;
            return Services.UserAccount.GetUserAccountDetails(data, null, transaction)
                .then(function(user) {
                    if (check.checkData(user)) {
                        info.Email = user.Email;
                        info.PhoneNumber = user.PhoneNumber;
                        return Patient.findAll({
                            where: {
                                UserAccountID: user.ID
                            },
                            transaction: transaction
                        });

                    } else
                        return ({
                            isCreated: false
                        });
                }, function(err) {
                    throw err;
                })
                .then(function(result) {
                    if (check.checkData(result) && result.isCreated !== false) {
                        return ({
                            isCreated: true,
                            field: { Email: true }
                        });
                    } else
                        return ({
                            isCreated: false,
                            data: {
                                Email: info.Email,
                                PhoneNumber: info.PhoneNumber
                            }
                        });
                }, function(err) {
                    throw err;
                });
        } else {
            var error = new Error("CheckPatient.error");
            error.pushErrors("invalid.params");
            throw error;
        }
    },


    /*
        getfileUID : service get patient's fileUID
        input  : data like
                    "data": {
                        "UserAccountID":"000",
                        "FileType":"aaa"
                    }
        output : return fileUID if where clause true
    */
    getfileUID: function(data) {
        if (check.checkData(data.UserAccountID)) {
            return FileUpload.findAll({
                attributes: ['UserAccountID', 'UID'],
                where: {
                    UserAccountID: data.UserAccountID,
                    FileType: data.FileType,
                    Enable: 'Y'
                }
            });
        }
    },


    SearchPatient: function(whereClause, transaction) {

        var UserAccountWhereClause = {};
        if ('PhoneNumber' in whereClause) {
            var PhoneNumber = whereClause.PhoneNumber[0] == '0' ? '+61' + whereClause.PhoneNumber.substr(1, whereClause.PhoneNumber.length) : whereClause.PhoneNumber;
            UserAccountWhereClause.PhoneNumber = PhoneNumber;
            delete whereClause['PhoneNumber'];
        }
        if (whereClause.Email1 == null || whereClause.Email1 == '') {
            delete whereClause['Email1'];
        } else {
            UserAccountWhereClause.Email = whereClause.Email1;
            delete whereClause['Email1'];
        }
        return Patient.findOne({
                include: [{
                    model: UserAccount,
                    attributes: ['PhoneNumber', 'UID'],
                    required: true,
                    where: UserAccountWhereClause
                }],
                where: whereClause
            })
            .then(function(result) {
                return result;
            }, function(err) {
                throw err;
            })
    },

    AddChild: function(data) {
        if (data.model == null || data.model == '') {
            var err = new Error('AddChild.error');
            err.pushError('model.invalid');
            throw err;
        } else {
            var model = sequelize.models[data.model];
            return sequelize.transaction()
                .then(function(t) {
                    data.data.UID = UUIDService.Create();
                    return model.create(data.data, { transaction: t })
                        .then(function(created_model) {
                            if (created_model == null || created_model == '') {
                                var err = new Error('AddChild.error');
                                err.pushError('CreateModel.Error');
                                throw err;
                            } else {
                                t.commit();
                                return created_model;
                            }
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                }, function(err) {
                    throw err;
                });
        }
    },

    ChangeStatusChild: function(data) {
        if (data == null || data == '') {
            var err = new Error('ChangeStatusChild.error');
            err.pushError('data.invalid');
            throw err;
        } else {
            var model = sequelize.models[data.model];
            console.log('????????????????????????????????? ', sequelize.models);
            return sequelize.transaction()
                .then(function(t) {
                    var ID = data.data.ID;
                    delete data.data['ID'];
                    return model.update(data.data, {
                            where: {
                                ID: ID
                            },
                            transaction: t
                        })
                        .then(function(updated_model) {
                            if (updated_model == null || updated_model == '') {
                                var err = new Error('ChangeStatusChild.error');
                                err.pushError('UpdateModel.Error');
                                throw err;
                            } else {
                                t.commit();
                                return updated_model;
                            }
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                }, function(err) {
                    throw err;
                });
        }
    },

    DetailChild: function(data) {
        var postData = {};
        if (!data.model) {
            var err = new Error('DetailChild.error');
            err.pushError('model.invalid');
            throw err;
        }
        if (!data.UID) {
            var err = new Error('DetailChild.error');
            err.pushError('patientUID.invalid');
            throw err;
        }
        return Patient.findOne({
                where: {
                    UID: data.UID
                }
            })
            .then(function(got_patient) {
                if (!got_patient) {
                    var err = new Error('DetailChild.error');
                    err.pushError('patient.notFound');
                    throw err;
                } else {
                    return sequelize.Promise.each(data.model, function(modelName, index) {
                            return sequelize.models[modelName].findAll({
                                where: {
                                    $and: data.where ? data.where : null,
                                    PatientID: got_patient.ID,
                                },
                                limit: data.limit ? data.limit : null,
                                offset: data.offset ? data.offset : null,
                            })
                            .then(function(got_model) {
                                postData[modelName] = got_model;
                            }, function(err) {
                                throw err;
                            });
                        })
                        .then(function(result) {
                            return result;
                        }, function(err) {
                            throw err;
                            console.log(err);
                        })
                }
            }, function(err) {
                console.log(err);
                throw err;
            })
            .then(function(result) {
                return postData;
            }, function(err) {
                throw err;
            });
    },

    SendEmailWhenLinked: function(data) {
        var patient, payload, token;
        if(!data) {
            var err = new Error("SendEmailWhenLinked.error");
            err.pushError('notFoundParams');
            throw err;
        }

        if(!data.patientUID) {
            var err = new Error("SendEmailWhenLinked.error");
            err.pushError('patientUID.invalid');
            throw err;
        }

        if(!data.type) {
            var err = new Error("SendEmailWhenLinked.error");
            err.pushError('typeParams.notFound');
            throw err;
        }

        if(!data.to) {
            var err = new Error("SendEmailWhenLinked.error");
            err.pushError('toParams.notFound');
            throw err;
        }

        function CreatePromiseSendMail(type, data) {
            var p1 = new Promise(function(a, b) {
                SendMailService.SendMail(type, data, function(err, responseStatus, html, text) {
                    console.log("err ",err);
                    if(err) {
                        b(err);
                    }
                    else {
                        a({message:'success'});
                    }
                });
            });
            return p1;
        }

        var p = new Promise(function(a, b) {
            var NewPassword;
            sequelize.transaction()
            .then(function(t) {
                Patient.findOne({
                    attributes:['ID','UserAccountID','FirstName','LastName','Email1','Email2'],
                    include:[
                        {
                            model:UserAccount,
                            attributes:['ID','UID','UserName','Email','Password','PhoneNumber'],
                            required:true,
                        },
                    ],
                    where: {
                        UID : data.patientUID,
                    },
                    transaction: t
                })
                .then(function(got_patient) {
                    if(got_patient == null || got_patient == '') {
                        var err = new Error('SendEmailWhenLinked.error');
                        err.pushError('notFound.Patient');
                        throw err;
                    }
                    else {
                        patient = got_patient;
                        NewPassword = generatePassword(6, false, /^[A-Za-z0-9]$/);
                        return UserAccount.update({Password : NewPassword},{
                            transaction: t,
                            where: { ID : patient.UserAccountID}
                        });
                    }
                }, function(err) {
                    throw err;
                })
                .then(function(updated_user){
                    if(updated_user == '' || updated_user == null) {
                        var err = new Error('SendEmailWhenLinked.error');
                        err.pushError('updatePassword.queryError');
                        throw err;
                    }
                    else {
                        if(data.type == 'PreEmployment') {
                            var promise_arr = [];
                            patient.UserAccount.Password = NewPassword;
                            for(var i = 0; i < data.to.length; i++) {
                                var emailInfo = {
                                    // from     : data.from,
                                    from     : 'Redimed <giangvotest2511@gmail.com>',
                                    userInfo : patient.UserAccount,
                                    email    : data.to[i],
                                    subject  : data.subject,
                                    url      : config.url,
                                };
                                var promise = CreatePromiseSendMail(data.type, emailInfo);
                                promise_arr.push(promise);
                            }
                            Promise.all(promise_arr)
                            .then(function(values) {
                                console.log('values ',values)
                                t.commit();
                                a(values);
                            }, function(err) {
                                t.rollback();
                                b(err);
                            });
                        }
                    }
                },function(err){
                    t.rollback();
                    b(err);
                });

            }, function(err) {
                b(err);
            })
        });

        return p;
        
    },

    UpdateSignature: function(data) {
        if(!data) {
            var err = new Error('UpdateSignature.error');
            err.pushError('notFoundParams');
            throw err;
        }
        if(!data.Signature) {
            var err = new Error('UpdateSignature.error');
            err.pushError('notFoundParams.Signature');
            throw err;
        }
        if(!data.FileUID) {
            var err = new Error('UpdateSignature.error');
            err.pushError('notFoundParams.FileUID');
            throw err;
        }
        if(!data.PatientUID) {
            var err = new Error('UpdateSignature.error');
            err.pushError('notFoundParams.PatientUID');
            throw err;
        }
        var p = new Promise(function(a, b) {
            var patient;
            sequelize.transaction()
            .then(function(t) {
                Patient.findOne({
                    attributes: ['ID','UID','FirstName','LastName'],
                    include:[
                        {
                            model: UserAccount,
                            attributes:['ID','UID','UserName'],
                            required:true,
                        },
                    ],
                    where: {
                        UID : data.PatientUID,
                        Enable: 'Y',
                    },
                    transaction: t,
                })
                .then(function(got_patient){
                    if(got_patient == null || got_patient == '') {
                        var err = new Error('UpdateSignature.error');
                        err.pushError('notFound.Patient');
                        throw err;
                    }
                    else {
                        patient = got_patient;
                        return Patient.update({Signature: data.Signature},{
                            where: {
                                UID: data.PatientUID,
                                Enable: 'Y',
                            },
                            transaction: t,
                        });
                    }
                }, function(err) {
                    throw err;
                })
                .then(function(updated_patient) {
                    return FileUpload.update({Enable:'N'},{
                        where: {
                            UserAccountID: patient.UserAccount.ID,
                            FileType:'Signature',
                        },
                        transaction: t,
                    });
                }, function(err) {
                    throw err;
                })
                .then(function(updated_fileUpload) {
                    return FileUpload.findOne({
                        attributes:['ID','UID','FileType'],
                        where: {
                            UID : data.FileUID,
                        },
                        transaction: t,
                    });
                }, function(err) {
                    throw err;
                })
                .then(function(found_file) {
                    if(found_file == '' || found_file == null) {
                        var err = new Error('UpdateSignature.error');
                        err.pushError('notFound.Signature');
                        throw err;
                    }
                    else {
                        return FileUpload.update({
                            UserAccountID : patient.UserAccount.ID,
                            Enable: 'Y',
                        },{
                            where :{
                                UID : data.FileUID
                            },
                            transaction: t
                        });
                    }
                }, function(err) {
                    throw err;
                })
                .then(function(finish) {
                    t.commit();
                    a(finish);
                }, function(err) {
                    t.rollback();
                    b(err);
                })
            }, function(err) {
                b(err);  
            })
        });

        return p;
    },

    UpdateEFormAppointment: function(data) {
        if(!data) {
            var err = new Error('UpdateEFormAppointment.error');
            err.pushError('notFoundParams');
            throw err;
        }
        if(!data.PatientUID) {
            var err = new Error('UpdateEFormAppointment.error');
            err.pushError('notFoundParams.PatientUID');
            throw err;
        }
        if(!data.ApptUID) {
            var err = new Error('UpdateEFormAppointment.error');
            err.pushError('notFoundParams.ApptUID');
            throw err;
        }
        var p = new Promise(function(a, b) {
            var patient, appointment;
            sequelize.transaction()
            .then(function(t) {

                Patient.findOne({
                    attributes: ['ID','UID','UserAccountID','FirstName','LastName'],
                    where : {
                        UID : data.PatientUID,
                    },
                    transaction : t
                })
                .then(function(got_patient) {
                    if(got_patient == null || got_patient == '') {
                        var err = new Error('UpdateEFormAppointment.error');
                        err.pushError('notFound.Patient');
                        throw err;
                    }
                    else {
                        patient = got_patient;
                        return Appointment.findOne({
                            attributes: ['ID','UID','Code'],
                            where : {
                                UID : data.ApptUID,
                            },
                            transaction : t,
                        });
                    }
                }, function(err) {
                    throw err;
                })
                .then(function(got_appt) {
                    if(got_appt == null || got_appt == '') {
                        var err = new Error('UpdateEFormAppointment.error');
                        err.pushError('notFound.Appointment');
                        throw err;
                    }
                    else {
                        appointment = got_appt;
                        return RelPatientAppointment.findOne({
                            where : {
                                PatientID     : patient.ID,
                                AppointmentID : appointment.ID,
                            },
                            transaction : t,
                        });
                    }
                }, function(err) {
                    throw err;
                })
                .then(function(got_relApptPatient) {
                    if(got_relApptPatient == null || got_relApptPatient == '') {
                        var err = new Error('UpdateEFormAppointment.error');
                        err.pushError('Patient.hasNot.relationship.Appointment');
                        throw err;
                    }
                    else {
                        return appointment.getEForms();
                    }
                }, function(err) {
                    throw err;
                })
                .then(function(got_eform) {
                    if(got_eform == null || got_eform == '' || got_eform.length == 0) {
                        return got_eform;
                    }
                    else {
                        var eform_id = [];
                        for(var i = 0; i < got_eform.length; i++) {
                            eform_id.push(got_eform[i].ID);
                        }
                        return RelEFormPatient.update({
                            PatientID : patient.ID,
                        },{
                            where :{
                                EFormID : {$in : eform_id},
                            },
                            transaction : t,
                        });
                    }
                }, function(err) {
                    throw err;
                })
                .then(function(updated_eform) {
                    t.commit();
                    a(updated_eform);
                }, function(err) {
                    t.rollback();
                    b(err);
                })

            }, function(err) {
                b(err);
            });
        });
        
        return p;
    }

};
