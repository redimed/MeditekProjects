var moment = require('moment');
var _ = require('lodash');
var S = require('string');
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
function sendSMS(toNumber, content, callback) {
    twilioClient.messages.create({
        body: content,
        to: toNumber,
        from: config.twilioPhone
    }, callback());
};

module.exports = {

	/*
		SendSMS
	*/
	SendSMS: function(req, res) {
        if (typeof req.body.data == 'undefined' || !toJson(req.body.data)) {
            res.json(500, {
                status: 'error',
                message: 'Invalid Parameters!'
            });
            return;
        }
        var info = toJson(req.body.data);
        var phoneNumber = typeof info.phone != 'undefined' ? info.phone : null;
        var content = typeof info.content != 'undefined' ? info.content : null;
        // var phoneRegex = /^\+[0-9]{9,15}$/;
        if (phoneNumber != null && content != null) {
            sendSMS(phoneNumber, content, function(err, message) {
                if (err) {
                    res.json(500, {
                        status: 'error',
                        message: err
                    });
                    return;
                }
                res.json(200, {
                    status: 'success',
                    message: 'Send SMS Successfully!'
                });
            });
        } else res.json(500, {
            status: 'error',
            message: 'Invalid Parameters!'
        })
    },
	/*  
		GetDoctor: Get all data from specific table
		Ouput: Information of doctor table
	*/
	GetDoctor: function(req, res) {

		// Information
		var postData = req.body.data;

		Services
			.Doctor
				.findallDoctor(postData)
					.then(function(result) {
						res.ok({
							data: result
						});
					})
					.catch(function(err) {
						res.serverError(ErrorWrap(err));
					});

	},
	/*
		GetByIdDoctor: Get data according to UID of doctor
		Input: UID
		Output: Information doctor
	*/
	// GetByIdDoctor: function(req, res) {

	// 	var postData = req.body.data;

	// 	Services
	// 		.Doctor
	// 			.findoneDoctor(postData)
	// 				.then(function(result) {
	// 					res.ok({
	// 						data: result
	// 					});
	// 				})
	// 				.catch(function(err) {
	// 					res.serverError({
	// 						error: err
	// 					});
	// 				});

	// },
	/*
		CreateDoctor: Create new doctor
		Input: doctor's information
		Ouput: error
	*/
	CreateDoctor: function(req, res) {

		var data = req.body.data;
		Services.Doctor.createDoctor(data)
		.then(function(info){
			res.ok({status:200, message:"success"});
		})
		.catch(function(err){
			res.serverError({status:500, message:ErrorWrap(err)});
		});
		
	},
	/*
		CheckPhone: Confirm phone of doctor
	*/
	CheckPhone: function(req, res) {

		var data = req.body.data;
		Services.UserAccount.FindByPhoneNumber(data.PhoneNumber)
		.then(function(success) {
			res.ok(success);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/* 
		CheckEmail: 
	*/
	CheckEmail: function(req, res) {
		
		var data = req.body.data;
		Services.Doctor.checkEmail(data)
		.then(function(success) {
			res.ok(success);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/*
		CheckPhoneUserAccount
	*/
	CheckPhoneUserAccount: function(req, res) {

		var data = req.body.data;
		Services.UserAccount.FindByPhoneNumber(data.PhoneNumber)
		.then(function(success) {
			res.ok(success);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/*
		CreateDoctor; Create new doctor	
	*/
	CreateDoctor: function(req, res) {
		
		var data = req.body.data;

		Doctor.create(data)
		.then(function(successDoctor) {
			console.log('Doctor: ', success);
			res.ok(successDoctor);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/*
		CreateDoctorAccount
	*/
	CreateDoctor: function(req, res) {

		var data = req.body.data;

		Services.UserAccount.CreateUserAccount(data)
		.then(function(success) {
			console.log('@@@: ', success);
			res.ok(success);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/*
		GetVerify
	*/
	GetVerify: function(req, res) {

		var data = req.body.data;

		Services.Doctor.VerifyActivate(data)
		.then(function(success) {
			res.ok(success);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/*
		doctorAppointment: List doctor for Appointment
	*/
	doctorAppointment: function(req, res) {

		Services.Doctor.DoctorAppointment()
		.then(function(result) {
			res.ok(result);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/*
		doctorIDAppointment: Get doctor according to ID
	*/
	doctorIDAppointment: function(req, res) {

		var data = req.body.data;

		Services.Doctor.DoctorIDAppointment(data)
		.then(function(result) {
			res.ok(result);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});
	},
	/*
		CreateDoctor: Create new doctor
	*/
	
	//
		// Validate
		// var errors = [];
		// var required = [
		// 	{field: 'LastName', message: 'LastName is required'},
		// 	{field: 'PhoneNumber', message: 'Mobile is required'},
		// 	{field: 'FirstName', message: 'FirstName is required'},
		// 	{field: 'MiddleName', message: 'MiddleName is required'}
		// ];
		// var required = [
		// 	{field: 'Email', message: 'Email is required'},
		// 	{field: 'State', message: 'State is required'},
		// 	{field: 'Country', message: 'Country is required'},
		// 	{field: 'Address1', message: 'Address is required'},
		// 	{field: 'LastName', message: 'LastName is required'},
		// 	{field: 'UserName', message: 'UserName is required'},
		// 	{field: 'Password', message: 'Password is required'},
		// 	{field: 'CountryID', message: 'Country is required'},
		// 	{field: 'Address2', message: 'Address2 is required'},
		// 	{field: 'PhoneNumber', message: 'Mobile is required'},
		// 	{field: 'FirstName', message: 'FirstName is required'},
		// 	{field: 'MiddleName', message: 'MiddleName is required'},
		// 	{field: 'HealthlinkID', message: 'Healthlink ID is required'},
		// 	{field: 'ProviderNumber', message: 'ProviderNumber is required'},
		// 	{field: 'RePassword', message: 'Re-Type Your Password is required'}
		// ];

		// if(step == 1) {

			// _.forIn(postData, function(field, value) {
			// 	_.forEach(required, function(field_errror) {
			// 		if(field_errror.field === field && S(value).isEmpty()) {
			// 			errors.push(field_errror);
			// 			return;
			// 		}
			// 	})
			// })

			// if( postData.PhoneNumber != null || postData.PhoneNumber != '') {

			// 	Services.Doctor
			// 	.checkPhone(postData.PhoneNumber)
			// 	.then(function(success1) {
			// 		if(step == 2) {
			// 			Services.Doctor
			// 			.checkEmail(postData.Email)
			// 			.then(function(success2) {

			// 			})
			// 			.catch(function(errors) {
			// 				errors.push(
			// 					{field: 'Email', message: 'Email existed'}
			// 				);
			// 			})
			// 		}
			// 	})
			// 	.catch(function(errors) {
			// 		errors.push(
			// 			{field: 'PhoneNumber', message: 'PhoneNumber existed'}
			// 		);
			// 		return;
			// 	})

			// }


		// }

		// var email = new RegExp(HelperService.regexPattern.email);
		// var Mphone = new RegExp(HelperService.regexPattern.auPhoneNumber);
		
		// if(postData.RePassword != '' || postData.RePassword != null) {
		// 	if(postData.RePassword != postData.Password) {
		// 		errors.push(
		// 			{field: 'RePassword', message: 'Please enter the same value again.'}
		// 		);
		// 		return;
		// 	}
 	// 	}
		// if(!email.test(postData.Email)) {
		// 	errors.push(
		// 		{field: 'Email', message: 'Email invalid'}
		// 	);
		// 	return;
		// }
		// if(!Mphone.test(postData.PhoneNumber)) {
		// 	errors.push(
		// 		{field: 'Mobile', message: 'Mobile invalid'}
		// 	);
		// 	return;
		// }

		// if(errors.length > 0) {
		// 	console.log(errors);
		// 	res.status(500).json({
		// 		errors: errors
		// 	});
		// 	return;
		// }

	// },
	/*
		CreateDoctor: Create new data into doctor table and Create new data into useraccount table
		Input: Information data of doctor
		Output: return success or error
	*/
	// CreateDoctor: function(req, res) {


	// 	// Information
	// 	var postData = req.body.data;

	// 	// Variable
	// 	var errors = [];
	// 	var err=new Error('Error');

	// 	var email = new RegExp(HelperService.regexPattern.email);
	// 	var MPhone = new RegExp(HelperService.regexPattern.auPhoneNumber);
	// 	var HPhone = new RegExp(HelperService.regexPattern.auHomePhoneNumber);

	// 	if( !email.test(postData.Email) ) {
			
	// 		errors.pushError({field: 'Email', message: 'Email invalid'});
	// 		err.pushErrors(errors);

	// 	}
	// 	if( !MPhone.test(postData.Mphone) ) {

	// 		errors.pushError({field: 'Mphone', message: 'MPhone invalid'});
	// 		err.pushErrors(errors);

	// 	}
	// 	if( !HPhone.test(postData.Hphone) ) {

	// 		errors.pushError({field: 'Hphone', message: 'Hphone invalid'});
	// 		err.pushErrors(errors);

	// 	}
	// 	if(err.getErrors().length > 0) {
	// 		throw err;
	// 	}
	// 	else {

	// 		// User
	// 		var info_user = {
	// 			UserName: postData.UserName,
	// 			Email: postData.Email,
	// 			PhoneNumber: postData.Mphone,
	// 			Password: postData.Password
	// 		};
	// 		// Create user
	// 		Services
	// 			.UserAccount
	// 				.CreateUserAccount(info_user)
	// 					.then(function(result_info) {
	// 						// Doctor
	// 						var info_doctor = {

	// 							UID: UUIDService.Create(),
	// 							UserAccountID: result_info.ID,
	// 							FirstName: postData.FirstName,
	// 							MiddleName: postData.MiddleName,
	// 							LastName: postData.LastName,
	// 							Type: HelperService.const.roles.externalPractiction.toString(),
	// 							Address1: postData.Address1,
	// 							Address2: postData.Address2,
	// 							Postcode: postData.Postcode,
	// 							Suburb: postData.Suburb,
	// 							State: postData.State,
	// 							CountryID: postData.CountryID,
	// 							Email: postData.Email,
	// 							PhoneNumber: postData.Hphone,
	// 							Signature: postData.SignatureID,
	// 							HealthLink: postData.HealthLink,
	// 							ProviderNumber:postData.ProviderNumber,
	// 							Enable: 'Y',
	// 							CreatedDate: moment(postData.CreatedDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss ZZ'),
	// 							CreatedBy: result_info.ID

	// 						};
	// 						// Create doctor
	// 						Services
	// 							.Doctor
	// 								.createDoctor(info_doctor)
	// 									.then(function(success) {
	// 										var info_actv = {
	// 											UserAccountID: result_info.ID,
	// 											Type: HelperService.const.systemType.website,
	// 											CreatedBy: result_info.ID
	// 										};
	// 										// Activation
	// 										Services
	// 											.UserActivation
	// 												.CreateUserActivation(info_actv)
	// 													.then(function(result_actv) {
	// 														res.ok({
	// 															data: result_actv
	// 														});
	// 													})
	// 													.catch(function(err) {
	// 														res.serverError(ErrorWrap(err));
	// 													});
	// 									})
	// 									.catch(function(err) {
	// 										res.serverError(ErrorWrap(err));
	// 									});

	// 					}, function(err) {
	// 						res.serverError(ErrorWrap(err));
	// 					});

	// 	}	// end else

	// },
	// /* 
	// 	CreateDoctors: Create new data into doctor table and link into user existed
	// 	Input: information of doctor and ID of user
	// 	Output: return success or error
	// */
	// CreateDoctors: function(req, res) {

	// 	// Information
	// 	var postData = req.body.data;
	// 	// Variable
	// 	var errors = [];
	// 	var email_error = postData.Email.match(HelperService.regexPattern.email);
	// 	var date_error = postData.Dob.match(HelperService.regexPattern.date);
	// 	var phone_error = postData.Phone.match(HelperService.regexPattern.fullPhoneNumber);

	// 	if( postData.Email === "" && postData.Phone === "" && postData.Dob === "" ) {
		
	// 		var error_valid = [
	// 			{field: 'Email', message: 'Email is required'},
	// 			{field: 'Phone', message: 'Phone is required'},
	// 			{field: 'Dob', message: 'Dob is required'}
	// 		];
	// 		errors.push(error_valid);
	// 		res.json(500, {
	// 			errors: errors
	// 		});
	// 		return;
	// 	}
	// 	if( postData.Email === "" ) {

	// 		var error_valid = [
	// 			{field: 'Email', message: 'Email is required'}
	// 		];
	// 		errors.push(error_valid);
	// 		res.json(500, {
	// 			errors: errors
	// 		});
	// 		return;
	// 	}
	// 	if( postData.Phone === "" ) {

	// 		var error_valid = [
	// 			{field: 'Phone', message: 'Phone is required'}
	// 		];
	// 		errors.push(error_valid);
	// 		res.json(500, {
	// 			errors: errors
	// 		});
	// 		return;
	// 	}
	// 	if( postData.Dob === "" ) {

	// 		var error_valid = [
	// 			{field: 'Dob', message: 'Dob is required'}
	// 		];
	// 		errors.push(error_valid);
	// 		res.json(500, {
	// 			errors: errors
	// 		});
	// 		return;
	// 	}
	// 	else {

	// 		if( !email_error && !phone_error && !date_error ) {

	// 			var error_valid = [
	// 				{field: 'Email', message: 'Email invalid'},
	// 				{field: 'Phone', message: 'Phone invalid'},
	// 				{field: 'Dob', message: 'Dob invalid'}
	// 			];
	// 			errors.push(error_valid);
	// 			res.json(500, {
	// 				errors: errors
	// 			});
	// 			return;
	// 		}
	// 		if( !email_error ) {

	// 			var error_valid = [
	// 				{field: 'Email', message: 'Email invalid'}
	// 			];
	// 			errors.push(error_valid);
	// 			res.json(500, {
	// 				errors: errors
	// 			});
	// 			return;
	// 		}
	// 		if( !phone_error ) {

	// 			var error_valid = [
	// 				{field: 'Phone', message: 'Phone invalid'}
	// 			];
	// 			errors.push(error_valid);
	// 			res.json(500, {
	// 				errors: errors
	// 			});
	// 			return;
	// 		}
	// 		if( !date_error ) {

	// 			var error_valid = [
	// 				{field: 'Date', message: 'Dob invalid'}
	// 			];
	// 			errors.push(error_valid);
	// 			res.json(500, {
	// 				errors: errors
	// 			});
	// 			return;
	// 		}
	// 		else {

	// 			var info_doctor = {

	// 				UID: UUIDService.Create(),
	// 				SiteID: postData.SiteID,
	// 				UserAccountID: postData.UserAccountID,
	// 				FirstName: postData.FirstName,
	// 				MiddleName: postData.MiddleName,
	// 				LastName: postData.LastName,
	// 				Dob: moment(postData.Dob, 'DD/MM/YYYY').format('YYYY-MM-DD'),
	// 				Email: postData.Email,
	// 				Phone: postData.Phone,
	// 				Enable: 'Y',
	// 				CreatedDate: moment(postData.CreatedDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss ZZ'),
	// 				CreatedBy: postData.CreatedBy

	// 			};

	// 			Services
	// 				.Doctor
	// 					.createDoctor(info_doctor)
	// 						.then(function(success) {
	// 							res.ok({
	// 								success: "Created Successfull"
	// 							});
	// 						})
	// 						.catch(function(err) {
	// 							res.serverError({
	// 								error: err
	// 							});
	// 						});

	// 		}
	// 	}

	// },
	// /* 
	// 	UpdateDoctor: Update data into doctor table
	// 	Input: information data of doctor
	// 	Ouput: return success or error
	// */
	// UpdateDoctor: function(req, res) {

	// 	// Information
	// 	var postData = req.body.data;
	// 	// Variable
	// 	var errors = [];
	// 	var email_error = postData.Email.match(HelperService.regexPattern.email);
	// 	var date_error = postData.Dob.match(HelperService.regexPattern.date);
	// 	var phone_error = postData.Phone.match(HelperService.regexPattern.fullPhoneNumber);

	// 	if( postData.Email === "" && postData.Phone === "" && postData.Dob === "" ) {
		
	// 		var error_valid = [
	// 			{field: 'Email', message: 'Email is required'},
	// 			{field: 'Phone', message: 'Phone is required'},
	// 			{field: 'Dob', message: 'Dob is required'}
	// 		];
	// 		errors.push(error_valid);
	// 		res.json(500, {
	// 			errors: errors
	// 		});
	// 		return;
	// 	}
	// 	if( postData.Email === "" ) {

	// 		var error_valid = [
	// 			{field: 'Email', message: 'Email is required'}
	// 		];
	// 		errors.push(error_valid);
	// 		res.json(500, {
	// 			errors: errors
	// 		});
	// 		return;
	// 	}
	// 	if( postData.Phone === "" ) {

	// 		var error_valid = [
	// 			{field: 'Phone', message: 'Phone is required'}
	// 		];
	// 		errors.push(error_valid);
	// 		res.json(500, {
	// 			errors: errors
	// 		});
	// 		return;
	// 	}
	// 	if( postData.Dob === "" ) {

	// 		var error_valid = [
	// 			{field: 'Dob', message: 'Dob is required'}
	// 		];
	// 		errors.push(error_valid);
	// 		res.json(500, {
	// 			errors: errors
	// 		});
	// 		return;
	// 	}
	// 	else {

	// 		if( !email_error && !phone_error && !date_error ) {

	// 			var error_valid = [
	// 				{field: 'Email', message: 'Email invalid'},
	// 				{field: 'Phone', message: 'Phone invalid'},
	// 				{field: 'Dob', message: 'Dob invalid'}
	// 			];
	// 			errors.push(error_valid);
	// 			res.json(500, {
	// 				errors: errors
	// 			});
	// 			return;
	// 		}
	// 		if( !email_error ) {

	// 			var error_valid = [
	// 				{field: 'Email', message: 'Email invalid'}
	// 			];
	// 			errors.push(error_valid);
	// 			res.json(500, {
	// 				errors: errors
	// 			});
	// 			return;
	// 		}
	// 		if( !phone_error ) {

	// 			var error_valid = [
	// 				{field: 'Phone', message: 'Phone invalid'}
	// 			];
	// 			errors.push(error_valid);
	// 			res.json(500, {
	// 				errors: errors
	// 			});
	// 			return;
	// 		}
	// 		if( !date_error ) {

	// 			var error_valid = [
	// 				{field: 'Date', message: 'Dob invalid'}
	// 			];
	// 			errors.push(error_valid);
	// 			res.json(500, {
	// 				errors: errors
	// 			});
	// 			return;
	// 		}
	// 		else {

	// 			var info_doctor = {

	// 				FirstName: postData.FirstName,
	// 				MiddleName: postData.MiddleName,
	// 				LastName: postData.LastName,
	// 				Dob: moment(postData.Dob, 'DD/MM/YYYY').format('YYYY-MM-DD'),
	// 				Email: postData.Email,
	// 				Phone: postData.Phone,
	// 				ModifiedDate: moment(postData.ModifiedDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss ZZ'),
	// 				ModifiedBy: postData.ModifiedBy

	// 			};

	// 			Services
	// 				.Doctor
	// 					.updateDoctor(info_doctor, postData)
	// 					.then(function(result) {
	// 						res.ok({
	// 							success: "Updated Successfull"
	// 						});
	// 					})
	// 					.catch(function(err) {
	// 						res.serverError({
	// 							error: err
	// 						});
	// 					});

	// 		}

	// 	}

	// },
	/* 
		SearchDoctor: Search information of doctor from doctor table
		Input: Information of doctor
		Ouput: Get data from doctor table
	*/
	// SearchDoctor: function(req, res) {

	// 	// info
	// 	var postData = req.body.data;

	// 	Services
	// 		.Doctor
	// 			.searchDoctor(postData)
	// 				.then(function(result) {
	// 					res.ok({
	// 						data: result
	// 					});
	// 				})
	// 				.catch(function(err) {
	// 					res.serverError(ErrorWrap(err));
	// 				});

	// },
	/*
		GetCountry: Get country list
		Output: all data country
	*/
	// GetCountry: function(req, res) {

	// 	Services
	// 		.Doctor
	// 			.getCountry()
	// 			.then(function(result) {
	// 				res.ok({
	// 					data: result
	// 				});
	// 			})
	// 			.catch(function(err) {
	// 				res.serverError(ErrorWrap(err));
	// 			});
	// },
	/*
		GetDepartment: Get department list
		Output: all data of department
	*/
	// GetDepartment: function(req, res) {

	// 	Services
	// 		.Doctor
	// 			.getDepartment()
	// 			.then(function(result) {
	// 				res.ok({
	// 					data: result
	// 				});
	// 			})
	// 			.catch(function(err) {
	// 				res.serverError(ErrorWrap(err));
	// 			})

	// }

};