var $q = require('q');
var _ = require('lodash');
var S = require('string');
var check  = require('../HelperService');
//generator Password
var generatePassword = require('password-generator');
//moment
var moment = require('moment');

var defaultAtrributes = [
		'UID',
		'UserAccountID',
		'DepartmentID',
		'Title',
		'FirstName',
		'MiddleName',
		'LastName',
		'Type',
		'DOB',
		'Address1',
		'Address2',
		'Postcode',
		'Suburb',
		'State',
		'CountryID',
		'Email',
		'HomePhoneNumber',
		'WorkPhoneNumber',
		'FaxNumber',
		'Signature',
		'HealthLink',
		'ProviderNumber',
		'Enable',
		'CreatedDate',
		'UserAccount.PhoneNumber'
	];

module.exports = {

	/*
		validation : validate input from client post into server
		input: Doctor's information
		output: validate Doctor's information
	*/
	validation: function(info,type) {
		var characterRegex = new RegExp(check.regexPattern.character);
		var addressRegex   = new RegExp(check.regexPattern.address);
		var postcodeRegex  = new RegExp(check.regexPattern.postcode);
		var isCreate = type==true?true:false;
		var error = [];
		//create a error with contain a list errors input
		var err = new Error("ERRORS");
		var q = $q.defer();
		if(isCreate==true){
			try {

				//validate Title
				if(info.Title==undefined || !info.Title){
					error.push({field:"Title",message:"required"});
					err.pushErrors(error);
				}

				//validate FirstName
				if(info.FirstName!=undefined && info.FirstName){
					if(info.FirstName.length < 0 || info.FirstName.length > 50){
						error.push({field:"FirstName",message:"max length"});
						err.pushErrors(error);
					}
					if(!characterRegex.test(info.FirstName)){
						error.push({field:"FirstName",message:"invalid value"});
						err.pushErrors(error);
					}
				}
				else{
					error.push({field:"FirstName",message:"required"});
					err.pushErrors(error);
				}

				//validate MiddleName
				if(info.MiddleName!=undefined && info.MiddleName){
					if(info.MiddleName.length < 0 || info.MiddleName.length > 100){
						error.push({field:"MiddleName",message:"max length"});
						err.pushErrors(error);
					}
					if(!characterRegex.test(info.MiddleName)){
						error.push({field:"MiddleName",message:"invalid value"});
						err.pushErrors(error);
					}
				}

				//validate LastName
				if(info.LastName!=undefined && info.LastName){
					if(info.LastName.length < 0 || info.LastName.length > 50){
						error.push({field:"LastName",message:"max length"});
						err.pushErrors(error);
					}
					if(!characterRegex.test(info.LastName)){
						error.push({field:"LastName",message:"invalid value"});
						err.pushErrors(error);
					}
				}
				else{
					error.push({field:"LastName",message:"required"});
					err.pushErrors(error);
				}

				//validate DOB
				if(info.DOB==undefined|| !info.DOB){
					error.push({field:"DOB",message:"required"});
					err.pushErrors(error);
				}

				//validate Address1
				if(info.Address1!=undefined && info.Address1){
					if(info.Address1.length < 0 || info.Address1.length > 255){
						error.push({field:"Address1",message:"max length"});
						err.pushErrors(error);
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
				if(info.Address2!=undefined && info.Address2){
					if(info.Address2.length < 0 || info.Address2.length > 255){
						error.push({field:"Address2",message:"max length"});
						err.pushErrors(error);
					}
					if(!addressRegex.test(info.Address2)){
						error.push({field:"Address2",message:"invalid value"});
						err.pushErrors(error);
					}
				}

				//validate Suburb
				if(info.Suburb!=undefined && info.Suburb){
					if(info.Suburb.length < 0 || info.Suburb.length > 255){
						error.push({field:"Suburb",message:"max length"});
						err.pushErrors(error);
					}
				}
				else {
					error.push({field:"Suburb",message:"required"});
					err.pushErrors(error);
				}

				//validate Postcode
				if(info.Postcode!=undefined && info.Postcode){
					if(info.Postcode.length < 0 || info.Postcode.length > 255){
						error.push({field:"Postcode",message:"max length"});
						err.pushErrors(error);
					}
					if(!postcodeRegex.test(info.Postcode)){
						error.push({field:"Postcode",message:"Postcode is a 4 digits number"});
						err.pushErrors(error);
					}
				}
				else{
					error.push({field:"Postcode",message:"required"});
					err.pushErrors(error);
				}

				// validate Email? hoi a Tan su dung exception
				if(info.Email!=undefined && info.Email){
					var EmailPattern=new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/);
					if(!EmailPattern.test(info.Email)){
						error.push({field:"Email",message:"invalid value"});
						err.pushErrors(error);
					}
				}

				//validate Occupation
				if(info.Occupation!=undefined && info.Occupation){
					if(info.Occupation.length < 0 || info.Occupation.length > 255){
						error.push({field:"Occupation",message:"max length"});
						err.pushErrors(error);
					}
					if(!characterRegex.test(info.Occupation)){
						error.push({field:"Occupation",message:"invalid value"});
						err.pushErrors(error);
					}
				}


				//validate WorkPhone
				if(info.WorkPhoneNumber!=undefined && info.WorkPhoneNumber){
					var auWorkPhoneNumberPattern=new RegExp(/^[0-9]{6,10}$/);
					var WorkPhoneNumber=info.WorkPhoneNumber.replace(/[\(\)\s\-]/g,'');
					if(!auWorkPhoneNumberPattern.test(WorkPhoneNumber)){
						error.push({field:"WorkPhoneNumber",message:"Phone Number is invalid. The number is a 6-10 digits number"});
						err.pushErrors(error);
					}
				}

				//validate HomePhoneNumber? hoi a Tan su dung exception
				if(info.HomePhoneNumber!=undefined && info.HomePhoneNumber){
					var auHomePhoneNumberPattern=new RegExp(/^[0-9]{6,10}$/);
					var HomePhone=info.HomePhoneNumber.replace(/[\(\)\s\-]/g,'');
					if(!auHomePhoneNumberPattern.test(HomePhone)){
						error.push({field:"HomePhoneNumber",message:"Phone Number is invalid. The number is a 6-10 digits number"});
						err.pushErrors(error);
					}
				}

				//validate State
				if(info.State!=undefined && info.State){
					if(info.State.length < 0 || info.State.length > 255){
						error.push({field:"State",message:"max length"});
						err.pushErrors(error);
					}
					if(!characterRegex.test(info.State)){
						error.push({field:"State",message:"invalid value"});
						err.pushErrors(error);
					}
				}
				else {
						error.push({field:"State",message:"required"});
						err.pushErrors(error);
				}

				//validate Country
					if(info.CountryID==undefined || !info.CountryID){
						error.push({field:"CountryID",message:"required"});
						err.pushErrors(error);
					}

				//Clinical Department
				// if(info.Department.DepartmentName){
				// 	if(info.Department.DepartmentName.length<0 || info.Department.DepartmentName.length > 255){
				// 		error.push({field:'Department.DepartmentName', message:'max length'});
				// 	}
				// }

				// validate DepartmentID
				if(info.DepartmentID!=undefined && info.DepartmentID) {
					if(info.DepartmentID.length < 0) {
						error.push({field:"DepartmentID",message:"length"});
						err.pushErrors(error);
					}
				}
				// else {
				// 	error.push({field:"DepartmentID",message:"required"});
				// 	err.pushErrors(error);
				// }

				// validate ProviderNumber
				if(info.ProviderNumber!=undefined && info.ProviderNumber) {
					if(info.ProviderNumber.length < 0 || info.ProviderNumber.length > 255) {
						error.push({field:"ProviderNumber",message:"length"});
						err.pushErrors(error);
					}
				}
				else {
					error.push({field:"ProviderNumber",message:"required"});
					err.pushErrors(error);
				}

				// validate Type
				// if(info.Type!=undefined && info.Type) {
				// 	if(info.Type.length < 0) {
				// 		error.push({field:"Type",message:"length"});
				// 		err.pushErrors(error);
				// 	}
				// }
				// else {
				// 	error.push({field:"Type",message:"required"});
				// 	err.pushErrors(error);
				// }

				// validate Speciality
				// if(info.Speciality!=undefined && info.Speciality) {
				// 	if(info.Speciality.length < 0) {
				// 		error.push({field:"Speciality",message:"length"});
				// 		err.pushErrors(error);
				// 	}
				// }
				// else {
				// 	error.push({field:"Speciality",message:"required"});
				// 	err.pushErrors(error);
				// }

				//validate HealthLinkID
				if(info.HealthLinkID!=undefined && info.HealthLinkID){
					if(info.HealthLinkID.length < 0 || info.HealthLinkID.length > 255){
						error.push({field:"HealthLinkID",message:"max length"});
						err.pushErrors(error);
					}
				}
				else {
					error.push({field:"HealthLinkID",message:"required"});
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
		else{

			try {

				//validate Title
				if('Title' in info){
					if(info.Title!=undefined){
						if(info.Title==null){
							error.push({field:"Title",message:"required"});
							err.pushErrors(error);
						}
					}
				}

				//validate FirstName
				if('FirstName' in info){
					if(info.FirstName){
						if(info.FirstName.length < 0 || info.FirstName.length > 50){
							error.push({field:"FirstName",message:"max length"});
							err.pushErrors(error);
						}
						if(!characterRegex.test(info.FirstName)){
							error.push({field:"FirstName",message:"invalid value"});
							err.pushErrors(error);
						}
					}
					else{
						error.push({field:"FirstName",message:"required"});
						err.pushErrors(error);
					}
				}

				//validate MiddleName
				if('MiddleName' in info){
					if(info.MiddleName){
						if(info.MiddleName.length < 0 || info.MiddleName.length > 100){
							error.push({field:"MiddleName",message:"max length"});
							err.pushErrors(error);
						}
						if(!characterRegex.test(info.MiddleName)){
							error.push({field:"MiddleName",message:"invalid value"});
							err.pushErrors(error);
						}
					}
				}

				//validate LastName
				if('LastName' in info){
					if(info.LastName){
						if(info.LastName.length < 0 || info.LastName.length > 50){
							error.push({field:"LastName",message:"max length"});
							err.pushErrors(error);
						}
						if(!characterRegex.test(info.LastName)){
							error.push({field:"LastName",message:"invalid value"});
							err.pushErrors(error);
						}
					}
					else{
						error.push({field:"LastName",message:"required"});
						err.pushErrors(error);
					}
				}

				//validate DOB
				if('DOB' in info){
					if(info.DOB){
						if(info.DOB!=null || info.DOB!=""){
							if(!/^(\d{1,2})[/](\d{1,2})[/](\d{4})/.test(info.DOB)){
								errors.push({field:"DOB",message:"invalid value"});
								err.pushErrors(errors);
							}
						}
					}
				}

				//validate Address1
				if('Address1' in info){
					if(info.Address1){
						if(info.Address1.length < 0 || info.Address1.length > 255){
							error.push({field:"Address1",message:"max length"});
							err.pushErrors(error);
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
				}

				//validate Address2
				if('Address2' in info){
					if(info.Address2){
						if(info.Address2.length < 0 || info.Address2.length > 255){
							error.push({field:"Address2",message:"max length"});
							err.pushErrors(error);
						}
						if(!addressRegex.test(info.Address2)){
							error.push({field:"Address2",message:"invalid value"});
							err.pushErrors(error);
						}
					}
				}

				//validate Suburb
				if('Suburb' in info){
					if(info.Suburb){
						if(info.Suburb.length < 0 || info.Suburb.length > 255){
							error.push({field:"Suburb",message:"max length"});
							err.pushErrors(error);
						}
					}
					else {
						error.push({field:"Suburb",message:"required"});
						err.pushErrors(error);
					}
				}

				//validate Postcode
				if('Postcode' in info){
					if(info.Postcode){
						if(info.Postcode.length < 0 || info.Postcode.length > 255){
							error.push({field:"Postcode",message:"max length"});
							err.pushErrors(error);
						}
						if(!postcodeRegex.test(info.Postcode)){
							error.push({field:"Postcode",message:"Postcode is a 4 digits number"});
							err.pushErrors(error);
						}
					}
					else{
						error.push({field:"Postcode",message:"required"});
						err.pushErrors(error);
					}
				}

				// validate Email? hoi a Tan su dung exception
				if('Email' in info){
					if(info.Email){
						var EmailPattern=new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/);
						if(!EmailPattern.test(info.Email)){
							error.push({field:"Email",message:"invalid value"});
							err.pushErrors(error);
						}
					}
				}

				//validate Occupation
				if('Occupation' in info){
					if(info.Occupation){
						if(info.Occupation.length < 0 || info.Occupation.length > 255){
							error.push({field:"Occupation",message:"max length"});
							err.pushErrors(error);
						}
						if(!characterRegex.test(info.Occupation)){
							error.push({field:"Occupation",message:"invalid value"});
							err.pushErrors(error);
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
							err.pushErrors(error);
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
							err.pushErrors(error);
						}
					}
				}

				//validate State
				if('State' in info){
					if(info.State){
						if(info.State.length < 0 || info.State.length > 255){
							error.push({field:"State",message:"max length"});
							err.pushErrors(error);
						}
						if(!characterRegex.test(info.State)){
							error.push({field:"State",message:"invalid value"});
							err.pushErrors(error);
						}
					}
					else {
							error.push({field:"State",message:"required"});
							err.pushErrors(error);
					}
				}

				//validate Country
				if('CountryID' in info){
					if(info.CountryID==null){
						error.push({field:"CountryID",message:"required"});
						err.pushErrors(error);
					}
				}

				//Clinical Department
				// if(info.Department.DepartmentName){
				// 	if(info.Department.DepartmentName.length<0 || info.Department.DepartmentName.length > 255){
				// 		error.push({field:'Department.DepartmentName', message:'max length'});
				// 	}
				// }

				// validate DepartmentID
				if('DepartmentID' in info){
					if(info.DepartmentID) {
						if(info.DepartmentID.length < 0) {
							error.push({field:"DepartmentID",message:"length"});
							err.pushErrors(error);
						}
					}
					// else {
					// 	error.push({field:"DepartmentID",message:"required"});
					// 	err.pushErrors(error);
					// }
				}

				// validate ProviderNumber
				if('ProviderNumber' in info){
					if(info.ProviderNumber) {
						if(info.ProviderNumber.length < 0 || info.ProviderNumber.length > 255) {
							error.push({field:"ProviderNumber",message:"length"});
							err.pushErrors(error);
						}
					}
					else {
						error.push({field:"ProviderNumber",message:"required"});
						err.pushErrors(error);
					}
				}

				// validate Type
				// if('Type' in info){
				// 	if(info.Type) {
				// 		if(info.Type.length < 0) {
				// 			error.push({field:"Type",message:"length"});
				// 			err.pushErrors(error);
				// 		}
				// 	}
				// 	else {
				// 		error.push({field:"Type",message:"required"});
				// 		err.pushErrors(error);
				// 	}
				// }

				// validate Speciality
				// if('Speciality' in info){
				// 	if(info.Speciality) {
				// 		if(info.Speciality.length < 0) {
				// 			error.push({field:"Speciality",message:"length"});
				// 			err.pushErrors(error);
				// 		}
				// 	}
				// 	else {
				// 		error.push({field:"Speciality",message:"required"});
				// 		err.pushErrors(error);
				// 	}
				// }

				//validate HealthLinkID
				if('HealthLinkID' in info){
					if(info.HealthLinkID){
						if(info.HealthLinkID.length < 0 || info.HealthLinkID.length > 255){
							error.push({field:"HealthLinkID",message:"max length"});
							err.pushErrors(error);
						}
					}
					else {
						error.push({field:"HealthLinkID",message:"required"});
						err.pushErrors(error);
					}
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

	validateCheckPhone : function(info) {
		var character = new RegExp(check.regexPattern.character);
		var address   = new RegExp(check.regexPattern.address);
		var postcode  = new RegExp(check.regexPattern.postcode);
		var error = [];
		var err = new Error("ERRORS");
		var q = $q.defer();

		try {

			//validate Title
			if('Title' in info){
				if(!info.Title){
					error.push({field:"Title",message:"required"});
					err.pushErrors(error);
					// toastr.error('Title is required');
				}
			}

			//validate UserName
			if('UserName' in info){
				if(info.UserName){
					if(info.UserName.length < 0 || info.UserName.length > 50){
						error.push({field:"UserName",message:"max length"});
						err.pushErrors(error);
					}
				}
				else {
					error.push({field:"UserName",message:"required"});
					err.pushErrors(error);
					// toastr.error('UserName is required');
				}
			}

			//validate FirstName
			if('FirstName' in info){
				if(info.FirstName){
					if(info.FirstName.length < 0 || info.FirstName.length > 50){
						error.push({field:"FirstName",message:"max length"});
						err.pushErrors(error);
					}
				}
				else {
					error.push({field:"FirstName",message:"required"});
					err.pushErrors(error);
					// toastr.error('FirstName is required');
				}
			}

			//validate MiddleName
			if('MiddleName' in info){
				if(info.MiddleName){
					if(info.MiddleName.length > 100){
						error.push({field:"MiddleName",message:"max length"});
						err.pushErrors(error);
					}
				}
			}

			//validate LastName
			if('LastName' in info){
				if(info.LastName){
					if(info.LastName.length < 0 || info.LastName.length > 255){
						error.push({field:"LastName",message:"max length"});
						err.pushErrors(error);
					}
				}
				else {
					error.push({field:"LastName",message:"required"});
					err.pushErrors(error);
					// toastr.error('LastName is required');
				}
			}

			//validate PhoneNumber
			if('PhoneNumber' in info){
				if(info.PhoneNumber){
					var auPhoneNumberPattern=new RegExp(/^(\+61|0061|0)?4[0-9]{8}$/);
					var PhoneNumber=info.PhoneNumber.replace('/[\(\)\s\-]/g','');
					if(!auPhoneNumberPattern.test(PhoneNumber)){
						error.push({field:"PhoneNumber",message:"Phone Number is a 10 digits number. Eg: 04 xxxx xxxx"});
						err.pushErrors(error);
						// toastr.error('PhoneNumber invalid');
					}
				}
				else{
					error.push({field:"PhoneNumber",message:"required"});
					err.pushErrors(error);
					// toastr.error('PhoneNumber is required');
				}
			}

			//validate Email
			if('Email' in info){
				if(info.Email){
					var EmailPattern=new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/);
					var Email=info.Email.replace('/[\(\)\s\-]/g','');
					if(!EmailPattern.test(Email)){
						error.push({field:"Email",message:"invalid email"});
						err.pushErrors(error);
						// toastr.error('Email invalid');
					}
				}
				else {
					error.push({field:"Email",message:"required"});
					err.pushErrors(error);
					// toastr.error('Email is required');
				}
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
		return q.promise;
	},

	validationDoctorGroup : function(data) {
		var characterRegex = /^[a-zA-Z0-9\s]{0,255}$/;
		var textRegex = /^[a-zA-Z0-9\s]*$/;

		var error = [];
		var err = new Error("ERRORS");
		var q = $q.defer();
		try {

			//validate FirstName
			if(data.GroupName){
				if(data.GroupName.length < 0 || data.GroupName.length > 50){
					error.push({field:"GroupName",message:"max length"});
					err.pushErrors(error);
				}
				if(!characterRegex.test(data.GroupName)){
					error.push({field:"GroupName",message:"invalid value"});
					err.pushErrors(error);
				}
			}
			// else{
			// 	error.push({field:"GroupName",message:"required"});
			// }

			if(data.GroupCode) {
				if(!characterRegex.test(data.GroupCode)){
					error.push({field:"GroupCode",message:"invalid value"});
					err.pushErrors(error);
				}
			}
			else{
				error.push({field:"GroupCode",message:"required"});
				err.pushErrors(error);
			}

			if(data.Description){
				if(!textRegex.test(data.Description)){
					error.push({field:"Description",message:"invalid value"});
					err.pushErrors(error);
				}
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
		return q.promise;

	},

	whereClause : function(data) {
		var whereClause = {};
		whereClause.Doctor = {};
		whereClause.UserAccount ={};
		whereClause.Role = {};
		whereClause.Department = {};
		if(check.checkData(data.Search)){
			if(data.Search.FirstName){
				whereClause.Doctor.FirstName={
					like:'%'+data.Search.FirstName+'%'
				}
			}
			if(data.Search.MiddleName){
				whereClause.Doctor.MiddleName = {
					like:'%'+data.Search.MiddleName+'%'
				}
			}
			if(data.Search.LastName){
				whereClause.Doctor.LastName = {
					like:'%'+data.Search.LastName+'%'
				}
			}
			if(data.Search.Gender){
				whereClause.Doctor.Gender = {
					like:'%'+data.Search.Gender+'%'
				}
			}
			if(data.Search.Email){
				whereClause.Doctor.Email = {
					like:'%'+data.Search.Email+'%'
				}
			}
			if(data.Search.Type){
				whereClause.Doctor.Type = {
					like:'%'+data.Search.Type+'%'
				}
			}
			if(data.Search.Enable){
				whereClause.UserAccount.Enable = {
					like:'%'+data.Search.Enable+'%'
				}
			}
			if(data.Search.UserAccount){
				if(data.Search.UserAccount[0]=='0'){
					data.Search.UserAccount = data.Search.UserAccount.substr(1,data.Search.UserAccount.length);
				}
				whereClause.UserAccount.PhoneNumber = {
					like:'%'+data.Search.UserAccount+'%'
				}
			}
			if(data.Search.RoleName){
				whereClause.Role.RoleName = {
					like:'%'+data.Search.RoleName+'%'
				}
			}
			if(data.Search.DepartmentName)
			{
				whereClause.Department.DepartmentName = {
					like: '%'+data.Search.DepartmentName+'%'
				}
			}
		}
		return whereClause;
	},

	getListDoctor: function(data, order, transaction) {
		var FirstName = '',LastName = '';
		var isConcat = false;
		var whereClause = Services.Doctor.whereClause(data);
		if(data.Search){
			if(data.Search.FirstName!='' && data.Search.LastName!=''
			&& data.Search.FirstName!=undefined && data.Search.LastName!=undefined){
				FirstName = data.Search.FirstName;
				LastName  = data.Search.LastName;
				isConcat = true;
			}
		}
		if(order==1){
			return Doctor.findAndCountAll({
				include:[
					{
		          		model: UserAccount,
		          		attributes: ['PhoneNumber'],
				  		required: true,
				  		where:{
				   			$or: whereClause.UserAccount
				   		}
			    	}
				],
				// attributes : attributes,
				// limit      : data.limit,
				offset     : data.offset,
				order      : data.order,
				where: {
					$or: [
						whereClause.Doctor,
						isConcat?Sequelize.where(Sequelize.fn("concat", Sequelize.col("FirstName"),' ', Sequelize.col("LastName")), {
			    	   	like: '%'+FirstName+' '+LastName+'%'}):null,
					]
				},
				transaction:transaction
			});
		}
		else{
			return Doctor.findAndCountAll({
				include:[
					{
						include:[
							{
								include:[
									{
										model: Role,
					          			attributes: ['RoleName'],
							  			required: true,
							  		}
								],
				          		model: RelUserRole,
				          		attributes: ['RoleId'],
						  		required: true,
					    	}
						],
		          		model: UserAccount,
		          		attributes: ['PhoneNumber'],
				  		required: true,
				  		where:{
				   			$or: whereClause.UserAccount
				   		}
			    	},
				],

				// attributes : attributes,
				limit      : data.limit,
				offset     : data.offset,
				order      : data.order,
				subQuery   : false,
				where: {
					$or: [
						whereClause.Doctor,
						isConcat?Sequelize.where(Sequelize.fn("concat", Sequelize.col("FirstName"),' ', Sequelize.col("LastName")), {
			    	   	like: '%'+FirstName+' '+LastName+'%'}):null,
					]
				},
				transaction:transaction
			});
		}
	},

	/*
		LoadlistDoctor: Get all data comment
	*/
	LoadlistDoctor: function(data, transaction) {
		var isAvatar = data.isAvatar?data.isAvatar:false;
		var include_data = [];
		var Role_Arr = [check.const.rolesID.externalPractitioner, check.const.rolesID.internalPractitioner];
		if(data.RoleID) {
			Role_Arr = data.RoleID;
		}
		var FirstName = '',LastName = '';
		var attributes = [];
		var isConcat = false;
		var whereClause = Services.Doctor.whereClause(data);
		console.log(data);
		console.log(whereClause);
		var FullName;
		if(data.Search){
			FullName = data.Search.FullName?data.Search.FullName:null;
			if(data.Search.FirstName!='' && data.Search.LastName!=''
			&& data.Search.FirstName!=undefined && data.Search.LastName!=undefined){
				FirstName = data.Search.FirstName;
				LastName  = data.Search.LastName;
				isConcat = true;
			}
		}
		if(data.attributes!=undefined && data.attributes!=null
			 && data.attributes!='' && data.attributes.length!=0){
			for(var i = 0; i < data.attributes.length; i++){
				if(data.attributes[i].field!='UserAccount' && data.attributes[i].field!='RoleName'){
					attributes.push(data.attributes[i].field);
				}
			};
			attributes.push("UID");
			attributes.push("Enable");
			attributes.push("DepartmentID");
		}
		else{
			attributes = defaultAtrributes;
		}
		// data.order = data.order?data.order+',Doctor.CreatedDate ASC':'CreatedDate ASC';

		if(isAvatar == true) {
			include_data.push({
				model:FileUpload,
				attributes:['UID'],
				where:{
					FileType:'ProfileImage',
					Enable:'Y'
				},
				required:false
			});
		}

		include_data.push({
			model: TelehealthUser,
		    required: false,
		    attributes:['ID','UID']
		});

		include_data.push({
			include:[
				{
					model: Role,
				    attributes: ['RoleName','RoleCode'],
				    where:{
				       	$or: check.sqlParam(whereClause.Role)
				   	},
				    required: true,
				}
			],
			model: RelUserRole,
			attributes: ['RoleId'],
			where:{
			    RoleId : {in:Role_Arr}
			},
			required: true,
		});

		var indexArr = attributes.indexOf('CreatedDate');
		if(indexArr == -1) {
			attributes.push('CreatedDate');
		}

		var order = [];
		// order.push(['CreatedDate', 'ASC']);
		if(data.order) {
			if(data.order.length==3)
			{
				order.push([sequelize.models[data.order[0]], data.order[1], data.order[2] ])
			}
			else {
				order.push(data.order);
			}
		}
		else {
			order.push(['CreatedDate', 'ASC']);
		}
		return Doctor.findAndCountAll({
			include:[
				{
					include:include_data,
		       		model: UserAccount,
		      		attributes: ['ID','PhoneNumber','Enable', 'UID'],
			  		where:{
			   			$or: check.sqlParam(whereClause.UserAccount),
			   			Enable:'Y'
			   		},
			   		required: true,
		    	},
				{
					model: Department,
					attributes:['ID', 'UID', 'SiteID', 'DepartmentCode', 'DepartmentName'],
					where:{
						$or: check.sqlParam(whereClause.Department)
					},
					required:!_.isEmpty(whereClause.Department)?true:false
				}
			],
			attributes : attributes,
			limit      : data.limit,
			offset     : data.offset,
			order      : order,
			subQuery   : false,
			where: {
				Enable:'Y',
				$and: [
					check.sqlParam(whereClause.Doctor),
					isConcat?Sequelize.where(Sequelize.fn("concat", Sequelize.col("Doctor.FirstName"),' ', Sequelize.col("Doctor.LastName")), {
		    	   	like: '%'+FirstName+' '+LastName+'%'}):null,
		    	   	FullName?Sequelize.where(Sequelize.fn("concat", Sequelize.col("Doctor.FirstName"),' ', Sequelize.col("Doctor.LastName")), {
		    	   	like: '%'+FullName+'%'}):null,
				]
			},
			transaction:transaction
		}).
		then(function(result){
			return result;
		},function(err){
			throw err;
		});
	},

	DetailDoctor: function(data, transaction) {
		var index = defaultAtrributes.indexOf('UserAccount.PhoneNumber');
		if(index != -1) {
			defaultAtrributes.splice(index,1);
		}
		return Doctor.findOne({
			include:[
				{
					model: UserAccount,
		          	attributes: ['PhoneNumber','UserName','Email','UID','Enable'],
				  	required: false,
				  	include:[
				  		{
				  			model:RelUserRole,
				  			attributes:['RoleId'],
				  			required: false
				  		}
				  	]
				},
				{
					model: Department,
					attributes:['UID','DepartmentName'],
					required: false
				},
				{
					model:Speciality,
					attributes:['Name','ID'],
					required:false
				}
			],
			attributes:defaultAtrributes,
			where :{
				UID : data.uid
			},
			transaction:transaction
		});
	},

	checkUserRole: function(UserAccountID,transaction){
		return RelUserRole.findOne({
			where:{
				UserAccountId : UserAccountID
			},
			attributes:['UserAccountId','RoleId'],
			transaction:transaction
		});
	},

	UpdateDoctor: function(data, transaction) {
		var isHaveRole = false;
		var uid;
		return sequelize.transaction()
		.then(function(t){

			return Services.Doctor.validation(data.info)
			.then(function(result){
				if(result!=undefined && result!=null&& result!=''){
					if(data.Signature != null && data.Signature != '') {
						return FileUpload.findOne({
                            where :{
                                UID : data.Signature
                            },
                            transaction : t
                        })
                        .then(function(got_file) {
                        	if(got_file == null || got_file == '') {
                        		t.rollback();
                        		var err = new Error("UpdateDoctor.Error");
                        		err.pushError("Signature.error");
                        		throw err;
                        	}
                        	else {
                        		return got_file;
                        	}
                        },function(err) {
                        	t.rollback();
                        	throw err;
                        })
					}
					else {
						return result;
					}
				}
			},function(err){
				throw err;
			})
			.then(function(got_data) {
				if(data.Signature != null && data.Signature != '') {
					data.info.Signature = got_data.ID;
				}
				return Doctor.update(data.info,{
						where:{
							UID : data.UID
						},
						transaction:t
					})
					.then(function(user){
						uid = data.info.UserAccount['UID'];
						delete data.info.UserAccount['PhoneNumber'];
						delete data.info.UserAccount['UserName'];
						delete data.info.UserAccount['Email'];
						delete data.info.UserAccount['UID'];
						delete data.info.UserAccount['Password'];
						return Doctor.findOne({
							where:{
								UID : data.UID
							},
							transaction:t
						});
					},function(err){
						t.rollback();
						throw err;
					});

			},function(err){
				t.rollback();
				throw err;
			})
			.then(function(doctor){
				if(_.isEmpty(data.info.Speciality) == false)
					return doctor.setSpecialities(data.info.Speciality,{transaction:t});
			},function(err){
				t.rollback();
				throw err;
			})
			.then(function(updatedSpecial){
				if(_.isEmpty(data.info.UserAccount) == false){
					return UserAccount.update(data.info.UserAccount,{
						where : {
							UID : uid
						},
						transaction:t
					});
				}
			},function(err){
				t.rollback();
				throw err;
			})
			.then(function(result){
				if(data.RoleId!=undefined && data.RoleId!=null
				&& data.RoleId!="" && (data.RoleId==4 || data.RoleId==5)){
					isHaveRole = true;
					return Services.Doctor.checkUserRole(data.UserAccountID,t);
				}
				else{
					t.commit();
					return result;
				}
			},function(err){
				t.rollback();
				throw err;
			})
			.then(function(check){
				if(isHaveRole==true){
					if(check==null){
						return RelUserRole.create({
							RoleId        : data.RoleId,
							UserAccountId : data.UserAccountID,
							SiteId        : 1,
							CreatedDate   : new Date(),
							Enable        : 'Y'
						},{transaction:t});
					}
					else{
						return RelUserRole.update({
							RoleId        : data.RoleId,
							ModifiedDate   : new Date()
						},{
							transaction:t,
							where:{
								UserAccountId : data.UserAccountID
							}
						});
					}
				}
				else{
					return check;
				}
			},function(err){
				t.rollback();
				throw err;
			})
			.then(function(success){
				if(isHaveRole==true){
					t.commit();
					return success;
				}
				else{
					return success;
				}
			},function(err){
				t.rollback();
				throw err;
			});
		});
	},

	GetDoctor: function(data, transaction) {
		return Services.UserAccount.GetUserAccountDetails(data)
		.then(function(user){
			//check if UserAccount is found in table UserAccount, get UserAccountID to find doctor
			if(check.checkData(user)){
				return Doctor.findOne({
					where: {
						UserAccountID : user.ID
					},
					transaction:transaction,
					// attributes:attributes,
					include: [
						{
			            	model: UserAccount,
			            	attributes: ['PhoneNumber'],
			            	required: true,
			            	include:[
			            		{
						  			model:RelUserRole,
						  			attributes:['RoleId'],
						  			required: false
						  		}
			            	]
			            },
			            {
							model: Department,
							attributes:['UID','DepartmentName'],
							required: false
						},
						{
							model:Speciality,
							attributes:['Name','ID'],
							required:false
						}
					]
				});
			}
			else{
				return null;
			}
		},function(err){
			throw err;
		});
	},

	FindDoctorByClause: function(data, transaction) {
		var whereClause = Services.Doctor.whereClause(data);
		return Doctor.findAll({
			attributes:['FirstName','LastName','ID'],
			where:data
		})
		.then(function(success){
			if(success!="")
				success.isExisted = true;
			else
				success.isExisted = false;
			return success;
		},function(err){
			throw err;
		});
	},

	CheckUserExist : function(data, transaction) {
		var postData = [];
		var whereClause = {};
		var userID = [];
		if(data.UserName!=undefined && data.UserName!=null && data.UserName!=''){
			whereClause.UserName = data.UserName;
		}
		if(data.Email!=undefined && data.Email!=null && data.Email!=''){
			whereClause.Email = data.Email;
		}
		if(data.PhoneNumber!=undefined && data.PhoneNumber!=null && data.PhoneNumber!=''){
			if(data.PhoneNumber.substring(0,2)=="04"){
				if(data.PhoneNumber.length==10){
					data.PhoneNumber = data.PhoneNumber.replace("04", "+614");
					whereClause.PhoneNumber = data.PhoneNumber;
				}
			}
			else {
				whereClause.PhoneNumber = data.PhoneNumber;
			}

		}
		return UserAccount.findAll({
			attributes:['ID','UserName','Email','PhoneNumber'],
			where:{
				$or:whereClause
			}
		})
		.then(function(result){
			for(var i = 0; i < result.length; i++){
				userID.push(result[i].dataValues.ID);
				if(result[i].dataValues.UserName == data.UserName){
					postData.push({field:'UserName',ID:result[i].dataValues.ID});
				}
				if(result[i].dataValues.Email == data.Email){
					postData.push({field:'Email',ID:result[i].dataValues.ID});
				}
				if(result[i].dataValues.PhoneNumber == data.PhoneNumber){
					postData.push({field:'PhoneNumber',ID:result[i].dataValues.ID});
				}
			}
			return Doctor.findAll({
				where:{
					UserAccountID :{
						$in : userID
					}
				}
			});
			// return postData;
		},function(err){
			throw err;
		})
		.then(function(got_doctor){
			var responseData = [];
			if(got_doctor) {
				for(var i = 0; i < got_doctor.length; i++) {
					for(var j = 0; j < postData.length; j++) {
						if(got_doctor[i].UserAccountID == postData[j].ID) {
							responseData.push(postData[j].field);
						}
					}
				}
			}
			return responseData;
		},function(err) {
			throw err;
		});
	},

	CheckDoctor : function(data, transaction) {
		var dataCheckBegin = {};
		var postData = [];
		return Services.Doctor.validateCheckPhone(data)
		.then(function(info){
			return Services.Doctor.CheckUserExist(data);
		},function(err){
			throw err;
		})
		.then(function(success){
			return success;
		},function(err){
			throw err;
		});
	},

	CreateDoctorByNewAccount : function(data, transaction) {
		var userUID,userID,Doctors,User;
		var SpecialityList = [];
		var userInfo = {};
		return sequelize.transaction()
		.then(function(t){
			return Services.Doctor.validation(data,true)
			.then(function(result){
				if(result.status=="success"){
					// data.UID = UUIDService.Create();
					// var userInfo = {
					// 	UserName    : data.UserName,
					// 	PhoneNumber : data.PhoneNumber,
					// 	Email       : data.Email,
					// 	Password    : generatePassword(12, false)
					// };
					// return Services.UserAccount.CreateUserAccount(userInfo,t);
					userInfo.UserName = data.UserName;
                    userInfo.PhoneNumber = check.parseAuMobilePhone(data.PhoneNumber);
                    userInfo.Email = data.Email;
                    return Services.UserAccount.GetUserAccountDetails(userInfo, null, t);
				}
			},function(err){
				throw err;
			})
			.then(function(got_checkuser) {
				if (got_checkuser == '' || got_checkuser == null) {
                    userInfo.Password = generatePassword(12, false);
                    userInfo.PinNumber = data.PinNumber ? data.PinNumber : generatePassword(6, false,/\d/);
					userInfo.Activated = 'Y';
					userInfo.Enable    = 'Y';
					userInfo.ExpiryPin = 5;
                    return Services.UserAccount.CreateUserAccount(userInfo, t);
                } else {
                    return got_checkuser;
                }
			},function(err) {
				throw err;
			})
			.then(function(user) {
				data.UserAccountID = user.ID;
                data.UserAccountUID = user.UID;
                return Doctor.findOne({
                    where: {
                        UserAccountID: data.UserAccountID
                    },
                   	transaction: t
                });
			},function(err) {
				throw err;
			})
			.then(function(got_doctor){
				if (got_doctor == null || got_doctor == '') {
					data.UID = UUIDService.Create();
					data.HealthLink = data.HealthLinkID;
					data.Enable = 'Y';
					return Doctor.create(data,{transaction:t});
                } else {
                    var err = new Error("CreateDoctorByNewAccount.Error");
                    err.pushError("UserAccount.Has.Used");
                    throw err;
                }
			},function(err) {
				throw err;
			})
			.then(function(doctorObj){
				Doctors = doctorObj;
				return Doctors.addSpeciality(data.Speciality,{transaction:t});
			},function(err){

				t.rollback();
				throw err;
			})
			.then(function(addSpecialitiesComplete){
				var addData = {
					RoleId : data.RoleId,
					SiteId : 1
				};

				// return User.addRole(data.RoleId,{SiteId:1},{transaction:t});
				return RelUserRole.create({
					RoleId : data.RoleId,
					SiteId : 1,
					UserAccountId : data.UserAccountID
				},{transaction:t});
			},function(err){
				t.rollback();
				throw err;
			})
			.then(function(success){
				t.commit();
				var response = {
					userID  : data.UserAccountID,
					userUID : data.UserAccountUID
				};
				return response;
			},function(err){
				t.rollback();
				throw err;
			})
		});
	},

	GetListSpeciality: function() {
		return Speciality.findAll({
			attributes:['ID','Name']
		});
	},

	UpdateSignature: function(data) {

		if(data!=null && data!=""){
			return sequelize.transaction()
			.then(function(t){
				return Doctor.findAll({
					attributes:['ID','UserAccountID'],
					transaction:t,
					where:{
						UserAccountID:data
					}
				})
				.then(function(result){
					if(result[0]==null){
						return ['2'];
					}
					else {
						return FileUpload.findAll({
							attributes:['ID','FileName','UID'],
							where:{
								UserAccountID : result[0].UserAccountID,
								FileType:'Signature',
								Enable:'Y'
							},
							transaction:t
						});
					}
				},function(err){
					t.rollback();
					throw err;
				})
				.then(function(result){
					if(result[0]==null){
						return ['3'];
					}
					else if(result[0]=='2') {
						return ['2'];
					}
					else{
						return Doctor.update({
							Signature: result[0].ID
						},{
							where:{
								UserAccountID : data
							},
							transaction:t
						});
					}
				},function(err){
					t.rollback();
					throw err;
				})
				.then(function(success){
					if(success[0]==1){
						t.commit();
						return success;
					}
					else {
						return success;
					}
				},function(err){
					t.rollback();
					throw err;
				})
			},function(err){
				throw err;
			});
		}
		else{
			var error = new Error("UpdateSignature.queryError");
			error.pushError("userID.null");
			return error;
		}
	},

	/*
		DoctorAppointment: List doctor for Appointment
	*/
	DoctorAppointment: function() {

		return Doctor.findAll({
						include: [
							{
				            	model: UserAccount,
				            	attributes: ['PhoneNumber'],
				            	required: true,
				            	where:{
				            		Enable:'Y'
				            	}
				            }
						],
						where: {
							Enable: 'Y'
						}
					});

	},
	/*
		DoctorIDAppointment: Get doctor according to ID
	*/
	DoctorIDAppointment: function(data) {

		return Doctor
					.findAll({
						where: {
							UID: data.UID
						}
					});

	},
	/*
		GetAllDepartment: Get all data of Department
	*/
	GetAllDepartment: function() {
		return Department.findAll();
	},
	/*
		CreateDoctor: Create new doctor
	*/
	CreateDoctor: function(data, transaction) {

		var info = {
			UID: UUIDService.Create(),
			UserAccountID: data.UserAccountID,
			DepartmentID: data.DepartmentID,
			Title: data.Titles,
			FirstName: data.FirstName,
			MiddleName: data.MiddleName,
			LastName: data.LastName,
			Type: data.Speciality,
			DOB: data.DOB,
			Address1: data.Address1,
			Address2: data.Address2,
			Postcode: data.Postcode.toString(),
			Suburb: data.Suburb.toString(),
			State: data.State,
			CountryID: data.CountryID.toString(),
			Email: data.Email,
			HomePhoneNumber: data.HomePhoneNumber,
			WorkPhoneNumber: data.WorkPhoneNumber,
			HealthLink: data.HealthLinkID,
			ProviderNumber: data.ProviderNumber.toString(),
			Enable: 'Y',
			CreatedDate: data.CreatedDate,
			CreatedBy: data.CreatedBy
		};

		return Doctor.create(info, {
			transaction: transaction
		});

	},
	/*
		GetDetail: Get information's doctor according to uid's doctor
	*/
	GetDetail: function(data) {

		return Doctor.findAll({
				include: [{
					model: UserAccount,
					attributes: ['UserName', 'PhoneNumber', 'ID', 'Enable'],
					where: {
						ID: data.UserAccountID
					}
				}],
				where: {
					UID: data.UID
				}
			});

	},

	/*
		UpdateAccountDoctor: update status account's doctor
	*/
	UpdateAccountDoctor: function(data) {

		return UserAccount.update({
							Enable: data.Enable
						}, {
							where: {
								ID: data.UserAccountID
							}
						});

	},
	/*
		GetUploadFile: get UID's FileUpload
	*/
	GetUploadFile: function(data) {
		return FileUpload.findAll({
						where: {
							UserAccountID: {
								$in: [data.UserAccountID]
							},
							Enable: 'Y'
						}
					});
	},
	/*
		GetOneUser: Get UID's UserAccount
	*/
	GetOneUser: function(data) {
		return UserAccount.findAll({
					where: {
						ID: data.UserAccountID
					}
				});
	},
	/*
		GetRoleDoctor: Get role's doctor
	*/
	GetRoleDoctor: function(data) {
		return RelUserRole.findOne({
					where: {
						UserAccountId: data
					},
					include: [{
						model: Role,
						attributes: ['RoleName']
					}]
				});
	},
	/*
		GetDepartment: Get department according to ID's department
	*/
	GetDepartment: function(data) {
		return Department.findOne({
						attributes: ['UID', 'DepartmentName'],
						where: {
							ID: data
						},
						Enable: 'Y'
					});
	},

	CreateGroup: function(data) {
		//check groupcode
		if(!data.GroupCode) {
			var err = new Error('CreateGroup.error');
			err.pushError('GroupCode.notFound');
			throw err;
		}
		return sequelize.transaction()
		.then(function(t) {
			return Services.Doctor.validationDoctorGroup(data)
			.then(function(result) {
				data.UID    = UUIDService.Create();
				data.Enable = 'Y';
				return DoctorGroup.create(data,{transaction:t})
			},function(err) {
				throw err;
			})
			.then(function(created) {
				if(_.isEmpty(created)) {
					t.rollback();
					var err = new Error('CreateGroup.error');
					err.pushError('create.queryError');
					throw err;
				}
				else {
					t.commit();
					return created;
				}
			},function(err) {
				t.rollback();
				throw err;
			})
		},function(err) {
			throw err;
		});
	},

	LoadListGroup: function(data) {
		var whereClause = {};
		if(data.search && _.isEmpty(data.search) == false) {
			for(var key in data.search) {
				whereClause[key] = {
					like:'%'+data.search[key]+'%'
				};
			}
		}
		var include = null;
		if(data.include) {
			if(data.include.Doctor) {
				include = {
					model: Doctor,
					through: {
						attributes: []
					},
					attributes: data.include.Doctor.attributes,
					required:true,
					include: data.include.Department?
							{
								model: Department,
								attribute: ['DepartmentName'],
								required: false
							}:null
				}
			}
		}
		return DoctorGroup.findAndCountAll({
			where : whereClause,
			limit : data.limit,
			offset: data.offset,
			order : data.order,
			include: include,
			// include: {
			// 	model: Doctor,
			// 	through: {
			// 		attributes:[]
			// 	},
			// 	attributes: ['FirstName', 'LastName']
			// },
		})
		.then(function(got_list) {
			if(_.isEmpty(got_list)) {
				var err = new Error('LoadListGroup.error');
				err.pushError('loadlist.queryError');
				throw err;
			}
			else {
				return got_list;
			}
		},function(err) {
			throw err;
		})
	},

	GetDetailGroup : function(data) {
		if(!data.UID){
			var err = new Error('GetDetailGroup.error');
			err.pushError('UID.invalidParams');
			throw err;
		}
		return DoctorGroup.findOne({
			where:{
				UID : data.UID
			}
		})
		.then(function(result) {
			if(_.isEmpty(result)) {
				var err = new Error('GetDetailGroup.error');
				err.pushError('Group.notFound');
				throw err;
			}
			else {
				return result;
			}
		},function(err) {
			throw err;
		})
	},

	AddDoctorGroup: function(data) {
		var doctor,group;
		if(!data.doctorUID) {
			var err = new Error('AddDoctorGroup.error');
			err.pushError('doctorUID.invalid');
			throw err;
		}
		if(!data.doctorGroupUID) {
			var err = new Error('AddDoctorGroup.error');
			err.pushError('doctorGroupUID.invalid');
			throw err;
		}
		return sequelize.transaction()
		.then(function(t) {
			return Doctor.findOne({
				include:[
					{
						model:UserAccount,
						attributes:['PhoneNumber','Email','ID','UID'],
						required:true,
						include:[
							{
								model:Role,
								required:true,
							}
						]
					}
				],
				where: {
					UID : data.doctorUID,
					Enable:'Y'
				},
				transaction : t
			})
			.then(function(got_doctor) {
				console.log("UserAccount ",got_doctor.UserAccount);
				if(_.isEmpty(got_doctor)) {
					var err = new Error('AddDoctorGroup.error');
					err.pushError('Doctor.notFound');
					throw err;
				}
				else {
					var isInternal = false;
					doctor = got_doctor;
					for(var i = 0; i < doctor.UserAccount.Roles.length; i++) {
						if(doctor.UserAccount.Roles[i].ID == '5') {
							isInternal = true;
						}
					}
					if(isInternal == true){
						return DoctorGroup.findOne({
							where:{
								UID : data.doctorGroupUID,
								Enable : 'Y',
							},
							transaction: t
						});
					}
					else {
						var err = new Error('AddDoctorGroup.error');
						err.pushError('Not.Internal');
						throw err;
					}
				}
			},function(err) {
				throw err;
			})
			.then(function(got_group) {
				if(_.isEmpty(got_group)) {
					var err = new Error('AddDoctorGroup.error');
					err.pushError('Group.notFound');
					throw err;
				}
				else {
					group = got_group;
					return RelDoctorGroup.findOne({
						where:{
							DoctorID: doctor.ID,
							DoctorGroupID: group.ID,
						},
						transaction: t,
					});
				}
			},function(err) {
				throw err;
			})
			.then(function(got_rel) {
				if(_.isEmpty(got_rel) == false) {
					var err = new Error('AddDoctorGroup.error');
					err.pushError('Doctor.Added.Group');
					throw err;
				}
				else {
					return RelDoctorGroup.create({
						DoctorID      : doctor.ID,
						DoctorGroupID : group.ID,
					},{transaction:t});
				}
			},function(err) {
				throw err;
			})
			.then(function(created){
				if(_.isEmpty(created)) {
					t.rollback();
					var err = new Error('AddDoctorGroup.error');
					err.pushError('Create.queryError');
					throw err;
				}
				else {
					t.commit();
					return created;
				}
			},function(err) {
				t.rollback();
				throw err;
			});
		},function(err) {
			throw err;
		});
	},

	LoadListDoctorfromGroup: function(data) {
		if(!data.doctorGroupUID) {
			var err = new Error('LoadListDoctorfromGroup.error');
			err.pushError('doctorGroupUID.invalid');
			throw err;
		}
		return DoctorGroup.findOne({
			where:{
				UID: data.doctorGroupUID
			}
		})
		.then(function(got_group) {
			if(_.isEmpty(got_group)) {
				var err = new Error('LoadListDoctorfromGroup.error');
				err.pushError('Group.notFound');
				throw err;
			}
			else {
				return got_group.getDoctors({
					include:[
						{
							model:UserAccount,
							attributes:['PhoneNumber','Email','ID','UID'],
							required:true,
							include:[
								{
									model:Role,
									required:true,
								}
							],
						}
					]
				});
			}
		},function(err) {
			throw err;
		})
		.then(function(got_doctor) {
			return got_doctor;
		},function(err) {
			throw err;
		})
	},

	DeleteDoctorfromGroup: function(data) {
		if(!data.doctorID) {
			var err = new Error('DeleteDoctorfromGroup.error');
			err.pushError('doctorID.invalid');
			throw err;
		}
		if(!data.doctorGroupID) {
			var err = new Error('DeleteDoctorfromGroup.error');
			err.pushError('doctorGroupID.invalid');
			throw err;
		}
		return sequelize.transaction()
		.then(function(t) {
			return RelDoctorGroup.findOne({
				where:{
					DoctorID      : data.doctorID,
					DoctorGroupID : data.doctorGroupID,
				},
				transaction: t
			})
			.then(function(got_rel) {
				if(_.isEmpty(got_rel)) {
					var err = new Error('DeleteDoctorfromGroup.error');
					err.pushError('notFound.Rel');
					throw err;
				}
				else {
					return RelDoctorGroup.destroy({
						where:{
							DoctorID      : data.doctorID,
							DoctorGroupID : data.doctorGroupID,
						},
						transaction: t
					});
				}
			},function(err) {
				throw err;
			})
			.then(function(deleted) {
				console.log("deleted ",deleted);
				if(deleted == null || deleted == "") {
					t.rollback();
					var err = new Error('DeleteDoctorfromGroup.error');
					err.pushError('Delete.queryError');
					throw err;
				}
				else {
					t.commit();
					return deleted;
				}
			},function(err) {
				t.rollback();
				throw err;
			})
		},function(err) {
			throw err;
		})
	},

	UpdateGroup: function(data) {
		return sequelize.transaction()
		.then(function(t) {
			return Services.Doctor.validationDoctorGroup(data)
			.then(function(result) {
				return DoctorGroup.findOne({
					where:{
						UID    : data.UID,
						Enable : 'Y',
					},
					transaction: t
				});
			},function(err) {
				throw err;
			})
			.then(function(got_group) {
				if(_.isEmpty(got_group)) {
					var err = new Error('UpdateGroup.error');
					err.pushError('Group.notFound');
					throw err;
				}
				else {
					var updateData = {
						GroupCode   : data.GroupCode,
						GroupName   : data.GroupName,
						Description : data.Description
					};
					return DoctorGroup.update(updateData,{
						where:{
							UID : data.UID
						},
						transaction : t
					});
				}
			},function(err) {
				throw err;
			})
			.then(function(updated) {
				if(updated == null || updated == '') {
					t.rollback();
					var err = new Error('UpdateGroup.error');
					err.pushError('update.queryError');
					throw err;
				}
				else {
					t.commit();
					return updated;
				}
			},function(err) {
				t.rollback();
				throw err;
			})
		},function(err) {
			throw err;
		});
	},

	ChangeStatusGroup: function(data) {
		if(!data.UID) {
			var err = new Error('ChangeStatusGroup.error');
			err.pushError('UID.notFound');
			throw err;
		}
		return sequelize.transaction()
		.then(function(t){
			return DoctorGroup.findOne({
				where:{
					UID : data.UID
				},
				transaction: t
			})
			.then(function(got_group) {
				if(_.isEmpty(got_group)) {
					var err = new Error('ChangeStatusGroup.error');
					err.pushError('Group.notFound');
					throw err;
				}
				else {
					return DoctorGroup.update({
						Enable : data.Enable,
					},{
						where:{
							UID : data.UID,
						},
						transaction: t
					});
				}
			},function(err) {
				throw err;
			})
			.then(function(changed) {
				if(changed == null || changed == '') {
					t.rollback();
					var err = new Error('ChangeStatusGroup.error');
					err.pushError('change.queryError');
					throw err;
				}
				else {
					t.commit();
					return changed;
				}
			},function(err) {
				t.rollback();
				throw err;
			});
		},function(err) {
			throw err;
		});
	},

	//chi co doctor role = 5 moi dc add vao 1 group con role = 4 thi k duoc add

}
