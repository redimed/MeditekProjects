var moment = require('moment');
var request = require('request');
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
}

//****Send SMS function******
function sendSMS(toNumber, content, callback) {
    twilioClient.messages.create({
        body: content,
        to: toNumber,
        from: config.twilioPhone
    }, callback());
}


module.exports = {

	/*
		SendSMS
		Input: PhoneNumber and Verify
		Ouput: success or error
	*/
	SendSMS: function(req, res) {
        if (typeof req.body.data == 'undefined' || !toJson(req.body.data)) {
            res.serverError({
            	message: 'Invalid Parameters'
            });
            return;
        }
        var info = toJson(req.body.data);
        var phoneNumber = typeof info.phonenumber != 'undefined' ? info.phonenumber : null;
        var content = typeof info.content != 'undefined' ? info.content : null;
        // var phoneRegex = /^\+[0-9]{9,15}$/;
        if (phoneNumber != null && content != null) {
            sendSMS(phoneNumber, content, function(err, message) {
                if (err) {
                    res.serverError(ErrorWrap(err));
                    return;
                }
                res.ok({
                	message: 'Send Success'
                });
            });
        } else 
        	res.serverError({
        		message: 'Send Failed'
        	});
    },

	/*
		CheckPhoneUserAccount: Is Check PhoneNumer exist ?
		Input: PhoneNumber
		Ouput: success or error
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
		CheckUserNameAccount: Is Check UserName exist ?
		Input: UserName
		Ouput: success or error
	*/
	CheckUserNameAccount: function(req, res) {

		var data = req.body.data;
		Services.Register.CheckUsername(data.UserName)
		.then(function(success) {
			res.ok(success);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/*
		CheckEmailAccount: Is Check Email exist ?
		Input: Email
		Output: success or error
	*/
	CheckEmailAccount: function(req, res) {
		
		var data = req.body.data;
		Services.Register.CheckEmail(data.Email)
		.then(function(success) {
			res.ok(success);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/*
		Register ( Activation )
		CreateAccount: Create new doctor and new doctor's account
		Input: info's doctor and info's useraccount
		Ouput: success or error
	*/
	CreateAccount: function(req, res) {
		var data = req.body.data;
		if(data == undefined || data == null || data == ""){
			var error = new Error();
			error.pushError("CreateAccount.dataNull");
			res.serverError(ErrorWrap(error));
		}
		else{
			var dated = moment(data.CreatedDate, 'YYYY-MM-DD HH:mm:ss Z');
			// Variable
			var userInfo={
				UserName: data.UserName,
				Email: data.Email,
				PhoneNumber: data.PhoneNumber,
				Password: data.Password
			};
			var info_user = {};
			Services.Register.validate(data)
			.then(function(success){
				if(data.captcha){
					request.get({
				        url:"https://www.google.com/recaptcha/api/siteverify?secret=%276Ld-8A8TAAAAANQ3THAB8-cT8p8VEj58VZAThHxn%27&response="+data.captcha
				    }, function(error, response, body) {
				    	var captcha = JSON.parse(body);
				        		if(captcha.success==true){
						            sequelize.transaction().then(function(t){
										return Services.UserAccount.CreateUserAccount(userInfo, t)
										.then(function(result) {

											// Create Role
											var info_id = {
												ID: result.ID
											};
											var info_role = {
												RoleCode: data.Type
											};
											// Create Role
											Services.UserRole.CreateUserRoleWhenCreateUser(result, info_role, t)
											.then(function(success) {
												info_user = {
													UID   : result.UID,
													email : result.Email,
													ID    : result.ID
												};
												data.CreatedDate = dated;
												data.CreatedBy = req.user?req.user.ID:null;
												data.UserAccountID = result.ID;
												if(data.Title) {
													data.Title = data.Title.toString();
												} else {
													data.Title = '';
												}
												// Create Doctor
												Services.Doctor.CreateDoctor(data, t)
												.then(function(success) {

													var info_actv = {
														UserUID: result.UID,
														Type: HelperService.const.systemType.website,
														CreatedBy: result.ID
													};

													// Activation
													Services.UserActivation.CreateUserActivation(info_actv,t)
													.then(function(result_actv) {
														
														var info_show = {
															UID: result.UID,
															VerificationCode: result_actv.VerificationCode
														};
														t.commit();
														res.ok({
															data: info_show,
															useraccount: info_user
														});
													})
													.catch(function(err) {
														t.rollback();
														res.serverError(ErrorWrap(err));
													});

												})
												.catch(function(err) {
													t.rollback();
													res.serverError(ErrorWrap(err));
												});
											})
											.catch(function(err) {
												t.rollback();
												res.serverError(ErrorWrap(err));
											});

										})
										.catch(function(err) {
											t.rollback();
											res.serverError(ErrorWrap(err));
										});

									});
								}
				    });
				}
				else {
					var error = new Error("Server Error");
					error.pushError("Required Captcha");
					res.serverError(ErrorWrap(error));
				}
			})
			.catch(function(err){
				console.log(err);
				res.serverError(ErrorWrap(err));
			});
		}
		// Create Account
		

	},
	/*
		ConfirmActivated: Confirm code
		Input: Verifycode, UserUID,Method
		Ouput: success or error
	*/
	ConfirmActivated: function(req, res) {

		var data = req.body.data;
		// Variable
		var info = {
			UserUID: data.UserUID,
			SystemType: HelperService.const.systemType.website,
			VerificationCode: data.VerificationCode,
			Method: HelperService.const.verificationMethod.code
		};
		// Confirm Activate Code
		Services.UserActivation.Activation(info)
		.then(function(result) {
			res.ok(result);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/*
		CreateCode: Create new verifyCode
		Input: UID
		Output: UID, VerificationCode
	*/
	CreateCode: function(req, res) {

		var data = req.body.data;

		UserAccount.findOne({
			where: {
				UID: data.UserUID
			}
		})
		.then(function(result) {

			var info_actv = {
				UserUID: data.UserUID,
				Type: HelperService.const.systemType.website,
				ModifiedBy: result.ID
			};

			// Activation
			Services.UserActivation
			.CreateUserActivation(info_actv)
			.then(function(result_actv) {
				var info_show = {
					UID: data.UID,
					VerificationCode: result_actv.VerificationCode
				};

				res.ok({
					data: info_show
				});
			})
			.catch(function(err) {
				res.serverError(ErrorWrap(err));
			});

		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},

	CheckUserStep1: function(req, res) {
		var data = req.body.data;
		Services.Register.CheckUserStep1(data)
		.then(function(success){
			res.ok(success);
		})
		.catch(function(err){
			res.serverError(ErrorWrap(err));
		});
	}

};