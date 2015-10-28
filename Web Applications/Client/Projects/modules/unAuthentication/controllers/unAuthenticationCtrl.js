var app = angular.module('app.unAuthentication.controller', [
	'app.unAuthentication.login.controller',
	'app.unAuthentication.register.controller',
	'app.unAuthentication.activation.controller'
]);

app.controller('unAuthenticationCtrl', function($scope, $q, toastr){

	$scope.data = {};

	$scope.validateCheck = function(info) {
		var error = [];
		var q = $q.defer();
		try {
			//validate UserName
			if(info.UserName){
				if(info.UserName.length < 0 || info.UserName.length > 50){
					error.push({field:"UserName",message:"length"});
					toastr.error('UserName is too long or too short');
				}
			}
			else {
				error.push({field:"UserName",message:"required"});
				toastr.error('UserName is required');
			}

			//validate Password
			if(info.Password){
				if(info.Password.length < 6) {
					error.push({field:"Password",message:"length"});
					toastr.error('Your password must be at least 6 characters');
				}
				if(info.Password.length < 0 || info.Password.length > 256){
					error.push({field:"Password",message:"length"});
					toastr.error('Password is required');
				}
			}
			else {
				error.push({field:"Password",message:"required"});
				toastr.error('UserName is required');
			}

			//validate RePassword
			if(info.RePassword && info.Password){
				if(info.RePassword != info.Password) {
					error.push({field:"RePassword",message:"length"});
					toastr.error('Your password and confirmation password do not match');
				}
			}
			else {
				error.push({field:"RePassword",message:"required"});
				toastr.error('RePassword is required');
			}

			//validate PhoneNumber
			if(info.PhoneNumber){
				var auPhoneNumberPattern=new RegExp(/^(\+61|0061|0)?4[0-9]{8}$/);
				var PhoneNumber=info.PhoneNumber.replace('/[\(\)\s\-]/g','');
				if(!auPhoneNumberPattern.test(PhoneNumber)){
					error.push({field:"PhoneNumber",message:"PhoneNumber.invalid-value"});
					toastr.error('MobilePhone invalid');
				}
			}
			else{
				error.push({field:"PhoneNumber",message:"required"});
				toastr.error('MobilePhone is required');
			}

			if(info.Email){
				var EmailPattern=new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
				var Email=info.Email.replace('/[\(\)\s\-]/g','');
				if(!EmailPattern.test(Email)){
					error.push({field:"Email",message:"Email.invalid-value"});
					toastr.error('Email not invalid');
				}
			}
			else {
				error.push({field:"Email",message:"Email.required"});
				toastr.error('Email is required');
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
					toastr.error('FirstName is too long or too short');
				}
			}
			else {
				error.push({field:"FirstName",message:"required"});
				toastr.error('FirstName is required');
			}

			//validate MiddleName
			if(info.MiddleName){
				if(info.MiddleName.length > 100){
					error.push({field:"MiddleName",message:"length"});
					toastr.error('MiddleName is too long');
				}
			}

			//validate Lastname
			if(info.LastName){
				if(info.LastName.length < 0 || info.LastName.length > 255){
					error.push({field:"LastName",message:"length"});
					toastr.error('LastName is too long or too short');
				}
			}
			else {
				error.push({field:"LastName",message:"required"});
				toastr.error('LastName is required');
			}

			//validate HealthLinkID
			if(info.HealthLinkID){
				if(info.HealthLinkID.length < 0 || info.HealthLinkID.length > 255){
					error.push({field:"HealthLinkID",message:"length"});
					toastr.error('HealthLink ID is too long or too short');
				}
			}
			else {
				error.push({field:"HealthLinkID",message:"required"});
				toastr.error('HealthLink ID is required');
			}

			//validate ProviderNumber
			if(info.ProviderNumber){
				if(info.ProviderNumber.length < 0 || info.ProviderNumber.length > 255){
					error.push({field:"ProviderNumber",message:"length"});
					toastr.error('ProviderNumber is too long or too short');
				}
			}
			else {
				error.push({field:"ProviderNumber",message:"required"});
				toastr.error('ProviderNumber is required');
			}

			//validate WorkPhoneNumber
			if(info.WorkPhoneNumber){
				if(info.WorkPhoneNumber.length > 0){
					var auPhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
					var PhoneNumber=info.WorkPhoneNumber.replace('/[\(\)\s\-]/g','');
					if(!auPhoneNumberPattern.test(PhoneNumber)){
						error.push({field:"WorkPhoneNumber",message:"WorkPhoneNumber.invalid-value"});
						toastr.error('WorkPhone invalid');
					}
				}
			}

			//validate Homephone
			if(info.HomePhoneNumber){
				if(info.HomePhoneNumber.length > 0) {
					var auPhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
					var PhoneNumber=info.HomePhoneNumber.replace('/[\(\)\s\-]/g','');
					if(!auPhoneNumberPattern.test(PhoneNumber)){
						error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.invalid-value"});
						toastr.error('HomePhone invalid');
					}
				}
			}

			//validate Address1
			if(info.Address1){
				if(info.Address1.length > 255){
					error.push({field:"Address1",message:"length"});
					toastr.error('Address1 is too long');
				}
			}

			//validate Address2
			if(info.Address2){
				if(info.Address2.length > 255){
					error.push({field:"Address2",message:"length"});
					toastr.error('Address2 is too long');
				}
			}

			//validate Postcode
			if(info.Postcode){
				if(info.Postcode.length < 0 || info.Postcode.length > 100){
					error.push({field:"Postcode",message:"length"});
					toastr.error('Postcode is too long or too short');
				}
			}
			else {
				error.push({field:"Postcode",message:"required"});
				toastr.error('Postcode is required');
			}

			//validate Suburb
			if(info.Suburb){
				if(info.Suburb.length < 0 || info.Suburb.length > 100){
					error.push({field:"Suburb",message:"length"});
					toastr.error('Suburb is too long or too short');
				}
			}
			else {
				error.push({field:"Suburb",message:"required"});
				toastr.error('Suburb is required');
			}

			//validate State
			if(info.State){
				if(info.State.length < 0 || info.State.length > 100){
					error.push({field:"State",message:"length"});
					toastr.error('State is too long or too short');
				}
			}
			else {
				error.push({field:"State",message:"required"});
				toastr.error('State is required');
			}

			//validate CountryID
			if(info.CountryID){
				if(info.CountryID.length < 0){
					error.push({field:"CountryID",message:"length"});
				}
			}
			else {
				error.push({field:"CountryID",message:"required"});
				toastr.error('Country is required');
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