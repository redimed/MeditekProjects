var app = angular.module('app.unAuthentication.controller', [
	// For Doctor
	'app.unAuthentication.login.controller',
	'app.unAuthentication.register.controller',
	'app.unAuthentication.activation.controller',
	'app.unAuthentication.forgot.controller',
	'app.unAuthentication.changepass.controller',
]);

app.controller('unAuthenticationCtrl', function($scope, $q, toastr){

	$scope.data = {};
	var characterRegex = /^[a-zA-Z0-9\s]{0,255}$/;
	var addressRegex = /^[a-zA-Z0-9\s,'-\/]{0,255}$/;
	var postcodeRegex = /^[0-9]{4}$/;
	var usercodeRegex = /^[a-z0-9_]{0,255}$/;
	$scope.validateCheck = function(info) {
		var error = [];
		var q = $q.defer();
		try {
			//validate UserName
			if(info.UserName){
				if(info.UserName.length < 0 || info.UserName.length > 50){
					error.push({field:"UserName",message:"length"});
					// toastr.error('UserName is too long or too short');
				}
				if(!usercodeRegex.test(info.UserName)){
					error.push({field:"UserName",message:"invalid value"});
				}
			}
			else {
				error.push({field:"UserName",message:"required"});
				// toastr.error('UserName is required');
			}

			//validate Password
			if(info.Password){
				if(info.Password.length < 6 || info.Password.length > 256){
					error.push({field:"Password",message:"length"});
					// toastr.error('Password is required');
				}
				if(!characterRegex.test(info.Password)){
					error.push({field:"Password",message:"invalid value"});
				}
			}
			else {
				error.push({field:"Password",message:"required"});
				// toastr.error('UserName is required');
			}

			//validate RePassword
			if(info.RePassword){
				if(info.RePassword.length < 6 || info.RePassword.length > 256){
					error.push({field:"RePassword",message:"length"});
					// toastr.error('RePassword is required');
				}
				if(!characterRegex.test(info.RePassword)){
					error.push({field:"RePassword",message:"invalid value"});
				}
			}
			else {
				error.push({field:"RePassword",message:"required"});
				// toastr.error('RePassword is required');
			}

			//validate PhoneNumber
			if(info.PhoneNumber){
				var auPhoneNumberPattern=new RegExp(/^(\+61|0061|0)?4[0-9]{8}$/);
				var PhoneNumber=info.PhoneNumber.replace('/[\(\)\s\-]/g','');
				if(!auPhoneNumberPattern.test(PhoneNumber)){
					error.push({field:"PhoneNumber",message:"Phone Number is a 10 digits number. Eg: 04 xxxx xxxx"});
					// toastr.error('MobilePhone invalid');
				}
			}
			else{
				error.push({field:"PhoneNumber",message:"required"});
				// toastr.error('MobilePhone is required');
			}

			if(info.Email){
				var EmailPattern=new RegExp(/^\w+([a-zA-Z0-9\.-]?\w+)*@\w+([a-z][\.-]?\w+)*([a-z]\.\w{2,4})+$/);
				if(!EmailPattern.test(info.Email)){
					error.push({field:"Email",message:"invalid email"});
					// toastr.error('Email not invalid');
				}
			}
			else {
				error.push({field:"Email",message:"required"});
				// toastr.error('Email is required');
			}

			if(error.length>0){
				throw error;
			}
			else{
				q.resolve({status:'success'});
			}

		}
		catch(error){
			q.reject(error);
		}
		return q.promise;
	};

	$scope.validateInfo = function(info) {
		var error = [];
		var q = $q.defer();
		try {

			//validate FirstName
			if(info.FirstName){
				if(info.FirstName.length < 0 || info.FirstName.length > 50){
					error.push({field:"FirstName",message:"length"});
					// toastr.error('FirstName is too long or too short');
				}
				if(!characterRegex.test(info.FirstName)){
					error.push({field:"FirstName",message:"invalid value"});
				}
			}
			else {
				error.push({field:"FirstName",message:"required"});
				// toastr.error('FirstName is required');
			}

			//validate MiddleName
			if(info.MiddleName){
				if(info.MiddleName.length > 100){
					error.push({field:"MiddleName",message:"length"});
					// toastr.error('MiddleName is too long');
				}
				if(!characterRegex.test(info.MiddleName)){
					error.push({field:"MiddleName",message:"invalid value"});
				}
			}

			//validate Lastname
			if(info.LastName){
				if(info.LastName.length < 0 || info.LastName.length > 255){
					error.push({field:"LastName",message:"length"});
					// toastr.error('LastName is too long or too short');
				}
				if(!characterRegex.test(info.LastName)){
					error.push({field:"LastName",message:"invalid value"});
				}
			}
			else {
				error.push({field:"LastName",message:"required"});
				// toastr.error('LastName is required');
			}

			//validate HealthLinkID
			if(info.HealthLinkID){
				if(info.HealthLinkID.length < 0 || info.HealthLinkID.length > 255){
					error.push({field:"HealthLinkID",message:"length"});
					// toastr.error('HealthLink ID is too long or too short');
				}
				if(!characterRegex.test(info.HealthLinkID)){
					error.push({field:"HealthLinkID",message:"invalid value"});
				}
			}
			else {
				error.push({field:"HealthLinkID",message:"required"});
				// toastr.error('HealthLink ID is required');
			}

			//validate ProviderNumber
			if(info.ProviderNumber){
				if(info.ProviderNumber.length < 0 || info.ProviderNumber.length > 255){
					error.push({field:"ProviderNumber",message:"length"});
					// toastr.error('ProviderNumber is too long or too short');
				}
				if(!characterRegex.test(info.ProviderNumber)){
					error.push({field:"ProviderNumber",message:"invalid value"});
				}
			}
			else {
				error.push({field:"ProviderNumber",message:"required"});
				// toastr.error('ProviderNumber is required');
			}

			//validate WorkPhoneNumber
			if(info.WorkPhoneNumber){
				if(info.WorkPhoneNumber.length > 0){
					var auPhoneNumberPattern=new RegExp(/^[0-9]{6,10}$/);
					var PhoneNumber=info.WorkPhoneNumber.replace('/[\(\)\s\-]/g','');
					if(!auPhoneNumberPattern.test(PhoneNumber)){
						error.push({field:"WorkPhoneNumber",message:"Phone Number is invalid. The number is a 6-10 digits number"});
						// toastr.error('WorkPhone invalid');
					}
				}
			}

			//validate Homephone
			if(info.HomePhoneNumber){
				if(info.HomePhoneNumber.length > 0) {
					var auPhoneNumberPattern=new RegExp(/^[0-9]{6,10}$/);
					var PhoneNumber=info.HomePhoneNumber.replace('/[\(\)\s\-]/g','');
					if(!auPhoneNumberPattern.test(PhoneNumber)){
						error.push({field:"HomePhoneNumber",message:"Phone Number is invalid. The number is a 6-10 digits number"});
						// toastr.error('HomePhone invalid');
					}
				}
			}

			//validate Address1
			if(info.Address1){
				if(info.Address1.length > 255){
					error.push({field:"Address1",message:"length"});
					// toastr.error('Address1 is too long');
				}
				if(!addressRegex.test(info.Address1)){
					error.push({field:"Address1",message:"invalid value"});
				}
			}
			else {
				error.push({field:"Address1",message:"required"});
			}

			//validate Address2
			if(info.Address2){
				if(info.Address2.length > 255){
					error.push({field:"Address2",message:"length"});
					// toastr.error('Address2 is too long');
				}
				if(!addressRegex.test(info.Address2)){
					error.push({field:"Address2",message:"invalid value"});
				}
			}

			//validate Postcode
			if(info.Postcode){
				if(info.Postcode.length < 0 || info.Postcode.length > 100){
					error.push({field:"Postcode",message:"length"});
					// toastr.error('Postcode is too long or too short');
				}
				if(!postcodeRegex.test(info.Postcode)){
					error.push({field:"Postcode",message:"invalid value"});
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
					// toastr.error('Suburb is too long or too short');
				}
				if(!characterRegex.test(info.Suburb)){
					error.push({field:"Suburb",message:"invalid value"});
				}
			}
			else {
				error.push({field:"Suburb",message:"required"});
				// toastr.error('Suburb is required');
			}

			//validate State
			if(info.State){
				if(info.State.length < 0 || info.State.length > 100){
					error.push({field:"State",message:"length"});
					// toastr.error('State is too long or too short');
				}
			}
			else {
				error.push({field:"State",message:"required"});
				// toastr.error('State is required');
			}

			//validate CountryID
			if(info.CountryID){
				if(info.CountryID.length < 0){
					error.push({field:"CountryID",message:"length"});
				}
			}
			else {
				error.push({field:"CountryID",message:"required"});
				// toastr.error('Country is required');
			}
			//validate captcha
			if(info.captcha==null || info.captcha==undefined || info.captcha==""){
				error.push({field:"captcha",message:"required"});
			}

			if(error.length>0){
				throw error;
			}
			else{
				q.resolve({status:'success'});
			}

		}
		catch(error){
			q.reject(error);
		}
		return q.promise;
	};

	$scope.checkCode = function(info) {
		var error = [];
		var q = $q.defer();
		try {
			if(info.verifyCode) {
				if(info.verifyCode.length < 0) {
					error.push({field:"verifyCode",message:"length"});
				}
			}
			else {
				error.push({field:"verifyCode",message:"required"});
			}

			if(error.length>0){
				throw error;
			}
			else{
				q.resolve({status:'success'});
			}
		}
		catch(error) {
			q.reject(error);
		}
		return q.promise;
	};

});