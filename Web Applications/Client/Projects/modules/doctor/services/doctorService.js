angular.module('app.authentication.doctor.service', [])
.factory("doctorService", function(Restangular, $q, toastr) {

	var services = {};
	var api = Restangular.all('api');
	var characterRegex = /^[a-zA-Z0-9\s]{0,255}$/;
	var addressRegex = /^[a-zA-Z0-9\s,'-\/]{0,255}$/;
	var postcodeRegex = /^[0-9]{4}$/;

	services.loadlistDoctor = function(data) {
		var loadlistDoctor = api.all('doctor/loadlist-doctor');
		return loadlistDoctor.post({data: data});
	}

	services.detailDoctor = function(data) {
		var detailDoctor = api.all('doctor/detail-doctor');
		return detailDoctor.post({data:data});
	}

	services.updateDoctor = function(data) {
		var updateDoctor = api.all('doctor/update-doctor');
		return updateDoctor.post({data:data});
	}

	services.getDoctor = function(data) {
		var getDoctor = api.all('doctor/get-doctor');
		return getDoctor.post({data:data});
	}

	services.validateCheckPhoneonServer = function(data) {
		var validateCheckPhoneonServer = api.all('doctor/check-doctor');
		return validateCheckPhoneonServer.post({data:data});
	}

	services.checkInfo = function(data) {
		var checkInfo = api.all('doctor/check-info');
		return checkInfo.post({data:data});
	}

	services.createDoctorByNewAccount = function(data) {
		var createDoctorByNewAccount = api.all('doctor/create-doctor-by-newaccount');
		return createDoctorByNewAccount.post({data:data});
	}

	services.updateSignature = function(data) {
		var updateSignature = api.all('doctor/update-sign');
		return updateSignature.post({data:data});
	}

	services.checkphoneUserAccount = function(data) {
		var instanceApi = api.all('checkphoneUserAccount');
		return instanceApi.post({data: data});
	}
	services.doctorAppointment = function(data) {
		var instanceApi = api.all('doctorappointment');
		return instanceApi.post({data: data});
	}
	services.doctorIdAppointment = function(data) {
		var instanceApi = api.all('doctorIdappointment');
		return instanceApi.post({data: data});
	}
	services.listCountry = function() {
         var instanceApi = api.one('listCountry');
        return instanceApi.get();
    }
    services.listDepartment = function() {
         var instanceApi = api.one('getdepartment');
        return instanceApi.get();
    }
 //    services.createDoctor = function(data) {
	// 	var instanceApi = api.all('createDoctor');
	// 	return instanceApi.post({data: data});
	// }
	services.getByidDoctor = function(data) {
		var instanceApi = api.all('getbyidDoctor');
		return instanceApi.post({data: data});
	}
	services.getFile = function(data) {
		var instanceApi = api.all('getFile');
		return instanceApi.post({data: data});
	}
	services.removeImage = function(data) {
		var instanceApi = api.all('removeImage');
		return instanceApi.post({data: data});
	}
	services.getroleDoctor = function(data) {
		var instanceApi = api.all('getRoleDoctor');
		return instanceApi.post({data: data});
	}
	services.getEnableFile = function(data) {
		var instanceApi = api.one('enableFile/'+data.isEnable+'/'+data.fileUID);
		return instanceApi.get();
	}
	services.getoneDepartment = function(data) {
		var instanceApi = api.all('getOneDepartment');
		return instanceApi.post({data: data});
	}

	services.validateCheckPhone = function(info) {
		
		var error = [];
		
		var q = $q.defer();

		try {

			//validate Title
			if(!info.Title){
				error.push({field:"Title",message:"required"});
				// toastr.error('Title is required');
			}

			//validate UserName
			if(info.UserName){
				if(info.UserName.length < 0 || info.UserName.length > 255){
					error.push({field:"UserName",message:"max length"});
				}
			}
			else {
				error.push({field:"UserName",message:"required"});
				// toastr.error('UserName is required');
			}
			
			//validate FirstName
			if(info.FirstName){
				if(info.FirstName.length < 0 || info.FirstName.length > 50){
					error.push({field:"FirstName",message:"max length"});
				}
			}
			else {
				error.push({field:"FirstName",message:"required"});
				// toastr.error('FirstName is required');
			}

			//validate MiddleName
			if(info.MiddleName){
				if(info.MiddleName.length > 100){
					error.push({field:"MiddleName",message:"max length"});
				}
			}

			//validate LastName
			if(info.LastName){
				if(info.LastName.length < 0 || info.LastName.length > 255){
					error.push({field:"LastName",message:"max length"});
				}
			}
			else {
				error.push({field:"LastName",message:"required"});
				// toastr.error('LastName is required');
			}

			//validate PhoneNumber
			if(info.PhoneNumber){
				var auPhoneNumberPattern=new RegExp(/^(\+61|0061|0)?4[0-9]{8}$/);
				var PhoneNumber=info.PhoneNumber.replace('/[\(\)\s\-]/g','');
				if(!auPhoneNumberPattern.test(PhoneNumber)){
					error.push({field:"PhoneNumber",message:"Phone Number is a 10 digits number. Eg: 04 xxxx xxxx"});
					// toastr.error('PhoneNumber invalid');
				}
			}
			else{
				error.push({field:"PhoneNumber",message:"required"});
				// toastr.error('PhoneNumber is required');
			}

			//validate Email
			if(info.Email){
				var EmailPattern=new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/);
				var Email=info.Email.replace('/[\(\)\s\-]/g','');
				if(!EmailPattern.test(Email)){
					error.push({field:"Email",message:"invalid email"});
					// toastr.error('Email invalid');
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


	services.validate = function(info) {
		var error = [];
		var q = $q.defer();
		try {
			//validate RoleId
			if('RoleId'in info){
				if(info.RoleId==null || info.RoleId==""){
					error.push({field:"RoleId",message:"required"});
				}
			}

			//validate Title
			if('Title'in info){
				if(info.Title==null){
					error.push({field:"Title",message:"required"});
				}
			}

			//validate FirstName
			if('FirstName' in info){
				if(info.FirstName){
					if(info.FirstName.length < 0 || info.FirstName.length > 50){
						error.push({field:"FirstName",message:"max length"});
					}
					if(!characterRegex.test(info.FirstName)){
						error.push({field:"FirstName",message:"invalid value"});
					}
				}
				else{
					error.push({field:"FirstName",message:"required"});
				}
			}

			//validate MiddleName
			if('MiddleName' in info){
				if(info.MiddleName){
					if(info.MiddleName.length < 0 || info.MiddleName.length > 100){
						error.push({field:"MiddleName",message:"max length"});
					}
					if(!characterRegex.test(info.MiddleName)){
						error.push({field:"MiddleName",message:"invalid value"});
					}
				}
			}

			//validate LastName
			if('LastName' in info){
				if(info.LastName){
					if(info.LastName.length < 0 || info.LastName.length > 50){
						error.push({field:"LastName",message:"max length"});
					}
					if(!characterRegex.test(info.LastName)){
						error.push({field:"LastName",message:"invalid value"});
					}
				}
				else{
					error.push({field:"LastName",message:"required"});
				}
			}

			//validate DOB
			if(info.DOB==undefined|| !info.DOB){
				error.push({field:"DOB",message:"required"});
			}

			//validate Address1
			if('Address1' in info){
				if(info.Address1){
					if(info.Address1.length < 0 || info.Address1.length > 255){
						error.push({field:"Address1",message:"max length"});
					}
					if(!addressRegex.test(info.Address1)){
						error.push({field:"Address1",message:"invalid value"});
					}
				}
				else {
					error.push({field:"Address1",message:"required"});
				}
			}

			//validate Address2
			if('Address2' in info){
				if(info.Address2){
					if(info.Address2.length < 0 || info.Address2.length > 255){
						error.push({field:"Address2",message:"max length"});
					}
					if(!addressRegex.test(info.Address2)){
						error.push({field:"Address2",message:"invalid value"});
					}
				}
			}

			//validate Suburb
			if('Suburb' in info){
				if(info.Suburb){
					if(info.Suburb.length < 0 || info.Suburb.length > 255){
						error.push({field:"Suburb",message:"max length"});
					}
				}
				else {
					error.push({field:"Suburb",message:"required"});
				}
			}

			//validate Postcode
			if('Postcode' in info){
				if(info.Postcode){
					if(info.Postcode.length < 0 || info.Postcode.length > 255){
						error.push({field:"Postcode",message:"max length"});
					}
					if(!postcodeRegex.test(info.Postcode)){
						error.push({field:"Postcode",message:"Postcode is a 4 digits number"});
					}
				}
				else{
					error.push({field:"Postcode",message:"required"});
				}
			}

			// validate Email? hoi a Tan su dung exception
			if('Email' in info){
				if(info.Email){
					var EmailPattern=new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/);
					if(!EmailPattern.test(info.Email)){
						error.push({field:"Email",message:"invalid email"});
					}
				}
			}
			
			//validate Occupation
			if('Occupation' in info){
				if(info.Occupation){
					if(info.Occupation.length < 0 || info.Occupation.length > 255){
						error.push({field:"Occupation",message:"max length"});
					}
					if(!characterRegex.test(info.Occupation)){
						error.push({field:"Occupation",message:"invalid value"});
					}
				}
			}


			//validate WorkPhone
			if('WorkPhoneNumber' in info){
				if(info.WorkPhoneNumber){
					var auWorkPhoneNumberPattern=new RegExp(/^[0-9]{6,10}$/);
					var WorkPhoneNumber=info.WorkPhoneNumber.replace(/[\(\)\s\-]/g,'');
					if(!auWorkPhoneNumberPattern.test(WorkPhoneNumber)){
						error.push({field:"WorkPhoneNumber",message:"Phone Number is invalid. The number is a 6-10 digits number"});
					}
				}
			}

			//validate HomePhoneNumber? hoi a Tan su dung exception
			if('HomePhoneNumber' in info){
				if(info.HomePhoneNumber){
					var auHomePhoneNumberPattern=new RegExp(/^[0-9]{6,10}$/);
					var HomePhone=info.HomePhoneNumber.replace(/[\(\)\s\-]/g,'');
					if(!auHomePhoneNumberPattern.test(HomePhone)){
						error.push({field:"HomePhoneNumber",message:"Phone Number is invalid. The number is a 6-10 digits number"});
					}
				}
			}

			//validate State
			if('State' in info){
				if(info.State){
					if(info.State.length < 0 || info.State.length > 255){
						error.push({field:"State",message:"max length"});
					}
					if(!characterRegex.test(info.State)){
						error.push({field:"State",message:"invalid value"});
					}
				}
				else {
						error.push({field:"State",message:"required"});
				}
			}

			//validate Country
			if('CountryID' in info){
				if(info.CountryID==null){
					error.push({field:"CountryID",message:"required"});
				}
			}

			// validate DepartmentID
			if('DepartmentID' in info){
				if(info.DepartmentID) {
					if(info.DepartmentID.length < 0) {
						error.push({field:"DepartmentID",message:"length"});
					}
				}
				// else {
				// 	error.push({field:"DepartmentID",message:"required"});
				// }
			}

			// validate ProviderNumber
			if('ProviderNumber' in info){
				if(info.ProviderNumber) {
					if(info.ProviderNumber.length < 0 || info.ProviderNumber.length > 255) {
						error.push({field:"ProviderNumber",message:"length"});
					}
				}
				else {
					error.push({field:"ProviderNumber",message:"required"});
				}
			}

			// validate Type
			if('Type' in info){
				if(info.Type) {
					if(info.Type.length < 0) {
						error.push({field:"Type",message:"length"});
					}
				}
				else {
					error.push({field:"Type",message:"required"});
				}
			}

			// validate Speciality
			if('Speciality' in info){
				if(info.Speciality) {
					if(info.Speciality.length < 0) {
						error.push({field:"Speciality",message:"length"});
					}
				}
				else {
					error.push({field:"Speciality",message:"required"});
				}
			}

			//validate HealthLinkID
			if('HealthLinkID' in info){
				if(info.HealthLinkID){
					if(info.HealthLinkID.length < 0 || info.HealthLinkID.length > 255){
						error.push({field:"HealthLinkID",message:"max length"});
					}
				}
				else {
					error.push({field:"HealthLinkID",message:"required"});
				}
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

	return services;
});