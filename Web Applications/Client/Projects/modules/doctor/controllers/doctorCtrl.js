angular.module('app.authentication.doctor.controller', [
	'app.authentication.doctor.list.controller',
	'app.authentication.doctor.create.controller',
	'app.authentication.doctor.profile.controller'
])
.controller('doctorCtrl', function($scope, $q, toastr){

	$scope.data = {};
	$scope.validate = function(info) {
		var error = [];
		var q = $q.defer();
		try {

			//validate CountryID
			if(info.CountryID){
				if(info.CountryID.length < 0 || info.HealthLinkID.length > 255){
					error.push({field:"CountryID",message:"CountryID.length"});
				}
			}
			else {
				error.push({field:"CountryID",message:"CountryID.required"});
			}
			//validate HealthLinkID
			if(info.HealthLinkID){
				if(info.HealthLinkID.length < 0 || info.HealthLinkID.length > 255){
					error.push({field:"HealthLinkID",message:"HealthLinkID.length"});
				}
			}
			else {
				error.push({field:"HealthLinkID",message:"HealthLinkID.required"});
			}
			//validate FirstName
			if(info.FirstName){
				if(info.FirstName.length < 0 || info.FirstName.length > 50){
					error.push({field:"FirstName",message:"FirstName.length"});
				}
			}
			else {
				error.push({field:"FirstName",message:"FirstName.required"});
			}

			//validate MiddleName
			if(info.MiddleName){
				if(info.MiddleName.length < 0 || info.MiddleName.length > 100){
					error.push({field:"MiddleName",message:"MiddleName.length"});
				}
			}
			else {
				error.push({field:"MiddleName",message:"MiddleName.required"});
			}

			//validate LastName
			if(info.LastName){
				if(info.LastName.length < 0 || info.LastName.length > 50){
					error.push({field:"LastName",message:"LastName.length"});
				}
			}
			else {
				error.push({field:"LastName",message:"LastName.required"});
			}

			//validate Address1
			if(info.Address1){
				if(info.Address1.length < 0 || info.Address1.length > 255){
					error.push({field:"Address1",message:"Address1.length"});
				}
			}
			else {
				error.push({field:"Address1",message:"Address1.required"});
			}

			//validate Address2
			if(info.Address2){
				if(info.Address2.length < 0 || info.Address2.length > 255){
					error.push({field:"Address2",message:"Address2.length"});
				}
			}
			else {
				error.push({field:"Address2",message:"Address2.required"});
			}

			//validate Suburb
			if(info.Suburb){
				if(info.Suburb.length < 0 || info.Suburb.length > 255){
					error.push({field:"Suburb",message:"Suburb.length"});
				}
			}
			else {
				error.push({field:"Suburb",message:"Suburb.required"});
			}

			//validate Postcode
			if(info.Postcode){
				if(info.Postcode.length < 0 || info.Postcode.length > 255){
					error.push({field:"Postcode",message:"Postcode.length"});
				}
			}
			else {
				error.push({field:"Postcode",message:"Postcode.required"});
			}

			if(info.Email){
				var EmailPattern=new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
				var Email=info.Email.replace('/[\(\)\s\-]/g','');
				if(!EmailPattern.test(Email)){
					error.push({field:"Email",message:"Email.invalid-value"});
				}
			}
			else {
				error.push({field:"Email",message:"Email.required"});
			}
			


			//validate WorkPhone
			if(info.WorkPhoneNumber){
				var auWorkPhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
				var WorkPhoneNumber=info.WorkPhoneNumber.replace('/[\(\)\s\-]/g','');
				if(!auWorkPhoneNumberPattern.test(WorkPhoneNumber)){
					error.push({field:"WorkPhoneNumber",message:"WorkPhoneNumber.invalid-value"});
				}
			}
			else {
				error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.required"});
			}

			//validate HomePhoneNumber? hoi a Tan su dung exception
			if(info.HomePhoneNumber){
				var auHomePhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
				var HomePhone=info.HomePhoneNumber.replace('/[\(\)\s\-]/g','');
				console.log(HomePhone);
				if(!auHomePhoneNumberPattern.test(HomePhone)){
					error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.invalid-value"});
				}
			}
			else {
				error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.required"});
			}

			//validate State
			if(info.State){
				if(info.State.length < 0 || info.State.length > 255){
					error.push({field:"State",message:"State.length"});
				}
			}
			else {
				error.push({field:"State",message:"State.required"});
			}

			if(error.length>0){
				throw error;
			}
			else{
				q.resolve({status:'success'});
			}
			//q.resolve({status:'success'});

		}
		catch(error){
			q.reject(error);
		}
		return q.promise;
	};

	$scope.validateCheckPhone = function(info) {
		var error = [];
		var q = $q.defer();
		try {
			//validate FirstName
			if(info.FirstName){
				if(info.FirstName.length < 0 || info.FirstName.length > 50){
					error.push({field:"FirstName",message:"length"});
					toastr.error('FirstName is too long or too min');
				}
			}
			else {
				error.push({field:"FirstName",message:"required"});
			}

			//validate MiddleName
			if(info.MiddleName){
				if(info.MiddleName.length < 0 || info.MiddleName.length > 100){
					error.push({field:"MiddleName",message:"length"});
					toastr.error('MiddleName is too long or too min');
				}
			}
			else {
				error.push({field:"MiddleName",message:"required"});
			}

			//validate LastName
			if(info.LastName){
				if(info.LastName.length < 0 || info.LastName.length > 255){
					error.push({field:"LastName",message:"length"});
					toastr.error('LastName is too long or too min');
				}
			}
			else {
				error.push({field:"LastName",message:"required"});
			}

			//validate PhoneNumber
			if(info.PhoneNumber){
				var auPhoneNumberPattern=new RegExp(/^(\+61|0061|0)?4[0-9]{8}$/);
				var PhoneNumber=info.PhoneNumber.replace('/[\(\)\s\-]/g','');
				if(!auPhoneNumberPattern.test(PhoneNumber)){
					error.push({field:"PhoneNumber",message:"PhoneNumber.invalid-value"});
					toastr.error('PhoneNumber not invalid');
				}
			}
			else{
				error.push({field:"PhoneNumber",message:"required"});
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

	$scope.validateCheckInfo = function(info) {
		var error = [];
		var q = $q.defer();
		try {

			//validate HealthLinkID
			if(info.HealthLinkID){
				if(info.HealthLinkID.length < 0 || info.HealthLinkID.length > 255){
					error.push({field:"HealthLinkID",message:"HealthLinkID.length"});
				}
			}
			else {
				error.push({field:"HealthLinkID",message:"HealthLinkID.required"});
			}

			//validate Address1
			if(info.Address1){
				if(info.Address1.length < 0 || info.Address1.length > 255){
					error.push({field:"Address1",message:"Address1.length"});
				}
			}
			else {
				error.push({field:"Address1",message:"Address1.required"});
			}

			//validate Address2
			if(info.Address2){
				if(info.Address2.length < 0 || info.Address2.length > 255){
					error.push({field:"Address2",message:"Address2.length"});
				}
			}
			else {
				error.push({field:"Address2",message:"Address2.required"});
			}

			//validate Suburb
			if(info.Suburb){
				if(info.Suburb.length < 0 || info.Suburb.length > 255){
					error.push({field:"Suburb",message:"Suburb.length"});
				}
			}
			else {
				error.push({field:"Suburb",message:"Suburb.required"});
			}

			//validate Postcode
			if(info.Postcode){
				if(info.Postcode.length < 0 || info.Postcode.length > 255){
					error.push({field:"Postcode",message:"Postcode.length"});
				}
			}
			else {
				error.push({field:"Postcode",message:"Postcode.required"});
			}

			if(info.Email){
				var EmailPattern=new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
				var Email=info.Email.replace('/[\(\)\s\-]/g','');
				if(!EmailPattern.test(Email)){
					error.push({field:"Email",message:"Email.invalid-value"});
					toastr.error('PhoneNumber not invalid');
				}
			}
			else {
				error.push({field:"Email",message:"Email.required"});
			}
			


			//validate WorkPhone
			if(info.WorkPhoneNumber){
				var auWorkPhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
				var WorkPhoneNumber=info.WorkPhoneNumber.replace('/[\(\)\s\-]/g','');
				if(!auWorkPhoneNumberPattern.test(WorkPhoneNumber)){
					error.push({field:"WorkPhoneNumber",message:"WorkPhoneNumber.invalid-value"});
					toastr.error('WorkPhoneNumber not invalid');
				}
			}
			else {
				error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.required"});
			}

			//validate HomePhoneNumber? hoi a Tan su dung exception
			if(info.HomePhoneNumber){
				var auHomePhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
				var HomePhone=info.HomePhoneNumber.replace('/[\(\)\s\-]/g','');
				console.log(HomePhone);
				if(!auHomePhoneNumberPattern.test(HomePhone)){
					error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.invalid-value"});
					toastr.error('HomePhoneNumber not invalid');
				}
			}
			else {
				error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.required"});
			}

			//validate State
			if(info.State){
				if(info.State.length < 0 || info.State.length > 255){
					error.push({field:"State",message:"State.length"});
				}
			}
			else {
				error.push({field:"State",message:"State.required"});
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

});
