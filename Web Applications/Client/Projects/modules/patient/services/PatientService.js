angular.module('app.authentication.patient.services',[])
.factory("PatientService", function(Restangular, $state,$q){
	var PatientService = {};
	var api = Restangular.all("api");

	PatientService.detailPatient = function(data){
		var detailPatient = api.all("patient/detail-patient");
		return detailPatient.post({data:data});
	};

	PatientService.loadlistPatient = function(data){
		var loadlistPatient = api.all("patient/loadlist-patient");
		return loadlistPatient.post({data:data});
	};

	PatientService.updatePatient = function(data){
		var updatePatient = api.all("patient/update-patient");
		return updatePatient.post({data:data});
	};

	PatientService.checkPatient = function(data){
		var checkPatient = api.all("patient/check-patient");
		return checkPatient.post({data:data});
	};

	PatientService.createPatient = function(data){
		var createPatient = api.all("patient/create-patient");
		return createPatient.post({data:data});
	};

	PatientService.searchPatient = function(data){
		var searchPatient = api.all("patient/search-patient");
		return searchPatient.post({data:data});
	};

	PatientService.validate = function(info) {
		var error = [];
		var q = $q.defer();
		try {
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

			//validate Gender
			if(info.Gender){
				if(info.Gender != "F" && info.Gender != "M"){
					error.push({field:"Gender",message:"Gender.invalid-value"});
				}
			}
			else {
				error.push({field:"Gender",message:"Gender.required"});
			}

			//validate Address1
			if(info.Address1){
				if(info.Address1.length < 0 || info.Address1.length > 255){
					error.push({field:"Address1",message:"Address1.length"});
				}
			}
			// else {
			// 	error.push({field:"Address1",message:"Address1.required"});
			// }

			//validate Address2
			if(info.Address2){
				if(info.Address2.length < 0 || info.Address2.length > 255){
					error.push({field:"Address2",message:"Address2.length"});
				}
			}
			// else {
			// 	error.push({field:"Address2",message:"Address2.required"});
			// }

			//validate Suburb
			if(info.Suburb){
				if(info.Suburb.length < 0 || info.Suburb.length > 255){
					error.push({field:"Suburb",message:"Suburb.length"});
				}
			}
			// else {
			// 	error.push({field:"Suburb",message:"Suburb.required"});
			// }

			//validate Postcode
			if(info.Postcode){
				if(info.Postcode.length < 0 || info.Postcode.length > 255){
					error.push({field:"Postcode",message:"Postcode.length"});
				}
			}
			// else {
			// 	error.push({field:"Postcode",message:"Postcode.required"});
			// }

			// validate Email? hoi a Tan su dung exception
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
			
			//validate Occupation
			if(info.Occupation){
				if(info.Occupation.length < 0 || info.Occupation.length > 255){
					error.push({field:"Occupation",message:"Occupation.length"});
				}
			}
			// else {
			// 	error.push({field:"Occupation",message:"Occupation.required"});
			// }


			//validate WorkPhone
			if(info.WorkPhoneNumber){
				var auWorkPhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
				var WorkPhoneNumber=info.WorkPhoneNumber.replace('/[\(\)\s\-]/g','');
				if(!auWorkPhoneNumberPattern.test(WorkPhoneNumber)){
					error.push({field:"WorkPhoneNumber",message:"WorkPhoneNumber.invalid-value"});
				}
			}
			// else {
			// 	error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.required"});
			// }

			//validate HomePhoneNumber? hoi a Tan su dung exception
			if(info.HomePhoneNumber){
				var auHomePhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
				var HomePhone=info.HomePhoneNumber.replace('/[\(\)\s\-]/g','');
				if(!auHomePhoneNumberPattern.test(HomePhone)){
					error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.invalid-value"});
				}
			}
			// else {
			// 	error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.required"});
			// }

			//validate State
			if(info.State){
				if(info.State.length < 0 || info.State.length > 255){
					error.push({field:"State",message:"State.length"});
				}
			}
			// else {
			// 	error.push({field:"State",message:"State.required"});
			// }

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

	PatientService.validateCheckPhone = function(info) {
		var error = [];
		var q = $q.defer();
		try {
			//validate FirstName
			if(info.FirstName){
				if(info.FirstName.length < 0 || info.FirstName.length > 50){
					error.push({field:"FirstName",message:"length"});
				}
			}
			else {
				error.push({field:"FirstName",message:"required"});
			}

			//validate MiddleName
			if(info.MiddleName){
				if(info.MiddleName.length < 0 || info.MiddleName.length > 100){
					error.push({field:"MiddleName",message:"length"});
				}
			}
			else {
				error.push({field:"MiddleName",message:"required"});
			}

			//validate LastName
			if(info.LastName){
				if(info.LastName.length < 0 || info.LastName.length > 50){
					error.push({field:"LastName",message:"length"});
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
			//q.resolve({status:'success'});

		}
		catch(error){
			q.reject(error);
		}
		return q.promise;
	};

	return PatientService;
})
