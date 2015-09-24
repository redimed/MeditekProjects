var config = sails.config.myconf;
//****Twilio Client for sending SMS
var twilioClient = require('twilio')(config.twilioSID, config.twilioToken);

//****Check and parse string to JSON object******
function toJson(str){
	var obj;
	try {
        obj = JSON.parse(str);
    } catch (e) {
        obj = str;
    }
    return obj;
};

//****Send SMS function******
function sendSMS(toNumber,content,callback){
	twilioClient.messages.create({
	    body: content,
	    to: toNumber,
	    from: config.twilioPhone
	},callback());
};

module.exports = {
	test: function(req,res){
		UserAccount.hasOne(TelehealthUser, {foreignKey:'ID'});
		TelehealthUser.belongsTo(UserAccount, {foreignKey: 'userAccountID'});
		TelehealthUser.findAll({
			include: [{
				model: UserAccount,
				as: UserAccount.tableName
			}]})
			.then(function(data){
				res.json({status:data});
			})
	},
	
	TelehealthLogin: function(req,res){

	},

	RequestActivationCode: function(req,res){
		if(typeof req.body.info == 'undefined')
			res.json({status:'error', message: 'Invalid Parameters!'});
		var info = toJson(req.body.info);
		if(info){
			var phoneNumber = typeof info.phone != 'undefined' ? info.phone : null;
			var deviceToken = typeof info.token != 'undefined' ? info.token : null;
		  	var phoneRegex = /^\+[0-9]{9,15}$/;
		  	var verificationCode = Math.floor(Math.random()*9000) + 1000;
			if(phoneNumber != null && phoneNumber.match(phoneRegex) && deviceToken != null){
				UserAccount.find({where:{
					phoneNumber: phoneNumber
				}},{raw:true})
					.then(function(user){
						if(user)
						{
							UserActivation.findOrCreate({where:{
								userAccountID: user.ID,
								deviceToken: deviceToken
							},defaults:{verificationCode: verificationCode.toString()}})
								.spread(function(userActivate, created){
									if(!created){
										userActivate.update({
											verificationCode: verificationCode.toString()
										})
										.then(function(){
											sendSMS(phoneNumber,"Your verification code is "+verificationCode,function(err, message) {
												if(err){
													sails.log.error("=====SMS Error=====: ",err);
													res.json({status:'error', message: 'Error!'});
												}
												res.json({status:'success',message: 'Request Verification Code Successfully!'});
											});
										})
										.catch(function(err){
											res.json({status:'error', message: err});
										})
									}
									else
									{
										sendSMS(phoneNumber,"Your verification code is "+verificationCode,function(err, message) {
											if(err){
												sails.log.error("=====SMS Error=====: ",err);
												res.json({status:'error', message: 'Error!'});
											}
											res.json({status:'success',message: 'Request Verification Code Successfully!'});
										});
									}
								})
								.catch(function(err){
									res.json({status:'error', message: err});
								})
							
						} else
							res.json({status:'error', message: 'User Not Exist!'})
					})
					.catch(function(err){
						res.json({status:'error', message: err});
					})
			}
			else
				res.json({status:'error', message: 'Invalid Parameters!'})
		}
		else
			res.json({status:'error', message: 'Invalid Parameters!'})
	},

	VerifyActivationCode: function(req,res){
		if(typeof req.body.info == 'undefined')
			res.json({status:'error', message: 'Invalid Parameters!'});
		var info = toJson(req.body.info);
		if(info){
			var verifyCode = typeof info.code != 'undefined' ? info.code : null;
			var deviceToken = typeof info.token != 'undefined' ? info.token : null;

			if(verifyCode != null || deviceToken != null){
				UserActivation.find({where:{
					verificationCode: verifyCode,
					deviceToken: deviceToken
				}})
				.then(function(userActivate){
					if(userActivate)
						res.json({status:'success',message:'User Activated!'})
					else
						res.json({status:'error',message:'Invalid Code!'})
				})
				.catch(function(err){
					res.json({status:'error', message: err});
				})
			}
			else
				res.json({status:'error', message: 'Invalid Parameters!'})
		}
	}
}