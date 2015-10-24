angular.module('app.authentication.doctor.service', [])
.factory("doctorService", function(Restangular, $q, toastr) {

	var services = {};
	var api = Restangular.all('api');

	services.getList = function(data) {
		var instanceApi = api.all('getDoctor');
		return instanceApi.post({data: data});
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
    services.createDoctor = function(data) {
		var instanceApi = api.all('createDoctor');
		return instanceApi.post({data: data});
	}
	services.getByidDoctor = function(data) {
		var instanceApi = api.all('getbyidDoctor');
		return instanceApi.post({data: data});
	}
	services.updateDoctor = function(data) {
		var instanceApi = api.all('updateDoctor');
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

	// Validate 
	services.validinfo= function(info) {

		var error = [];
		var q = $q.defer();

		try {

			// Title
			if(info.Title) {
				if(info.Title.length < 0) {
					error.push({field:'Title', message:'Title.length'});
				}
			}
			else {
				error.push({field:'Title', message:'required'});
			}

			// FirstName
			if(info.FirstName) {
				if(info.FirstName.length < 0 || info.FirstName.length > 50) {
					error.push({field:'FirstName', message:'FirstName.length'});
				}
			}
			else {
				error.push({field:'FirstName', message:'required'});
			}

			// MiddleName
			// if(info.MiddleName) {
			// 	if(info.MiddleName.length < 0 || info.MiddleName.length > 100) {
			// 		error.push({field:'MiddleName', message:'MiddleName.length'});
			// 	}
			// }
			// else {
			// 	error.push({field:'MiddleName', message:'required'});
			// }

			// LastName
			if(info.LastName) {
				if(info.LastName.length < 0 || info.LastName.length > 255) {
					error.push({field:'LastName', message:'LastName.length'});
				}
			}
			else {
				error.push({field:'LastName', message:'required'});
			}

			// ProviderNumber
			if(info.ProviderNumber) {
				if(info.ProviderNumber.length < 0 || info.ProviderNumber.length > 255) {
					error.push({field:'ProviderNumber', message:'ProviderNumber.length'});
				}
			}
			else {
				error.push({field:'ProviderNumber', message:'required'});
			}

			// Address1
			if(info.Address1) {
				if(info.Address1.length < 0 || info.Address1.length > 255) {
					error.push({field:'Address1', message:'Address1.length'});
				}
			}
			else {
				error.push({field:'Address1', message:'required'});
			}

			// Address2
			if(info.Address2) {
				if(info.Address2.length < 0 || info.Address2.length > 255) {
					error.push({field:'Address2', message:'Address2.length'});
				}
			}
			else {
				error.push({field:'Address2', message:'required'});
			}

			// HomePhoneNumber
			if(info.HomePhoneNumber) {
				var auHomePhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
				var HomePhone=info.HomePhoneNumber.replace('/[\(\)\s\-]/g','');
				if(!auHomePhoneNumberPattern.test(HomePhone)){
					error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.invalid-value"});
					toastr.error('HomePhoneNumber not invalid');
				}
			}
			else {
				error.push({field:'HomePhoneNumber', message:'required'});
			}

			// WorkPhoneNumber
			if(info.WorkPhoneNumber) {
				var auHomePhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
				var WorkPhone=info.WorkPhoneNumber.replace('/[\(\)\s\-]/g','');
				if(!auHomePhoneNumberPattern.test(WorkPhone)){
					error.push({field:"WorkPhoneNumber",message:"WorkPhoneNumber.invalid-value"});
					toastr.error('WorkPhoneNumber not invalid');
				}
			}
			else {
				error.push({field:'WorkPhoneNumber', message:'required'});
			}

			// Postcode
			if(info.Postcode) {
				if(info.Postcode.length < 0 || info.Postcode.length > 4) {
					error.push({field:'Postcode', message:'Postcode.length'});
				}
			}
			else {
				error.push({field:'Postcode', message:'required'});
			}

			// Suburb
			if(info.Suburb) {
				if(info.Suburb.length < 0 || info.Suburb.length > 100) {
					error.push({field:'Suburb', message:'Suburb.length'});
				}
			}
			else {
				error.push({field:'Suburb', message:'required'});
			}

			// State
			if(info.State) {
				if(info.State.length < 0 || info.State.length > 100) {
					error.push({field:'State', message:'State.length'});
				}
			}
			else {
				error.push({field:'State', message:'required'});
			}

			// CountryID
			if(info.CountryID) {
				if(info.CountryID.length < 0) {
					error.push({field:'CountryID', message:'CountryID.length'});
				}
			}
			else {
				error.push({field:'CountryID', message:'required'});
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

	// Check Create Step 1
	services.validateCheckPhone = function(info) {
		
		var error = [];
		
		var q = $q.defer();

		try {

			//validate Title
			if(info.Title){
				if(info.Title.length < 0){
					error.push({field:"Title",message:"length"});
				}
			}
			else {
				error.push({field:"Title",message:"required"});
			}
			
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
			// if(info.MiddleName){
			// 	if(info.MiddleName.length < 0 || info.MiddleName.length > 100){
			// 		error.push({field:"MiddleName",message:"length"});
			// 	}
			// }
			// else {
			// 	error.push({field:"MiddleName",message:"required"});
			// }

			//validate LastName
			if(info.LastName){
				if(info.LastName.length < 0 || info.LastName.length > 255){
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
					toastr.error('PhoneNumber not invalid');
				}
			}
			else{
				error.push({field:"PhoneNumber",message:"required"});
			}

			//validate Email
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

	// validate step 2
	services.validateCheckInfo = function(info) {

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
			// if(info.Address1){
			// 	if(info.Address1.length < 0 || info.Address1.length > 255){
			// 		error.push({field:"Address1",message:"Address1.length"});
			// 	}
			// }
			// else {
			// 	error.push({field:"Address1",message:"Address1.required"});
			// }

			//validate Address2
			// if(info.Address2){
			// 	if(info.Address2.length < 0 || info.Address2.length > 255){
			// 		error.push({field:"Address2",message:"Address2.length"});
			// 	}
			// }
			// else {
			// 	error.push({field:"Address2",message:"Address2.required"});
			// }

			//validate DOB
			if(info.DOB){
				if(info.DOB.length < 0){
					error.push({field:"DOB",message:"DOB.length"});
				}
			}
			else {
				error.push({field:"DOB",message:"DOB.required"});
			}

			//validate HomePhoneNumber
			if(info.HomePhoneNumber){
				var auHomePhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
				var HomePhone=info.HomePhoneNumber.replace('/[\(\)\s\-]/g','');
				if(!auHomePhoneNumberPattern.test(HomePhone)){
					error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.invalid-value"});
					toastr.error('HomePhoneNumber not invalid');
				}
			}
			else {
				error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.required"});
			}

			//validate WorkPhoneNumber
			if(info.WorkPhoneNumber){
				var auWorkPhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
				var WorkPhone=info.WorkPhoneNumber.replace('/[\(\)\s\-]/g','');
				if(!auWorkPhoneNumberPattern.test(WorkPhone)){
					error.push({field:"WorkPhoneNumber",message:"WorkPhoneNumber.invalid-value"});
					toastr.error('WorkPhoneNumber not invalid');
				}
			}
			else {
				error.push({field:"WorkPhoneNumber",message:"WorkPhoneNumber.required"});
			}

			//validate Postcode
			if(info.Postcode){
				if(info.Postcode.length < 0 || info.Postcode.length > 4){
					error.push({field:"Postcode",message:"Postcode.length"});
				}
			}
			else {
				error.push({field:"Postcode",message:"Postcode.required"});
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

			//validate State
			if(info.State){
				if(info.State.length < 0 || info.State.length > 255){
					error.push({field:"State",message:"State.length"});
				}
			}
			else {
				error.push({field:"State",message:"State.required"});
			}

			//validate CountryID
			if(info.CountryID){
				if(info.CountryID.length < 0 || info.CountryID.length > 255){
					error.push({field:"CountryID",message:"CountryID.length"});
				}
			}
			else {
				error.push({field:"CountryID",message:"CountryID.required"});
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

	// validate step 3
	services.checkSpecial = function(info) {
		
		var error = [];
		
		var q = $q.defer();
		
		try {

			// validate DepartmentID
			if(info.DepartmentID) {
				if(info.DepartmentID.length < 0) {
					error.push({field:"DepartmentID",message:"length"});
				}
			}
			else{
				error.push({field:"DepartmentID",message:"required"});
			}

			// validate ProviderNumber
			if(info.ProviderNumber) {
				if(info.ProviderNumber.length < 0 || info.ProviderNumber.length > 255) {
					error.push({field:"ProviderNumber",message:"length"});
				}
			}
			else{
				error.push({field:"ProviderNumber",message:"required"});
			}

			// validate Type
			if(info.Type) {
				if(info.Type.length < 0) {
					error.push({field:"Type",message:"length"});
				}
			}
			else{
				error.push({field:"Type",message:"required"});
			}

			// validate Speciality
			if(info.Speciality) {
				if(info.Speciality.length < 0) {
					error.push({field:"Speciality",message:"length"});
				}
			}
			else{
				error.push({field:"Speciality",message:"required"});
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