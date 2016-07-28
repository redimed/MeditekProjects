angular.module('app.authentication.patient.services',[])
.factory("PatientService", function(Restangular, $state,$q){
	var PatientService = {};
	var api = Restangular.all("api");
	var characterRegex = /^[a-zA-Z0-9\s]{0,255}$/;
	var userRegex = /^[a-zA-Z0-9\.]{0,255}$/;
	var addressRegex = /^[a-zA-Z0-9\s,'-\/]{0,255}$/;
	var postcodeRegex = /^[0-9]{4}$/;
	var postData ={};


PatientService.validate = function(info) {
		var error = [];
		var q = $q.defer();
		try {

			//validate Title
			if('Title' in info)
			if(info.Title){
				if(info.Title != "Dr" && info.Title != "Mr" &&
					info.Title != "Ms" && info.Title != "Mrs" &&
					info.Title != "Miss" && info.Title != "Master"){
					error.push({field:"Title",message:"invalid value"});
				}
			}
			// else{
			// 	error.push({field:"Title",message:"required"});
			// }

			//validate Gender
			if('Gender' in info)
			if(info.Gender){
				if(info.Gender != "Female" && info.Gender != "Male" && info.Gender !="Other"){
					error.push({field:"Gender",message:"invalid value"});
				}
			}
			// else{
			// 	error.push({field:"Gender",message:"required"});
			// }

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
				// else {
				// 	error.push({field:"Address1",message:"required"});
				// }
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
				// else {
				// 	error.push({field:"Suburb",message:"required"});
				// }
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
				// else{
				// 	error.push({field:"Postcode",message:"required"});
				// }
			}

			// validate Email? hoi a Tan su dung exception
			if('Email1' in info){
				if(info.Email1){
					var EmailPattern=new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/);
					if(!EmailPattern.test(info.Email1)){
						error.push({field:"Email1",message:"invalid email"});
					}
				}
			}

			if('Email2' in info){
				if(info.Email2){
					var EmailPattern=new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/);
					if(!EmailPattern.test(info.Email2)){
						error.push({field:"Email2",message:"invalid email"});
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
					var auWorkPhoneNumberPattern=new RegExp(/^[0-9\-\(\)\s]{0,20}$/);
					// var WorkPhoneNumber=info.WorkPhoneNumber.replace(/[\(\)\s\-]/g,'');
					if(!auWorkPhoneNumberPattern.test(info.WorkPhoneNumber)){
						error.push({field:"WorkPhoneNumber",message:"Phone Number is invalid. The number is a 6-10 digits number"});
					}
				}
			}

			//validate HomePhoneNumber? hoi a Tan su dung exception
			if('HomePhoneNumber' in info){
				if(info.HomePhoneNumber){
					var auHomePhoneNumberPattern=new RegExp(/^[0-9\-\(\)\s]{0,20}$/);
					// var HomePhone=info.HomePhoneNumber.replace(/[\(\)\s\-]/g,'');
					if(!auHomePhoneNumberPattern.test(info.HomePhoneNumber)){
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
				// else {
				// 		error.push({field:"State",message:"required"});
				// }
			}

			//validate Country
			// if('CountryID1' in info){
			// 	if(info.CountryID1==null){
			// 		error.push({field:"CountryID1",message:"required"});
			// 	}
			// }

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

	PatientService.validateCheckPhone = function(info, isHaveUser) {
		var error = [];
		var q = $q.defer();
		try {
			//validate UserName
			if(isHaveUser == true) {
				if(info.UserName){
					if(info.UserName.length < 0 || info.UserName.length > 50){
						error.push({field:"UserName",message:"max length"});
					}
					if(!userRegex.test(info.UserName)){
						error.push({field:"UserName",message:"invalid value"});
					}
				}
				else {
					error.push({field:"UserName",message:"required"});
				}
			}

			//validate FirstName
			if(info.FirstName){
				if(info.FirstName.length < 0 || info.FirstName.length > 50){
					error.push({field:"FirstName",message:"max length"});
				}
				if(!characterRegex.test(info.FirstName)){
					error.push({field:"FirstName",message:"invalid value"});
				}
			}
			else {
				error.push({field:"FirstName",message:"required"});

			}

			//validate MiddleName
			if(info.MiddleName){
				if(info.MiddleName.length < 0 || info.MiddleName.length > 100){
					error.push({field:"MiddleName",message:"max length"});
				}
				if(!characterRegex.test(info.MiddleName)){
					error.push({field:"MiddleName",message:"invalid value"});
				}
			}

			//validate LastName
			if(info.LastName){
				if(info.LastName.length < 0 || info.LastName.length > 50){
					error.push({field:"LastName",message:"length"});
				}
				if(!characterRegex.test(info.LastName)){
					error.push({field:"LastName",message:"invalid value"});
				}
			}
			else {
				error.push({field:"LastName",message:"required"});
			}

			//validate PhoneNumber
			if(info.PhoneNumber){
				var auPhoneNumberPattern=new RegExp(/^(\+61|0061|0)?4[0-9]{8}$/);
				var PhoneNumber=info.PhoneNumber.replace(/[\(\)\s\-]/g,'');
				if(!auPhoneNumberPattern.test(PhoneNumber)){
					error.push({field:"PhoneNumber",message:"Phone Number is a 10 digits number. Eg: 04 xxxx xxxx"});
				}
			}
			// else{
			// 	error.push({field:"PhoneNumber",message:"required"});
			// }

			//validate Email
			if(info.Email){
				var EmailPattern=new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/);
				if(!EmailPattern.test(info.Email)){
					error.push({field:"Email",message:"invalid email"});
				}
			}

			//validate HomePhone
			if(info.HomePhoneNumber){
				var auHomePhoneNumberPattern=new RegExp(/^[0-9\-\(\)\s]{0,20}$/);
				// var HomePhone=info.HomePhoneNumber.replace(/[\(\)\s\-]/g,'');
				if(!auHomePhoneNumberPattern.test(info.HomePhoneNumber)){
					error.push({field:"HomePhoneNumber",message:"Phone Number is invalid. The number is a 6-10 digits number"});
				}
			}

			//validate WorkPhone
			if(info.WorkPhoneNumber){
				var auWorkPhoneNumberPattern=new RegExp(/^[0-9\-\(\)\s]{0,20}$/);
				// var WorkPhone=info.WorkPhoneNumber.replace(/[\(\)\s\-]/g,'');
				if(!auWorkPhoneNumberPattern.test(info.WorkPhoneNumber)){
					error.push({field:"WorkPhoneNumber",message:"Phone Number is invalid. The number is a 6-10 digits number"});
				}
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

	PatientService.postDatatoDirective = function(info) {

		postData = angular.copy(info);
		if(postData.Gender !=null && postData.Gender !=='Male' && postData.Gender !=='Female'){
			postData.Gender = 'Other';
		}
	};

	PatientService.getDatatoDirective = function(){

		var returnData = {};
		if(_.isEmpty(postData) == false){
			// var info = {
			// 	FirstName:postData.data.FirstName,
			// 	MiddleName:postData.data.MiddleName,
			// 	Title:postData.data.Title,
			// 	LastName:postData.data.LastName,
			// 	PhoneNumber:postData.data.PhoneNumber,
			// 	DOB:postData.data.DOB,
			// 	Address1:postData.data.Address1,
			// 	Address2:postData.data.Address2,
			// 	State:postData.data.State,
			// 	Email1:postData.data.Email1,
			// 	Email:postData.data.Email1,
			// 	HomePhoneNumber:postData.data.HomePhoneNumber,
			// 	WorkPhoneNumber:postData.data.WorkPhoneNumber,
			// 	Gender:postData.data.Gender,
			// 	Suburb:postData.data.Suburb,
			// 	Postcode:postData.data.Postcode,
			// 	SiteID:postData.data.Postcode,
			// 	SiteIDRefer:postData.data.SiteIDRefer,
			// };
			postData.data.Email = postData.data.Email1;
			var info = postData.data;
			returnData.data = {};
			for(var key in info) {
				if(info[key] != '' && info[key] != null && info[key] != undefined) {
					returnData.data[key] = info[key];
				}
			}
			if(postData.otherData.hasOwnProperty('PatientDVA')== true) returnData.PatientDVA = postData.PatientDVA;
			if(postData.otherData.hasOwnProperty('PatientMedicare')== true) returnData.PatientMedicare = postData.PatientMedicare;
			if(postData.otherData.hasOwnProperty('PatientPension')== true) returnData.PatientPension = postData.PatientPension;
			if(postData.otherData.hasOwnProperty('PatientFund')== true) returnData.PatientFund = postData.PatientFund;
			if(postData.otherData.hasOwnProperty('PatientKin')== true) returnData.PatientKin = postData.PatientKin;
			if(postData.otherData.hasOwnProperty('PatientGP')== true) returnData.PatientGP = postData.PatientGP;
			console.log('returnData',returnData);
			return returnData;
		}
		else {
			return returnData;
		}
	}

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

	PatientService.getfileUID = function(data){
		var getfileUID = api.all("patient/get-fileUID");
		return getfileUID.post({data:data});
	};

	PatientService.getPatient = function(data){
		var getPatient = api.all("patient/get-patient");
		return getPatient.post({data:data});
	};

	PatientService.changeStatusFile = function(data) {
		var changeStatusFile = api.all('change-status-file');
		return changeStatusFile.post({data:data});
	};

	PatientService.addChild = function(data) {
		var addChild = api.all('patient/add-child');
		return addChild.post({data:data});
	};

	PatientService.changeStatusChild = function(data) {
		var changeStatusChild = api.all('patient/change-status-child');
		return changeStatusChild.post({data:data});
	};

	PatientService.detailChildPatient = function(data) {
		var detailChildPatient = api.all('patient/detail-child-patient');
		return detailChildPatient.post({data:data});
	};

	PatientService.updateSignature = function(data) {
		var updateSignature = api.all('patient/update-signature');
		return updateSignature.post({data:data});
	};

	PatientService.sendEmailWhenLinked = function(data) {
		var sendEmailWhenLinked = api.all('patient/send-email-when-linked');
		return sendEmailWhenLinked.post({data:data});
	};

	PatientService.updateEFormAppointment = function(data) {
		var updateEFormAppointment = api.all('patient/update-eform-appt');
		return updateEFormAppointment.post({data:data});
	};

	PatientService.loadChildNode = function(data) {
		var loadChildNode = api.all('patient/load-child-node');
		return loadChildNode.post({data:data});
	};

	return PatientService;
})
