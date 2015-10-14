var app = angular.module('app.authentication.patient.controller', [
	'app.authentication.patient.list.controller',
	'app.authentication.patient.create.controller',
]);

app.controller('patientCtrl', function($scope,$q){
	console.log('patientCtrl');
	$scope.data = {};
	$scope.validate = function(info) {
		var error = [];
		var q = $q.defer();
		try {
			//validate FirstName
			if(info.FirstName){
				if(info.FirstName.length < 0 || info.FirstName.length > 6){
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
				if(info.LastName.length < 0 || info.LastName.length > 6){
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
				if(info.Suburb.length < 0 || info.Suburb.length > 100){
					error.push({field:"Suburb",message:"Suburb.length"});
				}
			}
			// else {
			// 	error.push({field:"Suburb",message:"Suburb.required"});
			// }

			//validate Postcode
			if(info.Postcode){
				if(info.Postcode.length < 0 || info.Postcode.length > 100){
					error.push({field:"Postcode",message:"Postcode.length"});
				}
			}
			// else {
			// 	error.push({field:"Postcode",message:"Postcode.required"});
			// }

			//validate Email? hoi a Tan su dung exception
			if(info.Email){
				if(info.Email.length < 0 || info.Email.length > 100){
					error.push({field:"Email",message:"Email.length"});
				}
			}
			else {
				error.push({field:"Email",message:"Email.required"});
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
			// else {
			// 	error.push({field:"HomePhoneNumber",message:"HomePhoneNumber.required"});
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

	$scope.validateCheckPhone = function(info) {
		var error = [];
		var q = $q.defer();
		try {
			//validate FirstName
			if(info.FirstName){
				if(info.FirstName.length < 0 || info.FirstName.length > 6){
					error.push({field:"FirstName",message:"length"});
				}
			}
			else {
				error.push({field:"FirstName",message:"required"});
			}

			//validate LastName
			if(info.LastName){
				if(info.LastName.length < 0 || info.LastName.length > 6){
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
});

			