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
	services.getEnableFile = function(data) {
		var instanceApi = api.one('enableFile/'+data.isEnable+'/'+data.fileUID);
		return instanceApi.get();
	}
	services.getoneDepartment = function(data) {
		var instanceApi = api.all('getOneDepartment');
		return instanceApi.post({data: data});
	}

	// Check Create Step 1
	services.validateCheckPhone = function(info) {
		
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
				toastr.error('FirstName is required');
			}

			//validate MiddleName
			if(info.MiddleName){
				if(info.MiddleName.length > 100){
					error.push({field:"MiddleName",message:"length"});
				}
			}

			//validate LastName
			if(info.LastName){
				if(info.LastName.length < 0 || info.LastName.length > 255){
					error.push({field:"LastName",message:"length"});
				}
			}
			else {
				error.push({field:"LastName",message:"required"});
				toastr.error('LastName is required');
			}

			//validate PhoneNumber
			if(info.PhoneNumber){
				var auPhoneNumberPattern=new RegExp(/^(\+61|0061|0)?4[0-9]{8}$/);
				var PhoneNumber=info.PhoneNumber.replace('/[\(\)\s\-]/g','');
				if(!auPhoneNumberPattern.test(PhoneNumber)){
					error.push({field:"PhoneNumber",message:"PhoneNumber.invalid-value"});
					toastr.error('PhoneNumber invalid');
				}
			}
			else{
				error.push({field:"PhoneNumber",message:"required"});
				toastr.error('PhoneNumber is required');
			}

			//validate Email
			if(info.Email){
				var EmailPattern=new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
				var Email=info.Email.replace('/[\(\)\s\-]/g','');
				if(!EmailPattern.test(Email)){
					error.push({field:"Email",message:"Email.invalid-value"});
					toastr.error('Email invalid');
				}
			}
			else {
				error.push({field:"Email",message:"required"});
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
				toastr.error('HealthLink ID is required');
			}

			//validate Address1
			if(info.Address1){
				if(info.Address1.length > 255){
					error.push({field:"Address1",message:"Address1.length"});
				}
			}

			//validate Address2
			if(info.Address2){
				if(info.Address2.length > 255){
					error.push({field:"Address2",message:"Address2.length"});
				}
			}

			//validate DOB
			if(info.DOB){
				if(info.DOB.length < 0){
					error.push({field:"DOB",message:"DOB.length"});
				} else {
					var datePattern = new RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
					if(!datePattern.test(info.DOB)) {
						error.push({field:"DOB", message:"DOB.invalid-value"});
						toastr.error('Date of Birth invalid');
					}
				}
			}
			else {
				error.push({field:"DOB",message:"DOB.required"});
				toastr.error('Date of Birth is required');
			}

			//validate HomePhoneNumber
			if(info.HomePhoneNumber){
				if(info.HomePhoneNumber.length > 0) {
					var auHomePhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
					var HomePhone=info.HomePhoneNumber.replace('/[\(\)\s\-]/g','');
					if(!auHomePhoneNumberPattern.test(HomePhone)){
						error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.invalid-value"});
						toastr.error('HomePhoneNumber invalid');
					}
				}
			}

			//validate WorkPhoneNumber
			if(info.WorkPhoneNumber){
				if(info.WorkPhoneNumber.length > 0) {
					var auWorkPhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
					var WorkPhone=info.WorkPhoneNumber.replace('/[\(\)\s\-]/g','');
					if(!auWorkPhoneNumberPattern.test(WorkPhone)){
						error.push({field:"WorkPhoneNumber",message:"WorkPhoneNumber.invalid-value"});
						toastr.error('WorkPhoneNumber invalid');
					}
				}
			}

			//validate Postcode
			if(info.Postcode){
				if(info.Postcode.length < 0 || info.Postcode.length > 4){
					error.push({field:"Postcode",message:"Postcode.length"});
				}
			}
			else {
				error.push({field:"Postcode",message:"Postcode.required"});
				toastr.error('Postcode is required');
			}


			//validate Suburb
			if(info.Suburb){
				if(info.Suburb.length < 0 || info.Suburb.length > 255){
					error.push({field:"Suburb",message:"Suburb.length"});
				}
			}
			else {
				error.push({field:"Suburb",message:"Suburb.required"});
				toastr.error('Suburb is required');
			}

			//validate State
			if(info.State){
				if(info.State.length < 0 || info.State.length > 255){
					error.push({field:"State",message:"State.length"});
				}
			}
			else {
				error.push({field:"State",message:"State.required"});
				toastr.error('State is required');
			}

			//validate CountryID
			if(info.CountryID){
				if(info.CountryID.length < 0 || info.CountryID.length > 255){
					error.push({field:"CountryID",message:"CountryID.length"});
				}
			}
			else {
				error.push({field:"CountryID",message:"CountryID.required"});
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
				toastr.error('Department is required');
			}

			// validate ProviderNumber
			if(info.ProviderNumber) {
				if(info.ProviderNumber.length < 0 || info.ProviderNumber.length > 255) {
					error.push({field:"ProviderNumber",message:"length"});
				}
			}
			else{
				error.push({field:"ProviderNumber",message:"required"});
				toastr.error('ProviderNumber is required');
			}

			// validate Type
			if(info.Type) {
				if(info.Type.length < 0) {
					error.push({field:"Type",message:"length"});
				}
			}
			else{
				error.push({field:"Type",message:"required"});
				toastr.error('Type is required');
			}

			// validate Speciality
			if(info.Speciality) {
				if(info.Speciality.length < 0) {
					error.push({field:"Speciality",message:"length"});
				}
			}
			else{
				error.push({field:"Speciality",message:"required"});
				toastr.error('Speciality is required');
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

	// Validate 
	services.validinfo= function(info) {

		var error = [];
		var q = $q.defer();

		try {

			// FirstName
			if(info.FirstName) {
				if(info.FirstName.length < 0 || info.FirstName.length > 50) {
					error.push({field:'FirstName', message:'FirstName.length'});
				}
			}
			else {
				error.push({field:'FirstName', message:'required'});
				toastr.error('FirstName is required');
			}

			// MiddleName
			if(info.MiddleName) {
				if(info.MiddleName.length > 100) {
					error.push({field:'MiddleName', message:'MiddleName.length'});
					toastr.error('MiddleName is too long');
				}
			}

			// LastName
			if(info.LastName) {
				if(info.LastName.length < 0 || info.LastName.length > 255) {
					error.push({field:'LastName', message:'LastName.length'});
				}
			}
			else {
				error.push({field:'LastName', message:'required'});
				toastr.error('LastName is required');
			}

			//validate DOB
			if(info.DOB){
				if(info.DOB.length < 0){
					error.push({field:"DOB",message:"DOB.length"});
				} else {
					var datePattern = new RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
					if(!datePattern.test(info.DOB)) {
						error.push({field:"DOB", message:"DOB.invalid-value"});
						toastr.error('Date of Birth invalid');
					}
				}
			}
			else {
				error.push({field:"DOB",message:"DOB.required"});
				toastr.error('Date of Birth is required');
			}

			// ProviderNumber
			if(info.ProviderNumber) {
				if(info.ProviderNumber.length < 0 || info.ProviderNumber.length > 255) {
					error.push({field:'ProviderNumber', message:'ProviderNumber.length'});
				}
			}
			else {
				error.push({field:'ProviderNumber', message:'required'});
				toastr.error('ProviderNumber is required');
			}

			// Address1
			if(info.Address1) {
				if(info.Address1.length > 255) {
					error.push({field:'Address1', message:'Address1.length'});
					toastr.error('Address1 is too long');
				}
			}

			// Address2
			if(info.Address2) {
				if(info.Address2.length > 255) {
					error.push({field:'Address2', message:'Address2.length'});
					toastr.error('Address2 is too long');
				}
			}

			// HomePhoneNumber
			if(info.HomePhoneNumber) {
				if(info.HomePhoneNumber.length > 0){
					var auHomePhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
					var HomePhone=info.HomePhoneNumber.replace('/[\(\)\s\-]/g','');
					if(!auHomePhoneNumberPattern.test(HomePhone)){
						error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.invalid-value"});
						toastr.error('HomePhoneNumber invalid');
					}
				}
			}

			// WorkPhoneNumber
			if(info.WorkPhoneNumber) {
				if(info.WorkPhoneNumber.length > 0){
					var auHomePhoneNumberPattern=new RegExp(/^[1-9]{9}$/);
					var WorkPhone=info.WorkPhoneNumber.replace('/[\(\)\s\-]/g','');
					if(!auHomePhoneNumberPattern.test(WorkPhone)){
						error.push({field:"WorkPhoneNumber",message:"WorkPhoneNumber.invalid-value"});
						toastr.error('WorkPhoneNumber invalid');
					}
				}
			}

			// Postcode
			if(info.Postcode) {
				if(info.Postcode.length < 0 || info.Postcode.length > 4) {
					error.push({field:'Postcode', message:'Postcode.length'});
				}
			}
			else {
				error.push({field:'Postcode', message:'required'});
				toastr.error('Postcode is required');
			}

			// Suburb
			if(info.Suburb) {
				if(info.Suburb.length < 0 || info.Suburb.length > 100) {
					error.push({field:'Suburb', message:'Suburb.length'});
				}
			}
			else {
				error.push({field:'Suburb', message:'required'});
				toastr.error('Suburb is required');
			}

			// State
			if(info.State) {
				if(info.State.length < 0 || info.State.length > 100) {
					error.push({field:'State', message:'State.length'});
				}
			}
			else {
				error.push({field:'State', message:'required'});
				toastr.error('State is required');
			}

			// CountryID
			if(info.CountryID) {
				if(info.CountryID.length < 0) {
					error.push({field:'CountryID', message:'CountryID.length'});
				}
			}
			else {
				error.push({field:'CountryID', message:'required'});
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

	return services;
});