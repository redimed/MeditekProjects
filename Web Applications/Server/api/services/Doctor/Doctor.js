var $q = require('q');
var _ = require('lodash');
var S = require('string');
//moment
var moment = require('moment');

module.exports = {
	
	/* 
		findallDoctor: Get all data	
	*/
	findallDoctor: function(data) {

		return Doctor
				.findAndCountAll({
					include: [{
						model: UserAccount,
						attributes: ['PhoneNumber'],
						where: {
							$or: [
								{
									PhoneNumber: {
										like: '%' + data.PhoneNumber + '%'
									}
								}
							]
						}
					}],
					where: {
						$or: [
							{
								FirstName: {
									like: '%' + data.FirstName + '%'
								}
							},
							{
								LastName: {
									like: '%' + data.LastName + '%'	
								}
							},
							{
								Email: {
									like: '%' + data.Email + '%'
								}
							}
						]
					},
					offset: data.offset,
					limit: data.limit,
					order: [
						['CreatedDate', 'DESC'],
						['Email', data.sortEmail],
						['LastName', data.sortLastName],
						['FirstName', data.sortFisrtName]
					]
				});

	},
	/*
		DoctorAppointment: List doctor for Appointment
	*/
	DoctorAppointment: function() {

		return Doctor.findAll();

	},
	/*
		DoctorIDAppointment: Get doctor according to ID
	*/
	DoctorIDAppointment: function(data) {
		
		return Doctor
					.findAll({
						where: {
							UID: data.UID
						}
					});
	
	},
	/*
		VerifyActivate: Confirm Active code
	*/
	VerifyActivate: function(data) {
		
		return UserActivation
					.findAll({
						where: {
							VerificationCode: data.verifyCode
						}
					});

	},
	// /*
	// 	validation : validate input from client post into server
	// 	input: doctor's information
	// 	output: validate doctor's information
	// */
	// validation : function(data) {
	// 	var q = $q.defer();
	// 	var errors = [];
	// 	//create a error with contain a list errors input
	// 	var err = new Error("ERRORS");
	// 	try {

	// 		//validate Title
	// 		if(data.Title){
	// 			if(data.Title.length < 0 || data.Title.length > 45){
	// 				errors.push({field:"Title",message:"Doctor.Title.length"});
	// 				err.pushErrors(errors);
	// 			}
	// 		}

	// 		//validate FirstName
	// 		if(data.FirstName){
	// 			if(data.FirstName.length < 0 || data.FirstName.length > 50){
	// 				errors.push({field:"FirstName",message:"Doctor.FirstName.length"});
	// 				err.pushErrors(errors);
	// 			}
	// 		}

	// 		//validate MiddleName
	// 		if(data.MiddleName){
	// 			if(data.MiddleName.length < 0 || data.MiddleName.length > 100){
	// 				errors.push({field:"MiddleName",message:"Doctor.MiddleName.length"});
	// 				err.pushErrors(errors);
	// 			}
	// 		}

	// 		//validate LastName
	// 		if(data.LastName){
	// 			if(data.LastName.length < 0 || data.LastName.length > 255){
	// 				errors.push({field:"LastName",message:"Doctor.LastName.length"});
	// 				err.pushErrors(errors);
	// 			}
	// 		}

	// 		//validate Address1
	// 		if(data.Address1){
	// 			if(data.Address1.length < 0 || data.Address1.length > 255){
	// 				errors.push({field:"Address1",message:"Doctor.Address1.length"});
	// 				err.pushErrors(errors);
	// 			}
	// 		}

	// 		//validate Address2
	// 		if(data.Address2){
	// 			if(data.Address2.length < 0 || data.Address2.length > 255){
	// 				errors.push({field:"Address2",message:"Doctor.Address2.length"});
	// 				err.pushErrors(errors);
	// 			}
	// 		}

	// 		//validate Suburb
	// 		if(data.Suburb){
	// 			if(data.Suburb.length < 0 || data.Suburb.length > 100){
	// 				errors.push({field:"Suburb",message:"Doctor.Suburb.length"});
	// 				err.pushErrors(errors);
	// 			}
	// 		}

	// 		//validate Postcode
	// 		if(data.Postcode){
	// 			if(data.Postcode.length < 0 || data.Postcode.length > 100){
	// 				errors.push({field:"Postcode",message:"Doctor.Postcode.length"});
	// 				err.pushErrors(errors);
	// 			}
	// 		}

	// 		//validate State
	// 		if(data.State){
	// 			if(data.Postcode.length < 0 || data.Postcode.length > 100){
	// 				errors.push({field:"State",message:"Doctor.State.length"});
	// 				err.pushErrors(errors);
	// 			}
	// 		}

	// 		if(data.Email){
	// 			if(data.Email.length < 0 || data.Email.length > 255){
	// 				errors.push({field:"Email",message:"Doctor.Email.length"});
	// 				err.pushErrors(errors);
	// 			}
	// 		}

	// 		if(data.HealthLink){
	// 			if(data.HealthLink.length < 0 || data.HealthLink.length > 255){
	// 				errors.push({field:"HealthLink",message:"HealthLink.Email.length"});
	// 				err.pushErrors(errors);
	// 			}
	// 		}
			
	// 		if(data.HomePhoneNumber){
	// 			var auHomePhoneNumberPattern=new RegExp(HelperService.regexPattern.auHomePhoneNumber);
	// 			var HomePhone=data.HomePhoneNumber.replace(HelperService.regexPattern.phoneExceptChars,'');
	// 			console.log(HomePhone);
	// 			if(!auHomePhoneNumberPattern.test(HomePhone)){
	// 				errors.push({field:"HomePhoneNumber",message:"Doctor.HomePhoneNumber.length"});
	// 				err.pushErrors(errors);
	// 				throw err;
	// 			}
	// 		}

	// 		if(data.WorkPhoneNumber){
	// 			var auHomePhoneNumberPattern=new RegExp(HelperService.regexPattern.auHomePhoneNumber);
	// 			var HomePhone=data.WorkPhoneNumber.replace(HelperService.regexPattern.phoneExceptChars,'');
	// 			console.log(HomePhone);
	// 			if(!auHomePhoneNumberPattern.test(HomePhone)){
	// 				errors.push({field:"WorkPhoneNumber",message:"Doctor.WorkPhoneNumber.length"});
	// 				err.pushErrors(errors);
	// 				throw err;
	// 			}
	// 		}

	// 		if(err.getErrors().length>0){
	// 			throw err;
	// 		}

	// 		else{
	// 			q.resolve({status:'success'});
	// 		}
	// 		//q.resolve({status:'success'});

	// 	}
	// 	catch(err){
	// 		q.reject(err);
	// 	}
	// 	return q.promise;
	// },
	/* 
		createDoctorAccount: Create new doctor and new account
	*/
	// createDoctorAccount: function(data) {

	// 	// var info = {

	// 	// 	Title: data.Title,
	// 	// 	DOB: data.DOB,
	// 	// 	Enable: 'Y',
	// 	// 	Email: data.Email,
	// 	// 	Type: data.Type,
	// 	// 	Suburb: data.Suburb,
	// 	// 	State: data.State,
	// 	// 	Country: data.Country,
	// 	// 	Address1: data.Address1,
	// 	// 	Address2: data.Address2,
	// 	// 	LastName: data.LastName,
	// 	// 	FirstName: data.FirstName,
	// 	// 	CountryID: data.CountryID,
	// 	// 	MiddleName: data.MiddleName,
	// 	// 	HealthlinkID: data.HealthlinkID,
	// 	// 	DepartmentID: data.DepartmentID,
	// 	// 	UID: UUIDService.Create(),
	// 	// 	ProviderNumber: data.ProviderNumber,
	// 	// 	HomePhoneNumber: data.HomePhoneNumber,
	// 	// 	WorkPhoneNumber: data.WorkPhoneNumber,
	// 	// 	CreatedDate: moment().format('YYYY-MM-DD HH:mm:ss Z'),
	// 	// 	CreatedBy: req.user?req.user.ID:null

	// 	// };

	// 	// return Services.Doctor.validation(data)
	// 	// .then(function(success){
	// 	// 	if(data.PhoneNumber.substr(0,3)=='+61'){
	// 	// 		return Services.UserAccount.FindByPhoneNumber(data.PhoneNumber);
	// 	// 	}
	// 	// 	else{
	// 	// 		data.PhoneNumber = '+61'+data.PhoneNumber;
	// 	// 		return Services.UserAccount.FindByPhoneNumber(data.PhoneNumber);
	// 	// 	}
	// 	// 	//return Patient.create(data);
	// 	// },function(err){
	// 	// 	throw err;
	// 	// })
	// 	// .then(function(user){
	// 	// 	data.password = generatePassword(12, false);
	// 	// 	var userInfo = {
	// 	// 		UserName    : data.PhoneNumber,
	// 	// 		Email       : data.Email,
	// 	// 		PhoneNumber : data.PhoneNumber,
	// 	// 		Password    : data.password
	// 	// 	};
	// 	// 	userInfo.UID = UUIDService.Create();
	// 	// 	//create UserAccount
	// 	// 	return Services.UserAccount.CreateUserAccount(userInfo)
	// 	// 	.then(function(user){
	// 	// 		info.UserAccountID = user.ID;
	// 	// 		return Doctor.create(info);
	// 	// 	},function(err){
	// 	// 		var error = new Error("createDoctor.error");
	// 	// 		error.pushErrors("createDoctor.fail");
	// 	// 		throw error;
	// 	// 	});
	// 	// },function(err){
	// 	// 	var error = new Error("createDoctor.fail");
	// 	// 	error.pushErrors("FindByPhoneNumber.fail");
	// 	// 	throw error;
	// 	// });
					
	// },

	/* 
		checkEmail
	*/
	checkEmail: function(data) {
		return UserAccount.findAll({
			where: {
				UserName: data.Email
			}
		});
	}

}