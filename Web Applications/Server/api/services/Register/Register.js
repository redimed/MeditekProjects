var $q = require('q');
var check  = require('../HelperService');
module.exports = {

	validate : function(info,step) {
		var characterRegex = new RegExp(check.regexPattern.character);
		var addressRegex   = new RegExp(check.regexPattern.address);
		var postcodeRegex  = new RegExp(check.regexPattern.postcode);
		var isStep = step==true?true:false;
		var error = [];
		//create a error with contain a list errors input
		var err = new Error("ERRORS");
		var q = $q.defer();
			if(isStep==true){
				try {

					//validate UserName
					if(info.UserName!=undefined && info.UserName){
						if(info.UserName.length < 0 || info.UserName.length > 50){
							error.push({field:"UserName",message:"max length"});
							err.pushErrors(error);
						}
						if(!characterRegex.test(info.UserName)){
							error.push({field:"UserName",message:"invalid value"});
							err.pushErrors(error);
						}
					}
					else{
						error.push({field:"UserName",message:"required"});
						err.pushErrors(error);
					}

					//validate Password
					if(info.Password!=undefined && info.Password){
						if(info.Password.length < 0 || info.Password.length > 50){
							error.push({field:"Password",message:"max length"});
							err.pushErrors(error);
						}
						if(!characterRegex.test(info.Password)){
							error.push({field:"Password",message:"invalid value"});
							err.pushErrors(error);
						}
					}
					else{
						error.push({field:"Password",message:"required"});
						err.pushErrors(error);
					}

					//validate RePassword
					if(info.RePassword!=undefined && info.RePassword){
						if(info.RePassword.length < 0 || info.RePassword.length > 50){
							error.push({field:"RePassword",message:"max length"});
							err.pushErrors(error);
						}
						if(!characterRegex.test(info.RePassword)){
							error.push({field:"RePassword",message:"invalid value"});
							err.pushErrors(error);
						}
					}
					else{
						error.push({field:"RePassword",message:"required"});
						err.pushErrors(error);
					}

					//validate PhoneNumber
					if(info.PhoneNumber!=undefined && info.PhoneNumber){
						var auPhoneNumberPattern=new RegExp(/^(\+61|0061|0)?4[0-9]{8}$/);
						var PhoneNumber=info.PhoneNumber.replace('/[\(\)\s\-]/g','');
						if(!auPhoneNumberPattern.test(PhoneNumber)){
							error.push({field:"PhoneNumber",message:"Phone Number is a 10 digits number. Eg: 04 xxxx xxxx"});
							err.pushErrors(error);
						}
					}
					else{
						error.push({field:"PhoneNumber",message:"required"});
						err.pushErrors(error);
						// toastr.error('PhoneNumber is required');
					}

					// validate Email? hoi a Tan su dung exception
					if(info.Email!=undefined && info.Email){
						var EmailPattern=new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/);
						if(!EmailPattern.test(info.Email)){
							error.push({field:"Email",message:"invalid value"});
							err.pushErrors(error);
						}
					}

					if(info.RePassword!=undefined && info.RePassword && info.Password!=undefined && info.Password){
						if(info.RePassword !== info.Password) {
							error.push({field:"RePassword",message:"does not match"});
							error.push({field:"Password",message:"does not match"});
						}
					}

					else{
						error.push({field:"Email",message:"required"});
						err.pushErrors(error);
						// toastr.error('PhoneNumber is required');
					}

					if(error.length>0){
						throw err;
					}
					else{
						q.resolve({status:'success'});
					}

				}
				catch(err){
					q.reject(err);
				}
			}
			else {
				try {

					//validate FirstName
					if(info.FirstName){
						if(info.FirstName.length < 0 || info.FirstName.length > 50){
							error.push({field:"FirstName",message:"length"});
							err.pushErrors(error);
							// toastr.error('FirstName is too long or too short');
						}
						if(!characterRegex.test(info.FirstName)){
							error.push({field:"FirstName",message:"invalid value"});
							err.pushErrors(error);
						}
					}
					else {
						error.push({field:"FirstName",message:"required"});
						err.pushErrors(error);
						// toastr.error('FirstName is required');
					}

					//validate MiddleName
					if(info.MiddleName){
						if(info.MiddleName.length > 100){
							error.push({field:"MiddleName",message:"length"});
							err.pushErrors(error);
							// toastr.error('MiddleName is too long');
						}
						if(!characterRegex.test(info.MiddleName)){
							error.push({field:"MiddleName",message:"invalid value"});
							err.pushErrors(error);
						}
					}

					//validate Lastname
					if(info.LastName){
						if(info.LastName.length < 0 || info.LastName.length > 255){
							error.push({field:"LastName",message:"length"});
							err.pushErrors(error);
							// toastr.error('LastName is too long or too short');
						}
						if(!characterRegex.test(info.LastName)){
							error.push({field:"LastName",message:"invalid value"});
							err.pushErrors(error);
						}
					}
					else {
						error.push({field:"LastName",message:"required"});
						err.pushErrors(error);
						// toastr.error('LastName is required');
					}

					//validate HealthLinkID
					if(info.HealthLinkID){
						if(info.HealthLinkID.length < 0 || info.HealthLinkID.length > 255){
							error.push({field:"HealthLinkID",message:"length"});
							err.pushErrors(error);
							// toastr.error('HealthLink ID is too long or too short');
						}
						if(!characterRegex.test(info.HealthLinkID)){
							error.push({field:"HealthLinkID",message:"invalid value"});
							err.pushErrors(error);
						}
					}
					else {
						error.push({field:"HealthLinkID",message:"required"});
						err.pushErrors(error);
						// toastr.error('HealthLink ID is required');
					}

					//validate ProviderNumber
					if(info.ProviderNumber){
						if(info.ProviderNumber.length < 0 || info.ProviderNumber.length > 255){
							error.push({field:"ProviderNumber",message:"length"});
							err.pushErrors(error);
							// toastr.error('ProviderNumber is too long or too short');
						}
						if(!characterRegex.test(info.ProviderNumber)){
							error.push({field:"ProviderNumber",message:"invalid value"});
							err.pushErrors(error);
						}
					}
					else {
						error.push({field:"ProviderNumber",message:"required"});
						err.pushErrors(error);
						// toastr.error('ProviderNumber is required');
					}

					//validate WorkPhoneNumber
					if(info.WorkPhoneNumber){
						if(info.WorkPhoneNumber.length > 0){
							var auPhoneNumberPattern=new RegExp(/^[1-9]{6,10}$/);
							var PhoneNumber=info.WorkPhoneNumber.replace('/[\(\)\s\-]/g','');
							if(!auPhoneNumberPattern.test(PhoneNumber)){
								error.push({field:"WorkPhoneNumber",message:"Phone Number is invalid. The number is a 6-10 digits number"});
								err.pushErrors(error);
								// toastr.error('WorkPhone invalid');
							}
						}
					}

					//validate Homephone
					if(info.HomePhoneNumber){
						if(info.HomePhoneNumber.length > 0) {
							var auPhoneNumberPattern=new RegExp(/^[1-9]{6,10}$/);
							var PhoneNumber=info.HomePhoneNumber.replace('/[\(\)\s\-]/g','');
							if(!auPhoneNumberPattern.test(PhoneNumber)){
								error.push({field:"HomePhoneNumber",message:"Phone Number is invalid. The number is a 6-10 digits number"});
								err.pushErrors(error);
								// toastr.error('HomePhone invalid');
							}
						}
					}

					//validate Address1
					if(info.Address1){
						if(info.Address1.length > 255){
							error.push({field:"Address1",message:"length"});
							err.pushErrors(error);
							// toastr.error('Address1 is too long');
						}
						if(!addressRegex.test(info.Address1)){
							error.push({field:"Address1",message:"invalid value"});
							err.pushErrors(error);
						}
					}
					else {
						error.push({field:"Address1",message:"required"});
						err.pushErrors(error);
					}

					//validate Address2
					if(info.Address2){
						if(info.Address2.length > 255){
							error.push({field:"Address2",message:"length"});
							err.pushErrors(error);
							// toastr.error('Address2 is too long');
						}
						if(!addressRegex.test(info.Address2)){
							error.push({field:"Address2",message:"invalid value"});
							err.pushErrors(error);
						}
					}

					//validate Postcode
					if(info.Postcode){
						if(info.Postcode.length < 0 || info.Postcode.length > 100){
							error.push({field:"Postcode",message:"length"});
							err.pushErrors(error);
						}
							// toastr.error('Postcode is too long or too short');
						if(!postcodeRegex.test(info.Postcode)){
							error.push({field:"Postcode",message:"invalid value"});
							err.pushErrors(error);
						}
					}
					else {
						error.push({field:"Postcode",message:"required"});
						// toastr.error('Postcode is required');
					}

					//validate Suburb
					if(info.Suburb){
						if(info.Suburb.length < 0 || info.Suburb.length > 100){
							error.push({field:"Suburb",message:"length"});
							err.pushErrors(error);
							// toastr.error('Suburb is too long or too short');
						}
						if(!characterRegex.test(info.Suburb)){
							error.push({field:"Suburb",message:"invalid value"});
							err.pushErrors(error);
						}
					}
					else {
						error.push({field:"Suburb",message:"required"});
						err.pushErrors(error);
						// toastr.error('Suburb is required');
					}

					//validate State
					if(info.State){
						if(info.State.length < 0 || info.State.length > 100){
							error.push({field:"State",message:"length"});
							err.pushErrors(error);
							// toastr.error('State is too long or too short');
						}
					}
					else {
						error.push({field:"State",message:"required"});
						err.pushErrors(error);
						// toastr.error('State is required');
					}

					//validate CountryID
					if(info.CountryID){
						if(info.CountryID.length < 0){
							error.push({field:"CountryID",message:"length"});
							err.pushErrors(error);
						}
					}
					else {
						error.push({field:"CountryID",message:"required"});
						err.pushErrors(error);
						// toastr.error('Country is required');
					}
					//validate captcha
					if(info.captcha==null || info.captcha==undefined || info.captcha==""){
						error.push({field:"captcha",message:"required"});
						err.pushErrors(error);
					}

					if(error.length>0){
						throw err;
					}
					else{
						q.resolve({status:'success'});
					}

				}
				catch(err){
					q.reject(err);
				}
			}
		return q.promise;
	},
	/*
		CheckUsername: Is username exist?
	*/
	CheckUsername: function(data) {
		return UserAccount
					.findAll({
						where: {
							UserName: data
						}
					});
	},
	/*
		CheckEmail: Is email exist?
	*/
	CheckEmail: function(data) {
		return UserAccount
					.findAll({
						where: {
							$or: [
								{ UserName: data },
								{ Email: data }
							]
						}
					});
	},
	CheckUserStep1: function(data) {
		return Services.Register.validate(data,true)
		.then(function(success){
			return success;
		},function(err){
			throw err;
		})
	}

}