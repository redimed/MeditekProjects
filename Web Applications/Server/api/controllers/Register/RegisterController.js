var moment = require('moment');
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
		var dated = moment(data.CreatedDate, 'YYYY-MM-DD HH:mm:ss Z');

		var userInfo={
			UserName: data.UserName,
			Email: data.Email,
			PhoneNumber: data.PhoneNumber,
			Password: data.Password
		};
		
		Services.UserAccount.CreateUserAccount(userInfo)
		.then(function(result) {

			// Create Role
			var info_id = {
				ID: result.ID
			};
			var info_role = {
				RoleCode: data.Type
			};

			Services.UserRole.CreateUserRoleWhenCreateUser(result, info_role)
			.then(function(success) {

				data.CreatedDate = dated;
				data.CreatedBy = req.user?req.user.ID:null;
				data.UserAccountID = result.ID;
				 if(data.Title) {
				 	data.Title = data.Title.toString();
				 } else {
				 	data.Title = '';
				 }
				//data.Speciality = HelperService.EXTERTAL_PRACTITIONER;

				Services.Doctor.CreateDoctor(data)
				.then(function(success) {
					var info_actv = {
						UserUID: result.UID,
						Type: HelperService.const.systemType.website,
						CreatedBy: result.ID
					};

					// Activation
					Services.UserActivation
					.CreateUserActivation(info_actv)
					.then(function(result_actv) {
						var info_show = {
							UID: result.UID,
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
			})
			.catch(function(err) {
				res.serverError(ErrorWrap(err));
			});

		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/*
		ConfirmActivated: Confirm code
		Input: Verifycode, UserUID,Method
		Ouput: success or error
	*/
	ConfirmActivated: function(req, res) {

		var data = req.body.data;

		var info = {
			UserUID: data.UserUID,
			SystemType: HelperService.const.systemType.website,
			VerificationCode: data.VerificationCode,
			Method: HelperService.const.verificationMethod.code
		};

		console.log(info);

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
		Input: UID, 
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

	}

};