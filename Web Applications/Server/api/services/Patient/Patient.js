var $q = require('q');
var config = sails.config.myconf;
var secret = 'ewfn09qu43f09qfj94qf*&H#(R';
//moment
var moment = require('moment');
var check  = require('../HelperService');
var twilioClient = require('twilio')(config.twilioSID, config.twilioToken);
function SendSMS(toNumber, content, callback) {

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
    validation : function(data,type) {
        var character = new RegExp(check.regexPattern.character);
        var address   = new RegExp(check.regexPattern.address);
        var postcode  = new RegExp(check.regexPattern.postcode);
        var isCreate = type==true?true:false;
        var q = $q.defer();
        var errors = [];
        //create a error with contain a list errors input
        var err = new Error("ERRORS");
        if(type==true){
            try {
                // validate FirstName
                if(data.FirstName!=undefined && data.FirstName){
                    if(data.FirstName.length < 0 || data.FirstName.length > 50){
                        errors.push({field:"FirstName",message:"max length"});
                        err.pushErrors(errors);
                    }
                    if(!character.test(data.FirstName)){
                        errors.push({field:"FirstName",message:"invalid value"});
                        err.pushErrors(errors);
                    }
                }
                else{
                    errors.push({field:"FirstName",message:"required"});
                    err.pushErrors(errors);
                }

                //validate MiddleName
                if(data.MiddleName!=undefined && data.MiddleName){
                    if(data.MiddleName.length < 0 || data.MiddleName.length > 100){
                        errors.push({field:"MiddleName",message:"max length"});
                        err.pushErrors(errors);
                    }
                    if(!character.test(data.MiddleName)){
                        errors.push({field:"MiddleName",message:"invalid value"});
                        err.pushErrors(errors);
                    }
                }

                //validate LastName
                if(data.LastName!=undefined && data.LastName){
                    if(data.LastName.length < 0 || data.LastName.length > 50){
                        errors.push({field:"LastName",message:"max length"});
                        err.pushErrors(errors);
                    }
                    if(!character.test(data.LastName)){
                        errors.push({field:"LastName",message:"invalid value"});
                        err.pushErrors(errors);
                    }
                }
                else{
                    errors.push({field:"LastName",message:"required"});
                    err.pushErrors(errors);
                }

                //validate Gender
                if(data.Gender!=undefined && data.Gender){
                    if(data.Gender != "Female" && data.Gender != "Male" && data.Gender != "Other"){
                        errors.push({field:"Gender",message:"invalid value"});
                        err.pushErrors(errors);
                    }
                }
                else{
                    errors.push({field:"Gender",message:"required"});
                    err.pushErrors(errors);
                }

                //validate Address1
                if(data.Address1!=undefined && data.Address1){
                    if(data.Address1.length < 0 || data.Address1.length > 255){
                        errors.push({field:"Address1",message:"max length"});
                        err.pushErrors(errors);
                    }
                    if(!address.test(data.Address1)){
                        errors.push({field:"Address1",message:"invalid value"});
                        err.pushErrors(errors);
                    }
                }
                else{
                    errors.push({field:"Address1",message:"required"});
                    err.pushErrors(errors);
                }

                //validate Address2
                if(data.Address2!=undefined && data.Address2){
                    if(data.Address2.length < 0 || data.Address2.length > 255){
                        errors.push({field:"Address2",message:"max length"});
                        err.pushErrors(errors);
                    }
                    if(!address.test(data.Address2)){
                        errors.push({field:"Address2",message:"invalid value"});
                        err.pushErrors(errors);
                    }
                }

                //validate DOB
                if(data.DOB!=undefined && data.DOB){
                    if(data.DOB!=null || data.DOB!=""){
                        if(!/^(\d{1,2})[/](\d{1,2})[/](\d{4})/.test(data.DOB)){
                            errors.push({field:"DOB",message:"invalid value"});
                            err.pushErrors(errors);
                        }
                    }
                }
                else{
                    errors.push({field:"DOB",message:"required"});
                    err.pushErrors(errors);
                }

                //validate Occupation
                if(data.Occupation!=undefined && data.Occupation){
                    if(data.Occupation.length < 0 || data.Occupation.length > 255){
                        errors.push({field:"Occupation",message:"max length"});
                        err.pushErrors(errors);
                    }
                    if(!character.test(data.Occupation)){
                        errors.push({field:"Occupation",message:"invalid value"});
                        err.pushErrors(errors);
                    }
                }

                //validate Suburb
                if(data.Suburb!=undefined && data.Suburb){
                    if(data.Suburb.length < 0 || data.Suburb.length > 100){
                        errors.push({field:"Suburb",message:"max length"});
                        err.pushErrors(errors);
                    }
                }

                //validate Postcode
                if(data.Postcode!=undefined && data.Postcode){
                    if(data.Postcode.length < 0 || data.Postcode.length > 100){
                        errors.push({field:"Postcode",message:"max length"});
                        err.pushErrors(errors);
                    }
                    if(!postcode.test(data.Postcode)){
                        errors.push({field:"Postcode",message:"invalid value"});
                        err.pushErrors(errors);
                    }
                }
                else{
                    errors.push({field:"Postcode",message:"required"});
                    err.pushErrors(errors);
                }

                //validate Email1
                if(data.Email1!=undefined && data.Email1){
                    var EmailPattern1=new RegExp(check.regexPattern.email);
                    if(!EmailPattern1.test(data.Email1)){
                        errors.push({field:"Email1",message:"invalid value"});
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
                if(data.State!=undefined && data.State){
                    if(data.State.length < 0 || data.State.length > 255){
                        errors.push({field:"State",message:"max length"});
                        err.pushErrors(errors);
                    }
                    if(!character.test(data.State)){
                        errors.push({field:"State",message:"invalid value"});
                        err.pushErrors(errors);
                    }
                }
                else{
                    errors.push({field:"State",message:"required"});
                    err.pushErrors(errors);
                }

                if(data.Title!=undefined && data.Title){
                    if(data.Title!= 'Dr' && data.Title!= 'Ms' && 
                        data.Title!= 'Mr' && data.Title!= 'Mrs'){
                        errors.push({field:"Title",message:"invalid value"});
                        err.pushErrors(errors);
                    }
                }
                else{
                    errors.push({field:"Title",message:"required"});
                    err.pushErrors(errors);
                }

                //validate HomePhoneNumber? hoi a Tan su dung exception
                if(data.HomePhoneNumber!=undefined && data.HomePhoneNumber){
                    var auHomePhoneNumberPattern=new RegExp(check.regexPattern.auHomePhoneNumber);
                    var HomePhone=data.HomePhoneNumber.replace(check.regexPattern.phoneExceptChars,'');
                    if(!auHomePhoneNumberPattern.test(HomePhone)){
                        errors.push({field:"HomePhoneNumber",message:"invalid value"});
                        err.pushErrors(errors);
                        throw err;
                    }
                }

                //validate HomePhoneNumber? hoi a Tan su dung exception
                if(data.WorkPhoneNumber!=undefined && data.WorkPhoneNumber){
                    var auWorkPhoneNumberPattern=new RegExp(check.regexPattern.auHomePhoneNumber);
                    var WorkPhoneNumber=data.WorkPhoneNumber.replace(check.regexPattern.phoneExceptChars,'');
                    if(!auWorkPhoneNumberPattern.test(WorkPhoneNumber)){
                        errors.push({field:"WorkPhoneNumber",message:"invalid value"});
                        err.pushErrors(errors);
                        throw err;
                    }
                }

                if(err.getErrors().length>0){
                    throw err;
                }

                else{
                    q.resolve({status:'success'});
                }
                //q.resolve({status:'success'});

            }
            catch(err){
                q.reject(err);
            }
        }
        else{
            try {
                // validate FirstName
                if('FirstName' in data){
                    if(data.FirstName){
                        if(data.FirstName.length < 0 || data.FirstName.length > 50){
                            errors.push({field:"FirstName",message:"max length"});
                            err.pushErrors(errors);
                        }
                        if(!character.test(data.FirstName)){
                            errors.push({field:"FirstName",message:"invalid value"});
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate MiddleName
                if('MiddleName' in data){
                    if(data.MiddleName){
                        if(data.MiddleName.length < 0 || data.MiddleName.length > 100){
                            errors.push({field:"MiddleName",message:"max length"});
                            err.pushErrors(errors);
                        }
                        if(!character.test(data.MiddleName)){
                            errors.push({field:"MiddleName",message:"invalid value"});
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate LastName
                if('LastName' in data){
                    if(data.LastName){
                        if(data.LastName.length < 0 || data.LastName.length > 50){
                            errors.push({field:"LastName",message:"max length"});
                            err.pushErrors(errors);
                        }
                        if(!character.test(data.LastName)){
                            errors.push({field:"LastName",message:"invalid value"});
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate Gender
                if('Gender' in data){
                    if(data.Gender){
                        if(data.Gender != "Female" && data.Gender != "Male" && data.Gender != "Other"){
                            errors.push({field:"Gender",message:"invalid value"});
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate Address1
                if('Address1' in data){
                    if(data.Address1){
                        if(data.Address1.length < 0 || data.Address1.length > 255){
                            errors.push({field:"Address1",message:"max length"});
                            err.pushErrors(errors);
                        }
                        if(!address.test(data.Address1)){
                            errors.push({field:"Address1",message:"invalid value"});
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate Address2
                if('Address2' in data){
                    if(data.Address2){
                        if(data.Address2.length < 0 || data.Address2.length > 255){
                            errors.push({field:"Address2",message:"max length"});
                            err.pushErrors(errors);
                        }
                        if(!address.test(data.Address2)){
                            errors.push({field:"Address2",message:"invalid value"});
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate DOB
                if('DOB' in data){
                    if(data.DOB){
                        if(data.DOB!=null || data.DOB!=""){
                            if(!/^(\d{1,2})[/](\d{1,2})[/](\d{4})/.test(data.DOB)){
                                errors.push({field:"DOB",message:"invalid value"});
                                err.pushErrors(errors);
                            }
                        }
                    }
                }

                //validate Occupation
                if('Occupation' in data){
                    if(data.Occupation){
                        if(data.Occupation.length < 0 || data.Occupation.length > 255){
                            errors.push({field:"Occupation",message:"max length"});
                            err.pushErrors(errors);
                        }
                        if(!character.test(data.Occupation)){
                            errors.push({field:"Occupation",message:"invalid value"});
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate Suburb
                if('Suburb' in data){
                    if(data.Suburb){
                        if(data.Suburb.length < 0 || data.Suburb.length > 100){
                            errors.push({field:"Suburb",message:"max length"});
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate Postcode
                if('Postcode' in data){
                    if(data.Postcode){
                        if(data.Postcode.length < 0 || data.Postcode.length > 100){
                            errors.push({field:"Postcode",message:"max length"});
                            err.pushErrors(errors);
                        }
                        if(!postcode.test(data.Postcode)){
                            errors.push({field:"Postcode",message:"invalid value"});
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate Email1
                if('Email1' in data){
                    if(data.Email1){
                        var EmailPattern1=new RegExp(check.regexPattern.email);
                        if(!EmailPattern1.test(data.Email1)){
                            errors.push({field:"Email1",message:"invalid value"});
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
                if('State' in data){
                    if(data.State){
                        if(data.State.length < 0 || data.State.length > 255){
                            errors.push({field:"State",message:"max length"});
                            err.pushErrors(errors);
                        }
                        if(!character.test(data.State)){
                            errors.push({field:"State",message:"invalid value"});
                            err.pushErrors(errors);
                        }
                    }
                }

                if('Title' in data){
                    if(data.Title){
                        if(data.Title!= 'Dr' && data.Title!= 'Ms' && 
                            data.Title!= 'Mr' && data.Title!= 'Mrs'){
                            errors.push({field:"Title",message:"invalid value"});
                            err.pushErrors(errors);
                        }
                    }
                }

                //validate HomePhoneNumber? hoi a Tan su dung exception
                if('HomePhoneNumber' in data){
                    if(data.HomePhoneNumber){
                        var auHomePhoneNumberPattern=new RegExp(check.regexPattern.auHomePhoneNumber);
                        var HomePhone=data.HomePhoneNumber.replace(check.regexPattern.phoneExceptChars,'');
                        if(!auHomePhoneNumberPattern.test(HomePhone)){
                            errors.push({field:"HomePhoneNumber",message:"invalid value"});
                            err.pushErrors(errors);
                            throw err;
                        }
                    }
                }

                //validate HomePhoneNumber? hoi a Tan su dung exception
                if('WorkPhoneNumber' in data){
                    if(data.WorkPhoneNumber){
                        var auWorkPhoneNumberPattern=new RegExp(check.regexPattern.auHomePhoneNumber);
                        var WorkPhoneNumber=data.WorkPhoneNumber.replace(check.regexPattern.phoneExceptChars,'');
                        if(!auWorkPhoneNumberPattern.test(WorkPhoneNumber)){
                            errors.push({field:"WorkPhoneNumber",message:"invalid value"});
                            err.pushErrors(errors);
                            throw err;
                        }
                    }
                }

                if(err.getErrors().length>0){
                    throw err;
                }

                else{
                    q.resolve({status:'success'});
                }
                //q.resolve({status:'success'});

            }
            catch(err){
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
    whereClause : function(data) {
        // define whereClause's data
        var whereClause = {};
        //create patient's object in whereClause's data that puts all information to filter in patient table
        whereClause.Patient = {};
        //create UserAccount's object in whereClause's data that puts all information to filter in useraccount table
        whereClause.UserAccount ={};
        if(check.checkData(data.Search)){
            if(data.Search.FirstName){
                whereClause.Patient.FirstName={
                    like:'%'+data.Search.FirstName+'%'
                } 
            }
            if(data.Search.MiddleName){
                whereClause.Patient.MiddleName = {
                    like:'%'+data.Search.MiddleName+'%'
                }
            }
            if(data.Search.LastName){
                whereClause.Patient.LastName = {
                    like:'%'+data.Search.LastName+'%'
                }
            }
            if(data.Search.Gender){
                whereClause.Patient.Gender = {
                    like:'%'+data.Search.Gender+'%'
                }
            }
            if(data.Search.Email1){
                whereClause.Patient.Email1 = {
                    like:'%'+data.Search.Email1+'%'
                }
            }
            if(data.Search.Email2){
                whereClause.Patient.Email2 = {
                    like:'%'+data.Search.Email2+'%'
                }
            }
            if(data.Search.Enable){
                whereClause.UserAccount.Enable = {
                    like:'%'+data.Search.Enable+'%'
                }
            }
            if(data.Search.PhoneNumber){
                if(data.Search.PhoneNumber[0]=='0'){
                    data.Search.PhoneNumber = data.Search.PhoneNumber.substr(1,data.Search.PhoneNumber.length);
                }
                whereClause.UserAccount.PhoneNumber = {
                    like:'%'+data.Search.PhoneNumber+'%'
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
    sendMail : function(data, transaction, fn) {
        return UserAccount.findOne({
            where : {
                Email : data.Email
            },
            transaction : transaction
        })
        .then(function(result){
            console.log('````````````````````````````````````` ',result);
            if(result!=null && result!=""){
                data.UID = result.UID;
                return Services.UserAccount.sendMail(data,secret,transaction,function(err, responseStatus, html, text){
                    console.log("toi day ???");
                    if(err){
                        console.log("loi~");
                        transaction.rollback();
                        fn(err);
                    }
                    else{
                        fn(null);
                    }
                });
            }
            else {
                var err = new Error("sendMail");
                err.pushError("Email.notFound");
                fn(err);
            }
        },function(err){
            transaction.rollback();
            fn(err);
        });
    },

    sendSMS: function(data, transaction ,fn) {
        data.PhoneNumber = check.parseAuMobilePhone(data.PhoneNumber);
        return UserAccount.findOne({
            where : {
                PhoneNumber : data.PhoneNumber
            },
            transaction : transaction
        })
        .then(function(result){
            if(result != null && result != ""){
                var phoneNumber = typeof data.PhoneNumber != 'undefined' ? data.PhoneNumber : null;
                var content = result.PinNumber;
                // var phoneRegex = /^\+[0-9]{9,15}$/;
                if (phoneNumber != null && content != null) {
                    return SendSMS(phoneNumber, content, function(err, message) {
                        if (err) {
                            transaction.rollback();
                            fn(err);
                        }
                        else {
                            fn(null);
                        }
                    });
                }else fn('error');
            }
            else {
                var err = new Error("sendSMS");
                err.pushError("PhoneNumber.notFound");
                fn(err);
            }
        },function(err){
            transaction.rollback();
            fn(err);
        });
    },

    /*
        CreatePatient : service create patient
        input: Patient's information
        output: insert Patient's information into table Patient 
    */
    CreatePatient : function(data, other, transaction) {
        var PatientDetail = {};
        var isCreateByPhoneNumber = false;
        var isCreateByName = false;
        var isCreateByEmail = false;
        var isCreateByPhoneAndEmail = false;
        var ishaveUser = false;
        var userInfo ={};
        var defer = $q.defer(); 
        var info = {
            Title           : data.Title,
            FirstName       : data.FirstName,
            MiddleName      : data.MiddleName,
            LastName        : data.LastName,
            DOB             : data.DOB?data.DOB:null,
            Gender          : data.Gender,
            Occupation      : data.Occupation,
            HomePhoneNumber : data.HomePhoneNumber,
            WorkPhoneNumber : data.WorkPhoneNumber,
            CountryID1      : data.CountryID1,
            Suburb          : data.Suburb,
            Postcode        : data.Postcode,
            Email1          : data.Email1,
            UID             : UUIDService.Create(),
            Address1        : data.Address1,
            Address2        : data.Address2,
            State           : data.State,
            Enable          : "Y"
        };
        sequelize.transaction()
        .then(function(t){
             Services.Patient.validation(data,true)
            .then(function(success){
                if(data.Email && data.PhoneNumber) {
                    isCreateByPhoneAndEmail = true;
                    userInfo.UserName = check.parseAuMobilePhone(data.PhoneNumber);
                    userInfo.PhoneNumber = data.PhoneNumber;
                    userInfo.Email   = data.Email;
                    return Services.UserAccount.GetUserAccountDetails(data,null,t);
                }
                else if(data.Email) {
                    isCreateByEmail = true;
                    userInfo.UserName = data.Email;
                    userInfo.Email = data.Email;
                    return Services.UserAccount.GetUserAccountDetails(data,null,t);
                }
                else if(data.PhoneNumber) {
                    isCreateByPhoneNumber = true;
                    userInfo.UserName = check.parseAuMobilePhone(data.PhoneNumber);
                    userInfo.PhoneNumber = check.parseAuMobilePhone(data.PhoneNumber);
                    return Services.UserAccount.GetUserAccountDetails(data,null,t);
                }
                else {
                    isCreateByName = true;
                    userInfo.UserName = data.FirstName+"."+data.LastName+"."+generatePassword(4, false);
                    return success;
                }
            },function(err) {
                t.rollback();
                throw err;
            })
            .then(function(got_user) {
                if(got_user == '' || got_user == null) {
                    userInfo.Password = generatePassword(12,false);
                    userInfo.PinNumber = generatePassword(6, false);
                    return Services.UserAccount.CreateUserAccount(userInfo,t);
                }
                else {
                    return got_user;
                }
            })
            .then(function(user){
                console.log(user);
                info.UserAccountID = user.ID;
                info.UserAccountUID = user.UID;
                return Patient.findOne({
                    where:{
                        UserAccountID : info.UserAccountID
                    },
                    transaction :t
                });
            },function(err){
                t.rollback();
                throw err;
            })
            .then(function(got_patient) {
                if(got_patient == null || got_patient == ''){
                    return Patient.create(info,{transaction:t});
                }
                else {
                    var err = new Error("CreatePatient.Error");
                    err.pushError("UserAccount.Has.Used");
                    throw err;
                }
            },function(err) {
                t.rollback();
                throw err;
            })
            .then(function(result){
                return RelUserRole.create({
                    UserAccountId : info.UserAccountID,
                    RoleId        : 3,
                    SiteId        : 1,
                    CreatedDate   : new Date()
                },{transaction:t})
                .then(function(s){
                    if(other != null) {
                        for(var key in other){
                            other[key].PatientID = result.ID;
                            other[key].UID = UUIDService.Create();
                        }
                        PatientDetail = other;
                        if(PatientDetail!=null) {
                            if(PatientDetail.PatientPension != null) {
                                return PatientPension.create(PatientDetail.PatientPension,{transaction:t});
                            }
                        }
                    }
                },function(err){
                    t.rollback();
                    throw err;
                })
                .then(function(result){
                    if(PatientDetail.PatientMedicare != null) {
                        return PatientMedicare.create(PatientDetail.PatientMedicare,{transaction:t});
                    }
                },function(err){
                   t.rollback();
                   throw err; 
                })
                .then(function(result){
                    if(PatientDetail.PatientKin != null) {
                        return PatientKin.create(PatientDetail.PatientKin,{transaction:t});
                    }
                },function(err){
                    t.rollback();
                    throw err;
                })
                .then(function(result){
                    if(PatientDetail.PatientDVA != null) {
                        return PatientDVA.create(PatientDetail.PatientDVA,{transaction:t});
                    }
                },function(err){
                    t.rollback();
                    throw err;
                })
            }, function(err){
                // t.rollback();
                throw err;
            })
            .then(function(success) {
                //call send Mail or send SMSs
                console.log("ishaveUser ",ishaveUser);
                if(ishaveUser == false) {
                    if(isCreateByPhoneAndEmail == true) {
                        data.content = data.PinNumber;
                        return Services.Patient.sendSMS(data, t,function(err) {
                            if(err) {
                                throw err;
                            }
                            else {
                                return Services.Patient.sendMail(data,t,function(err) {
                                    if(err)
                                        throw err;
                                    else{
                                        info.transaction = t;
                                        defer.resolve(info);
                                    }
                                });
                            }
                        });
                    }
                    else if(isCreateByEmail == true) {
                        return Services.Patient.sendMail(data,t,function(err) {
                            if(err){
                                console.log(err);
                                throw err;
                            }
                            else{
                                info.transaction = t;
                                defer.resolve(info);
                            }
                        });
                    }
                    else if(isCreateByPhoneNumber == true) {
                        data.content = data.PinNumber;
                        return Services.Patient.sendSMS(data, t,function(err) {
                            if(err)
                                throw err;
                            else{
                                info.transaction = t;
                                defer.resolve(info);
                            }
                        });
                    }
                    else {
                        info.transaction = t;
                        defer.resolve(info);
                    }
                }
                else {
                    info.transaction = t;
                    defer.resolve(info);
                }
            },function(err) {
                t.rollback();
                defer.reject(err);
                // throw err;
            });
        });
        return defer.promise;
    },

    /*
        UpdatePatient : service update a patient
        input:patient's information
        output:update patient into table Patient
    */
    UpdatePatient : function(data, other, transaction) {

        var isHaveRole = false;
        if(check.checkData(data)){
            data.ModifiedDate = new Date();
            // data.DOB =moment(data.DOB,'YYYY-MM-DD HH:mm:ss ZZ').format('DD/MM/YYYY');
            data.DOB = data.DOB?data.DOB:null;
            //get data not required
            var patientInfo={
                ID                  : data.ID,
                Title               : data.Title,
                FirstName           : data.FirstName,
                MiddleName          : data.MiddleName,
                LastName            : data.LastName,
                DOB                 : data.DOB,
                Gender              : data.Gender,
                Address1            : data.Address1,
                Address2            : data.Address2,
                Enable              : data.Enable,
                Suburb              : data.Suburb,
                Postcode            : data.Postcode,
                State               : data.State,
                Email1              : data.Email1,
                Occupation          : data.Occupation,
                HomePhoneNumber     : data.HomePhoneNumber,
                WorkPhoneNumber     : data.WorkPhoneNumber,
                InterperterLanguage : data.InterperterLanguage,
                MaritalStatus       : data.MaritalStatus,
                Education           : data.Education
            };

            //get data required ( if data has values, get it)
            if(data.UserAccountID)  patientInfo.UserAccountID = data.UserAccountID;
            if(data.CountryID1)  patientInfo.CountryID1 = data.CountryID1;
            if(data.UID)  patientInfo.UID = data.UID;
            if(data.DOB == null || data.DOB == '') delete patientInfo['DOB'];
            return sequelize.transaction()
                .then(function(t){
                return Services.Patient.validation(data)
                .then(function(success){
                    if(data.Signature != null && data.Signature != '') {
                        return FileUpload.findOne({
                            where :{
                                UID : data.Signature
                            },
                            transaction : t
                        });
                    }
                    else {
                        return success;
                    }

                }, function(err){
                    t.rollback();
                    throw err;
                })
                .then(function(checkedSign) {
                    if(checkedSign == null || checkedSign == ''){
                        return checkedSign;
                    }
                    else {
                        patientInfo.Signature = checkedSign.ID;
                         return Patient.update(patientInfo,{
                            where:{
                                UID : patientInfo.UID
                            },
                            transaction:t
                        })
                    }
                },function(err) {
                    t.rollback();
                    throw err;
                })
                .then(function(user){
                    if(data.EnableUser!=undefined && data.EnableUser!=null && data.EnableUser!=""){
                        return UserAccount.update({
                            Enable : data.EnableUser
                        },{
                            where : {
                                ID : data.UserAccountID
                            },
                            transaction:t
                        });
                    }
                    else {
                        if(data.Email && data.Email != null && data.Email != ''){
                            var EmailPattern=new RegExp(check.regexPattern.email);
                            if(!EmailPattern.test(data.Email)){
                                t.rollback();
                                var err = new Error("UpdatePatient.Error");
                                err.pushError("invalid.Email");
                                throw err;
                            }
                            else {
                                return UserAccount.update({
                                    Email : data.Email
                                },{
                                    where : {
                                        ID : data.UserAccountID
                                    },
                                    transaction:t
                                });
                            }
                        }
                        else
                            return user;
                    }
                },function(err){
                    t.rollback();
                    throw err;
                })
                //update 4 bang patient tai day
                .then(function(result){
                    console.log("1");
                    if(other!=null && other != ""){
                        if(other.hasOwnProperty('PatientPension')==true) {
                            return PatientPension.update(other.PatientPension,{
                                where:{
                                    PatientID : patientInfo.ID
                                },
                                transaction:t
                            });
                        }
                    }
                    else
                        return result;
                },function(err){
                    t.rollback();
                    throw err;
                })
                .then(function(updatedPatientPension){
                    if(other!=null && other != ""){
                        if(other.hasOwnProperty('PatientMedicare')==true) {
                            return PatientMedicare.update(other.PatientMedicare,{
                                where:{
                                    PatientID : patientInfo.ID
                                },
                                transaction:t
                            });
                        }
                    }
                    else
                        return updatedPatientPension;
                },function(err){
                    t.rollback();
                    throw err;
                })
                .then(function(updatedPatientMedicare){
                    if(other!=null && other != "") {
                        if(other.hasOwnProperty('PatientDVA')==true) {
                            return PatientDVA.update(other.PatientDVA,{
                                where:{
                                    PatientID : patientInfo.ID
                                },
                                transaction:t
                            });
                        }
                    }
                    else
                        return updatedPatientMedicare;
                },function(err){
                    t.rollback();
                    throw err;
                })
                .then(function(updatedPatientDVA){
                    if(other!=null && other != "") {
                        if(other.hasOwnProperty('PatientKin')==true) {
                            return PatientKin.update(other.PatientKin,{
                                where:{
                                    PatientID : patientInfo.ID
                                },
                                transaction:t
                            });
                        }
                    }
                    else
                        return updatedPatientDVA;
                },function(err){
                    t.rollback();
                    throw err;
                })

                //add data into patientGP table
                .then(function(updatedPatientKin){
                    if(data.hasOwnProperty('PatientGP')==true) {
                        return PatientGP.findAll({
                            where:{
                                PatientID : patientInfo.ID
                            },
                            transaction : t
                        })
                        .then(function(has_patientGP){
                            if(has_patientGP == null || has_patientGP == ""){
                                data.GP.PatientID = patientInfo.ID;
                                data.GP.UID       = UUIDService.Create();
                                return PatientGP.create(data.PatientGP,{transaction:t});
                            }
                            else {
                                return PatientGP.update(data.PatientGP,{
                                    where:{
                                        PatientID : patientInfo.ID
                                    },
                                    transaction:t
                                });
                            }
                        },function(err){
                            t.rollback();
                            throw err;
                        });
                    }
                    else
                        return updatedPatientKin;
                },function(err){
                    t.rollback();
                    throw err;
                })
                .then(function(updatedPatientGP){
                    if(data.hasOwnProperty('PatientMedicare')==true) {
                        return PatientMedicare.findAll({
                            where:{
                                PatientID : patientInfo.ID
                            },
                            transaction : t
                        })
                        .then(function(has_PatientMedicare){
                            if(has_PatientMedicare == null || has_PatientMedicare == ""){
                                data.PatientMedicare.PatientID  = patientInfo.ID;
                                data.PatientMedicare.UID        = UUIDService.Create();
                                data.PatientMedicare.ExpiryDate = new Date(moment(data.PatientMedicare.ExpiryDate+data.timezone,'YYYY-MM-DD').format('YYYY-MM-DD'));
                                return PatientMedicare.create(data.PatientMedicare,{transaction:t});
                            }
                            else {
                                if(data.PatientMedicare.hasOwnProperty('ExpiryDate')==true){
                                    // console.log('truoc khi convert >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ',data.PatientMedicare.ExpiryDate,' ',data.timezone);
                                    var parts = data.PatientMedicare.ExpiryDate.split('/');
                                    var date = parts[2].toString()+'-'+(parts[1]).toString()+'-'+parts[0].toString()+' +0700';
                                    // console.log("chuoi ~~~~~~~~~~~~~~~~~~~~~~~~~~~` ",date);
                                    data.PatientMedicare.ExpiryDate = moment(date).toDate();
                                    // console.log('sau khi convert ---------------------------- ',data.PatientMedicare.ExpiryDate);
                                }
                                return PatientMedicare.update(data.PatientMedicare,{
                                    where:{
                                        PatientID : patientInfo.ID
                                    },
                                    transaction:t
                                });
                            }
                        },function(err){
                            t.rollback();
                            throw err;
                        });
                    }
                    else
                        return updatedPatientGP;
                },function(err){
                    t.rollback();
                    throw err;
                })
                .then(function(updatedPatientMedicare){
                    if(data.hasOwnProperty('PatientPension')==true) {
                        return PatientPension.findAll({
                            where:{
                                PatientID : patientInfo.ID
                            },
                            transaction : t
                        })
                        .then(function(has_PatientPension){
                            if(has_PatientPension == null || has_PatientPension == ""){
                                data.PatientPension.PatientID  = patientInfo.ID;
                                data.PatientPension.UID        = UUIDService.Create();
                                data.PatientPension.ExpiryDate = new Date(moment(data.PatientPension.ExpiryDate+data.timezone,'YYYY-MM-DD').format('YYYY-MM-DD'));
                                return PatientPension.create(data.PatientPension,{transaction:t});
                            }
                            else {
                                // console.log('truoc khi convert >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ',data.PatientMedicare.ExpiryDate,' ',data.timezone);
                                if(data.PatientPension.hasOwnProperty('ExpiryDate')==true){
                                    var parts = data.PatientPension.ExpiryDate.split('/');
                                    var date = parts[2].toString()+'-'+(parts[1]).toString()+'-'+parts[0].toString()+' +0700';
                                    // console.log("chuoi ~~~~~~~~~~~~~~~~~~~~~~~~~~~` ",date);
                                    data.PatientPension.ExpiryDate = moment(date).toDate();
                                    // console.log('sau khi convert ---------------------------- ',data.PatientMedicare.ExpiryDate);
                                }
                                return PatientPension.update(data.PatientPension,{
                                    where:{
                                        PatientID : patientInfo.ID
                                    },
                                    transaction:t
                                });
                            }
                        },function(err){
                            t.rollback();
                            throw err;
                        });
                    }
                    else return updatedPatientMedicare;
                },function(err){
                    t.rollback();
                    throw err;
                })
                .then(function(updatedPatientPension){
                    if(data.hasOwnProperty('PatientFund')==true) {
                        return PatientFund.findAll({
                            where:{
                                PatientID : patientInfo.ID
                            },
                            transaction : t
                        })
                        .then(function(has_PatientFund){
                            if(has_PatientFund == null || has_PatientFund == ""){
                                data.PatientFund.PatientID = patientInfo.ID;
                                data.PatientFund.UID       = UUIDService.Create();
                                return PatientFund.create(data.PatientFund,{transaction:t});
                            }
                            else {
                                return PatientFund.update(data.PatientFund,{
                                    where:{
                                        PatientID : patientInfo.ID
                                    },
                                    transaction:t
                                });
                            }
                        },function(err){
                            t.rollback();
                            throw err;
                        });
                    }
                    else return updatedPatientPension;
                },function(err){
                    t.rollback();
                    throw err;
                })
                .then(function(updatedPatientFund){
                    if(data.hasOwnProperty('PatientDVA')==true) {
                        return PatientDVA.findAll({
                            where:{
                                PatientID : patientInfo.ID
                            },
                            transaction : t
                        })
                        .then(function(has_PatientDVA){
                            if(has_PatientDVA == null || has_PatientDVA == ""){
                                data.PatientDVA.PatientID = patientInfo.ID;
                                data.PatientDVA.UID       = UUIDService.Create();
                                return PatientDVA.create(data.PatientDVA,{transaction:t});
                            }
                            else {
                                return PatientDVA.update(data.PatientDVA,{
                                    where:{
                                        PatientID : patientInfo.ID
                                    },
                                    transaction:t
                                });
                            }
                        },function(err){
                            t.rollback();
                            throw err;
                        });
                    }
                    else return updatedPatientFund;
                },function(err){
                    t.rollback();
                    throw err;
                })
                //end add

                //ket thuc update 4 bang
                .then(function(result){
                    if(data.RoleId!=undefined && data.RoleId!=null 
                    && data.RoleId!="" && (data.RoleId==3)){
                        isHaveRole = true;
                        return Services.Doctor.checkUserRole(data.UserAccountID,t);
                    }
                    else{
                        // t.commit();
                        // var message = "success";
                        return result;
                    }
                },function(err){
                    t.rollback();
                    throw err;
                })
                .then(function(check){
                    if(isHaveRole==true){
                        if(check==null){
                            console.log("?????");
                            return RelUserRole.create({
                                RoleId        : data.RoleId,
                                UserAccountId : data.UserAccountID,
                                SiteId        : 1,
                                CreatedDate   : new Date(),
                                Enable        : 'Y'
                            },{transaction:t});
                        }
                        else{
                            return RelUserRole.update({
                                RoleId        : data.RoleId,
                                ModifiedDate   : new Date()
                            },{
                                transaction:t,
                                where:{
                                    UserAccountId : data.UserAccountID
                                }
                            });
                        }
                    }
                    else{
                        return check;
                    }
                },function(err){
                    t.rollback();
                    throw err;
                })
                .then(function(success){
                    if(isHaveRole==true){
                        t.commit();
                        var message = "success";
                        return message;
                    }
                    else{
                        t.commit();
                        var message = "success";
                        return message;
                    }
                },function(err){
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
    GetPatient : function(data, transaction) {
        var attributes=[];
        if(data.attributes){
            if(data.attributes.length > 0){
                for(var i = 0; i < data.attributes.length; i++){
                    attributes[i] = data.attributes[i].field;
                };
            }
            else {
                attributes = defaultAtrributes;
            }
        }
        else{
            attributes = defaultAtrributes;
        }
        return Services.UserAccount.GetUserAccountDetails(data)
        .then(function(user){
            //check if UserAccount is found in table UserAccount, get UserAccountID to find patient
            if(check.checkData(user)){
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
                    where:{
                        ID : user.ID
                    },
                    transaction:transaction,
                    attributes : ['PhoneNumber','Email','ID','UID','Enable'],
                    include: [
                        {
                            model: Patient,
                            attributes:attributes,
                            required : true,
                            include: [
                                {
                                    model : Country,
                                    as:'Country1',
                                    attributes:['ShortName'],
                                    required:false
                                }
                            ]
                        },
                        {
                            model: FileUpload,
                            attributes: ['ID','UID','FileType'],
                            required: false,
                            where:{
                                FileType:{$in: ['ProfileImage', 'Signature']},  
                                Enable:'Y'
                            },
                                // order:['CreatedDate ASC']
                        }
                    ],
                    order:[[FileUpload,'CreatedDate','DESC']]
                });
            }
            else{
                return null;
            }
        },function(err){
            throw err;
        });
    },
    
    /*
        DetailPatient: service get patient detail by patient's UID
        input: Patient's UID
        output: get patient's detail
    */
    DetailPatient : function(data) {
        var returnData;
        return Patient.findAll({
            where:{
                UID : data.UID
            },

            include:[
                {
                    model: UserAccount,
                    attributes: ['PhoneNumber','Email','ID','UID','Enable'],
                    required: true,
                    include:[
                        {
                            model:RelUserRole,
                            attributes:['RoleId'],
                            required: false
                        }
                    ]
                },
                {
                    model: Country,
                    as:'Country1',
                    attributes: ['ShortName'],
                    required: false
                },
                {
                    model: PatientDVA,
                    required: false
                },
                {
                    model: PatientKin,
                    required: false
                },
                {
                    model: PatientMedicare,
                    required: false
                },
                {
                    model: PatientPension,
                    required: false
                },
                {
                    model: PatientGP,
                    required: false
                },
                {
                    model: PatientFund,
                    required: false
                }
            ]
        })
        .then(function(result){
            returnData = result;
            return TelehealthUser.findAll({
                where:{
                    UserAccountID : result[0].UserAccountID
                }
            });
            // return result;
        },function(err){
            throw err;
        })
        .then(function(success){
            if(success!= null && success != "" && success.length != 0)
                returnData[0].dataValues.TeleUID = success?success[0].UID:null;
            return returnData;
        },function(err){
            throw err;
        });
    },

    /*
        LoadListPatient : service get list patient
        input: amount patient
        output: get list patient from table Patient
    */
    LoadListPatient : function(data, transaction){
        var FirstName = '',LastName = '';
        var isConcat = false;
        var attributes=[];
        if(data.attributes!=undefined && data.attributes!=null
             && data.attributes!='' && data.attributes.length!=0){
            for(var i = 0; i < data.attributes.length; i++){
                if(data.attributes[i].field!='UserAccount'){
                    attributes.push(data.attributes[i].field);
                }
            };
            attributes.push("UID");
        }
        else{
            attributes = defaultAtrributes;
        }
        var whereClause = Services.Patient.whereClause(data);
        if(data.Search){
            if(data.Search.FirstName!='' && data.Search.LastName!=''
                && data.Search.FirstName!=undefined && data.Search.LastName!=undefined){
                FirstName = data.Search.FirstName;
                LastName  = data.Search.LastName;
                isConcat = true;
            }
        }
        return Patient.findAndCountAll({
            include:[
                {
                    model: UserAccount,
                    attributes: ['PhoneNumber','Enable'],
                    required: true,
                    where:{
                        $or: whereClause.UserAccount
                    }
                }
            ],
            attributes : attributes,
            limit      : data.limit,
            offset     : data.offset,
            order      : data.order,
            where: {
                $or: [
                    whereClause.Patient,
                    isConcat?Sequelize.where(Sequelize.fn("concat", Sequelize.col("FirstName"),' ', Sequelize.col("LastName")), {
                        like: '%'+FirstName+' '+LastName+'%'
                    }):null,
                ]
                
            },
            transaction:transaction
        })
        .then(function(result){
            return result;
            
        },function(err){
            throw err;
        });
    },

    /*
        CheckPatient : service check patient has created ?
        input  : patient's PhoneNumber
        output : return object that contain information patient 
                 is created or not created
    */
    CheckPatient : function(data, transaction) {

        var info = {};
        // return Services.Patient.validation(data,false)
        // .then(function(success){
            if(check.checkData(data.PhoneNumber) && check.checkData(data.Email)){
                // data.PhoneNumber = data.PhoneNumber.substr(0,3)=="+61"?data.PhoneNumber:"+61"+data.PhoneNumber;
                return Services.UserAccount.GetUserAccountDetails(data,null,transaction)
                .then(function(user){
                    if(check.checkData(user)){
                        info.Email = user.Email;
                        info.PhoneNumber = user.PhoneNumber;
                        return Patient.findAll({
                                where :{
                                    UserAccountID : user.ID
                                },
                                transaction:transaction
                            });
        
                    }
                    else
                        return ({
                            isCreated:false
                        });
                },function(err){
                    throw err;
                })
                .then(function(result){
                    if(check.checkData(result) && result.isCreated!==false){
                        return ({
                            isCreated:true
                        });
                    }
                    else
                        return ({
                            isCreated:false,
                            data: {
                                Email : info.Email,
                                PhoneNumber: info.PhoneNumber
                            }
                        });
                },function(err){
                    throw err;
                });
            }
            else if(check.checkData(data.PhoneNumber)){
                // data.PhoneNumber = data.PhoneNumber.substr(0,3)=="+61"?data.PhoneNumber:"+61"+data.PhoneNumber;
                return Services.UserAccount.FindByPhoneNumber(data.PhoneNumber,transaction)
                .then(function(user){
                    if(check.checkData(user)){
                        info.Email = user[0].Email;
                        info.PhoneNumber = user[0].PhoneNumber;
                        return Patient.findAll({
                                where :{
                                    UserAccountID : user[0].ID
                                },
                                transaction:transaction
                            });
        
                    }
                    else
                        return ({
                            isCreated:false
                        });
                },function(err){
                    throw err;
                })
                .then(function(result){
                    if(check.checkData(result) && result.isCreated!==false){
                        return ({
                            isCreated:true
                        });
                    }
                    else
                        return ({
                            isCreated:false,
                            data: {
                                Email : info.Email,
                                PhoneNumber: info.PhoneNumber
                            }
                        });
                },function(err){
                    throw err;
                });
            }
            else if(check.checkData(data.Email)){
                // data.PhoneNumber = data.PhoneNumber.substr(0,3)=="+61"?data.PhoneNumber:"+61"+data.PhoneNumber;
                return Services.UserAccount.GetUserAccountDetails(data,null,transaction)
                .then(function(user){
                    if(check.checkData(user)){
                        info.Email = user[0].Email;
                        info.PhoneNumber = user[0].PhoneNumber;
                        return Patient.findAll({
                                where :{
                                    UserAccountID : user[0].ID
                                },
                                transaction:transaction
                            });
        
                    }
                    else
                        return ({
                            isCreated:false
                        });
                },function(err){
                    throw err;
                })
                .then(function(result){
                    if(check.checkData(result) && result.isCreated!==false){
                        return ({
                            isCreated:true
                        });
                    }
                    else
                        return ({
                            isCreated:false,
                            data: {
                                Email : info.Email,
                                PhoneNumber: info.PhoneNumber
                            }
                        });
                },function(err){
                    throw err;
                });
            }
            else{
                var error = new Error("CheckPatient.error");
                error.pushErrors("invalid.params");
                throw error;
            }
        // },function(err){
            // throw err;
        // })
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
    getfileUID: function(data){
        if(check.checkData(data.UserAccountID)){
            return FileUpload.findAll({
                attributes:['UserAccountID','UID'],
                where :{
                    UserAccountID : data.UserAccountID,
                    FileType: data.FileType,
                    Enable : 'Y'
                }
            });
        }
    },


    SearchPatient : function(whereClause, transaction) {
        var UserAccountWhereClause = {};
        if('PhoneNumber' in whereClause) {
            var PhoneNumber = whereClause.PhoneNumber[0] == '0' ? '+61'+ whereClause.PhoneNumber.substr(1,whereClause.PhoneNumber.length) : whereClause.PhoneNumber;
            UserAccountWhereClause.PhoneNumber = PhoneNumber;
            delete whereClause['PhoneNumber'];
        }
        return Patient.findOne({
            include:[
                {
                    model:UserAccount,
                    attributes:['PhoneNumber','UID'],
                    required: true,
                    where : UserAccountWhereClause
                }
            ],
            where : whereClause
        })
        .then(function(result) {
            return result;
        },function(err){
            throw err;
        })
    }


    // DeletePatient : function(patientID) {
    //  return Patient.destroy({
    //      where : {
    //          ID : patientID
    //      }
    //  });
    // }

};