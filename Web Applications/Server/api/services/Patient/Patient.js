var $q = require('q');

//moment
var moment = require('moment');
var check  = require('../HelperService');

//default attributes
var defaultAtrributes = [
	'ID',
	'UID',
	'UserAccountID',
	'Title',
	'FirstName',
	'MiddleName',
	'LastName',
	'DOB',
	'Gender',
	'Occupation',
	'Address1',
	'Address2',
	'Suburb',
	'Postcode',
	'State',
	'CountryID1',
	'CountryID1',
	'Email1',
	'Email2',
	'HomePhoneNumber',
	'WorkPhoneNumber',
	'Enable',
	'MaritalStatus',
	'PreferredName',
	'PreviousName',
	'Indigenous',
	'FaxNumber',
	'InterpreterRequired',
	'InterperterLanguage',
	'OtherSpecialNeed'
];

//generator Password
var generatePassword = require('password-generator');

module.exports = {
	/*
		validation : validate input from client post into server
		input: patient's information
		output: validate patient's information
	*/
	validation : function(data,type) {
		var character = new RegExp(check.regexPattern.character);
		var address   = new RegExp(check.regexPattern.address);
		var postcode  = new RegExp(check.regexPattern.postcode);
		var isCreate = type==true?true:false;
		var q = $q.defer();
		var errors = [];
		//create a error with contain a list errors input
		var err = new Error("ERRORS");
		if(type==true){
			try {
				// validate FirstName
				if(data.FirstName!=undefined && data.FirstName){
					if(data.FirstName.length < 0 || data.FirstName.length > 50){
						errors.push({field:"FirstName",message:"max length"});
						err.pushErrors(errors);
					}
					if(!character.test(data.FirstName)){
						errors.push({field:"FirstName",message:"invalid value"});
						err.pushErrors(errors);
					}
				}
				else{
					errors.push({field:"FirstName",message:"required"});
					err.pushErrors(errors);
				}

				//validate MiddleName
				if(data.MiddleName!=undefined && data.MiddleName){
					if(data.MiddleName.length < 0 || data.MiddleName.length > 100){
						errors.push({field:"MiddleName",message:"max length"});
						err.pushErrors(errors);
					}
					if(!character.test(data.MiddleName)){
						errors.push({field:"MiddleName",message:"invalid value"});
						err.pushErrors(errors);
					}
				}

				//validate LastName
				if(data.LastName!=undefined && data.LastName){
					if(data.LastName.length < 0 || data.LastName.length > 50){
						errors.push({field:"LastName",message:"max length"});
						err.pushErrors(errors);
					}
					if(!character.test(data.LastName)){
						errors.push({field:"LastName",message:"invalid value"});
						err.pushErrors(errors);
					}
				}
				else{
					errors.push({field:"LastName",message:"required"});
					err.pushErrors(errors);
				}

				//validate Gender
				if(data.Gender!=undefined && data.Gender){
					if(data.Gender != "Female" && data.Gender != "Male" && data.Gender != "Other"){
						errors.push({field:"Gender",message:"invalid value"});
						err.pushErrors(errors);
					}
				}
				else{
					errors.push({field:"Gender",message:"required"});
					err.pushErrors(errors);
				}

				//validate Address1
				if(data.Address1!=undefined && data.Address1){
					if(data.Address1.length < 0 || data.Address1.length > 255){
						errors.push({field:"Address1",message:"max length"});
						err.pushErrors(errors);
					}
					if(!address.test(data.Address1)){
						errors.push({field:"Address1",message:"invalid value"});
						err.pushErrors(errors);
					}
				}
				else{
					errors.push({field:"Address1",message:"required"});
					err.pushErrors(errors);
				}

				//validate Address2
				if(data.Address2!=undefined && data.Address2){
					if(data.Address2.length < 0 || data.Address2.length > 255){
						errors.push({field:"Address2",message:"max length"});
						err.pushErrors(errors);
					}
					if(!address.test(data.Address2)){
						errors.push({field:"Address2",message:"invalid value"});
						err.pushErrors(errors);
					}
				}

				//validate DOB
				if(data.DOB!=undefined && data.DOB){
					if(data.DOB!=null || data.DOB!=""){
						if(!/^(\d{1,2})[/](\d{1,2})[/](\d{4})/.test(data.DOB)){
							errors.push({field:"DOB",message:"invalid value"});
							err.pushErrors(errors);
						}
					}
				}
				else{
					errors.push({field:"DOB",message:"required"});
					err.pushErrors(errors);
				}

				//validate Occupation
				if(data.Occupation!=undefined && data.Occupation){
					if(data.Occupation.length < 0 || data.Occupation.length > 255){
						errors.push({field:"Occupation",message:"max length"});
						err.pushErrors(errors);
					}
					if(!character.test(data.Occupation)){
						errors.push({field:"Occupation",message:"invalid value"});
						err.pushErrors(errors);
					}
				}

				//validate Suburb
				if(data.Suburb!=undefined && data.Suburb){
					if(data.Suburb.length < 0 || data.Suburb.length > 100){
						errors.push({field:"Suburb",message:"max length"});
						err.pushErrors(errors);
					}
				}

				//validate Postcode
				if(data.Postcode!=undefined && data.Postcode){
					if(data.Postcode.length < 0 || data.Postcode.length > 100){
						errors.push({field:"Postcode",message:"max length"});
						err.pushErrors(errors);
					}
					if(!postcode.test(data.Postcode)){
						errors.push({field:"Postcode",message:"invalid value"});
						err.pushErrors(errors);
					}
				}
				else{
					errors.push({field:"Postcode",message:"required"});
					err.pushErrors(errors);
				}

				//validate Email1
				if(data.Email1!=undefined && data.Email1){
					var EmailPattern1=new RegExp(check.regexPattern.email);
					if(!EmailPattern1.test(data.Email1)){
						errors.push({field:"Email1",message:"invalid value"});
						err.pushErrors(errors);
						throw err;
					}
				}

				//validate Email2
				// if(data.Email2){
				// 	var EmailPattern2=new RegExp(check.regexPattern.email);
				// 	if(!EmailPattern2.test(data.Email2)){
				// 		errors.push({field:"Email2",message:"invalid value"});
				// 		err.pushErrors(errors);
				// 		throw err;
				// 	}
				// }

				//validte State
				if(data.State!=undefined && data.State){
					if(data.State.length < 0 || data.State.length > 255){
						errors.push({field:"State",message:"max length"});
						err.pushErrors(errors);
					}
					if(!character.test(data.State)){
						errors.push({field:"State",message:"invalid value"});
						err.pushErrors(errors);
					}
				}
				else{
					errors.push({field:"State",message:"required"});
					err.pushErrors(errors);
				}

				if(data.Title!=undefined && data.Title){
					if(data.Title!= 'Dr' && data.Title!= 'Ms' && 
						data.Title!= 'Mr' && data.Title!= 'Mrs'){
						errors.push({field:"Title",message:"invalid value"});
						err.pushErrors(errors);
					}
				}
				else{
					errors.push({field:"Title",message:"required"});
					err.pushErrors(errors);
				}

				//validate HomePhoneNumber? hoi a Tan su dung exception
				if(data.HomePhoneNumber!=undefined && data.HomePhoneNumber){
					var auHomePhoneNumberPattern=new RegExp(check.regexPattern.auHomePhoneNumber);
					var HomePhone=data.HomePhoneNumber.replace(check.regexPattern.phoneExceptChars,'');
					if(!auHomePhoneNumberPattern.test(HomePhone)){
						errors.push({field:"HomePhoneNumber",message:"invalid value"});
						err.pushErrors(errors);
						throw err;
					}
				}

				//validate HomePhoneNumber? hoi a Tan su dung exception
				if(data.WorkPhoneNumber!=undefined && data.WorkPhoneNumber){
					var auWorkPhoneNumberPattern=new RegExp(check.regexPattern.auHomePhoneNumber);
					var WorkPhoneNumber=data.WorkPhoneNumber.replace(check.regexPattern.phoneExceptChars,'');
					if(!auWorkPhoneNumberPattern.test(WorkPhoneNumber)){
						errors.push({field:"WorkPhoneNumber",message:"invalid value"});
						err.pushErrors(errors);
						throw err;
					}
				}

				if(err.getErrors().length>0){
					throw err;
				}

				else{
					q.resolve({status:'success'});
				}
				//q.resolve({status:'success'});

			}
			catch(err){
				q.reject(err);
			}
		}
		else{
			try {
				// validate FirstName
				if('FirstName' in data){
					if(data.FirstName){
						if(data.FirstName.length < 0 || data.FirstName.length > 50){
							errors.push({field:"FirstName",message:"max length"});
							err.pushErrors(errors);
						}
						if(!character.test(data.FirstName)){
							errors.push({field:"FirstName",message:"invalid value"});
							err.pushErrors(errors);
						}
					}
				}

				//validate MiddleName
				if('MiddleName' in data){
					if(data.MiddleName){
						if(data.MiddleName.length < 0 || data.MiddleName.length > 100){
							errors.push({field:"MiddleName",message:"max length"});
							err.pushErrors(errors);
						}
						if(!character.test(data.MiddleName)){
							errors.push({field:"MiddleName",message:"invalid value"});
							err.pushErrors(errors);
						}
					}
				}

				//validate LastName
				if('LastName' in data){
					if(data.LastName){
						if(data.LastName.length < 0 || data.LastName.length > 50){
							errors.push({field:"LastName",message:"max length"});
							err.pushErrors(errors);
						}
						if(!character.test(data.LastName)){
							errors.push({field:"LastName",message:"invalid value"});
							err.pushErrors(errors);
						}
					}
				}

				//validate Gender
				if('Gender' in data){
					if(data.Gender){
						if(data.Gender != "Female" && data.Gender != "Male" && data.Gender != "Other"){
							errors.push({field:"Gender",message:"invalid value"});
							err.pushErrors(errors);
						}
					}
				}

				//validate Address1
				if('Address1' in data){
					if(data.Address1){
						if(data.Address1.length < 0 || data.Address1.length > 255){
							errors.push({field:"Address1",message:"max length"});
							err.pushErrors(errors);
						}
						if(!address.test(data.Address1)){
							errors.push({field:"Address1",message:"invalid value"});
							err.pushErrors(errors);
						}
					}
				}

				//validate Address2
				if('Address2' in data){
					if(data.Address2){
						if(data.Address2.length < 0 || data.Address2.length > 255){
							errors.push({field:"Address2",message:"max length"});
							err.pushErrors(errors);
						}
						if(!address.test(data.Address2)){
							errors.push({field:"Address2",message:"invalid value"});
							err.pushErrors(errors);
						}
					}
				}

				//validate DOB
				if('DOB' in data){
					if(data.DOB){
						if(data.DOB!=null || data.DOB!=""){
							if(!/^(\d{1,2})[/](\d{1,2})[/](\d{4})/.test(data.DOB)){
								errors.push({field:"DOB",message:"invalid value"});
								err.pushErrors(errors);
							}
						}
					}
				}

				//validate Occupation
				if('Occupation' in data){
					if(data.Occupation){
						if(data.Occupation.length < 0 || data.Occupation.length > 255){
							errors.push({field:"Occupation",message:"max length"});
							err.pushErrors(errors);
						}
						if(!character.test(data.Occupation)){
							errors.push({field:"Occupation",message:"invalid value"});
							err.pushErrors(errors);
						}
					}
				}

				//validate Suburb
				if('Suburb' in data){
					if(data.Suburb){
						if(data.Suburb.length < 0 || data.Suburb.length > 100){
							errors.push({field:"Suburb",message:"max length"});
							err.pushErrors(errors);
						}
					}
				}

				//validate Postcode
				if('Postcode' in data){
					if(data.Postcode){
						if(data.Postcode.length < 0 || data.Postcode.length > 100){
							errors.push({field:"Postcode",message:"max length"});
							err.pushErrors(errors);
						}
						if(!postcode.test(data.Postcode)){
							errors.push({field:"Postcode",message:"invalid value"});
							err.pushErrors(errors);
						}
					}
				}

				//validate Email1
				if('Email1' in data){
					if(data.Email1){
						var EmailPattern1=new RegExp(check.regexPattern.email);
						if(!EmailPattern1.test(data.Email1)){
							errors.push({field:"Email1",message:"invalid value"});
							err.pushErrors(errors);
							throw err;
						}
					}
				}

				//validate Email2
				// if(data.Email2){
				// 	var EmailPattern2=new RegExp(check.regexPattern.email);
				// 	if(!EmailPattern2.test(data.Email2)){
				// 		errors.push({field:"Email2",message:"invalid value"});
				// 		err.pushErrors(errors);
				// 		throw err;
				// 	}
				// }

				//validte State
				if('State' in data){
					if(data.State){
						if(data.State.length < 0 || data.State.length > 255){
							errors.push({field:"State",message:"max length"});
							err.pushErrors(errors);
						}
						if(!character.test(data.State)){
							errors.push({field:"State",message:"invalid value"});
							err.pushErrors(errors);
						}
					}
				}

				if('Title' in data){
					if(data.Title){
						if(data.Title!= 'Dr' && data.Title!= 'Ms' && 
							data.Title!= 'Mr' && data.Title!= 'Mrs'){
							errors.push({field:"Title",message:"invalid value"});
							err.pushErrors(errors);
						}
					}
				}

				//validate HomePhoneNumber? hoi a Tan su dung exception
				if('HomePhoneNumber' in data){
					if(data.HomePhoneNumber){
						var auHomePhoneNumberPattern=new RegExp(check.regexPattern.auHomePhoneNumber);
						var HomePhone=data.HomePhoneNumber.replace(check.regexPattern.phoneExceptChars,'');
						if(!auHomePhoneNumberPattern.test(HomePhone)){
							errors.push({field:"HomePhoneNumber",message:"invalid value"});
							err.pushErrors(errors);
							throw err;
						}
					}
				}

				//validate HomePhoneNumber? hoi a Tan su dung exception
				if('WorkPhoneNumber' in data){
					if(data.WorkPhoneNumber){
						var auWorkPhoneNumberPattern=new RegExp(check.regexPattern.auHomePhoneNumber);
						var WorkPhoneNumber=data.WorkPhoneNumber.replace(check.regexPattern.phoneExceptChars,'');
						if(!auWorkPhoneNumberPattern.test(WorkPhoneNumber)){
							errors.push({field:"WorkPhoneNumber",message:"invalid value"});
							err.pushErrors(errors);
							throw err;
						}
					}
				}

				if(err.getErrors().length>0){
					throw err;
				}

				else{
					q.resolve({status:'success'});
				}
				//q.resolve({status:'success'});

			}
			catch(err){
				q.reject(err);
			}
		}
		return q.promise;
	},

	whereClause : function(data) {
		var whereClause = {};
		whereClause.Patient = {};
		whereClause.UserAccount ={};
		if(check.checkData(data.Search)){
			if(data.Search.FirstName){
				whereClause.Patient.FirstName={
					like:'%'+data.Search.FirstName+'%'
				} 
			}
			if(data.Search.MiddleName){
				whereClause.Patient.MiddleName = {
					like:'%'+data.Search.MiddleName+'%'
				}
			}
			if(data.Search.LastName){
				whereClause.Patient.LastName = {
					like:'%'+data.Search.LastName+'%'
				}
			}
			if(data.Search.Gender){
				whereClause.Patient.Gender = {
					like:'%'+data.Search.Gender+'%'
				}
			}
			if(data.Search.Email1){
				whereClause.Patient.Email1 = {
					like:'%'+data.Search.Email1+'%'
				}
			}
			if(data.Search.Email2){
				whereClause.Patient.Email2 = {
					like:'%'+data.Search.Email2+'%'
				}
			}
			if(data.Search.Enable){
				whereClause.UserAccount.Enable = {
					like:'%'+data.Search.Enable+'%'
				}
			}
			if(data.Search.PhoneNumber){
				whereClause.UserAccount.PhoneNumber = {
					like:'%'+data.Search.PhoneNumber+'%'
				}
			}
		}
		return whereClause;
	},

	/*
		CreatePatient : service create patient
		input: Patient's information
		output: insert Patient's information into table Patient 
	*/
	CreatePatient : function(data, transaction) {
		var isCreateByName = false;
		var isCreateByEmail = false;
		var info = {
			Title           : data.Title,
			FirstName       : data.FirstName,
			MiddleName      : data.MiddleName,
			LastName        : data.LastName,
			DOB             : data.DOB?data.DOB:null,
			Gender          : data.Gender,
			Occupation      : data.Occupation,
			HomePhoneNumber : data.HomePhoneNumber,
			WorkPhoneNumber : data.WorkPhoneNumber,
			CountryID1      : data.CountryID1,
			Suburb          : data.Suburb,
			Postcode        : data.Postcode,
			Email1          : data.Email1,
			UID             : UUIDService.Create(),
			Address1        : data.Address1,
			Address2        : data.Address2,
			State           : data.State,
			Enable          : "Y"
		};
		return Services.Patient.validation(data,true)
		.then(function(success){
			if(data.PhoneNumber){
				return Services.UserAccount.FindByPhoneNumber(data.PhoneNumber,transaction);
			}
			else{
				if(data.Email){
					var userInfo = {
						UserName : data.Email,
						Password : generatePassword(12, false)
					};
					isCreateByEmail = true;
					return Services.UserAccount.CreateUserAccount(userInfo,transaction);
				}
				else{
					var userInfo = {
						UserName : info.FirstName+"."+info.LastName+"."+generatePassword(4, false),
						Password : generatePassword(12, false)
					};
					isCreateByName = true;
					return Services.UserAccount.CreateUserAccount(userInfo,transaction);
				}
			}
			//return Patient.create(data);
		},function(err){
			throw err;
		})
		.then(function(user){
			if(isCreateByName==false && isCreateByEmail==false){
				if(user.length > 0) {
					info.UserAccountID = user[0].ID;
					info.UserAccountUID = user[0].UID;
					return Patient.create(info,transaction);
				}
				else{
					data.password = generatePassword(12, false);
					var userInfo = {
						UserName    : data.PhoneNumber,
						Email       : data.Email,
						PhoneNumber : data.PhoneNumber,
						Password    : data.password
					};
					userInfo.UID = UUIDService.Create();
					//create UserAccount
					return Services.UserAccount.CreateUserAccount(userInfo,transaction)
					.then(function(user){
						info.UserAccountID = user.ID;
						info.UserAccountUID = user.UID;
						return Patient.create(info,transaction);
					},function(err){
						throw err;
					});
				}
			}
			else{
				info.UserAccountID = user.ID;
				info.UserAccountUID = user.UID;
				return Patient.create(info,transaction);
			}
		},function(err){
			throw err;
		})
		.then(function(result){
			return RelUserRole.create({
				UserAccountId : info.UserAccountID,
				RoleId        : 3,
				SiteId        : 1,
				CreatedDate   : new Date()
			})
			.then(function(s){
				return {
					result:result,
					UserAccountUID:info.UserAccountUID
				};
			},function(err){
				throw err;
			});
		}, function(err){
			throw err;
		})
	},

	/*
		UpdatePatient : service update a patient
		input:patient's information
		output:update patient into table Patient
	*/
	UpdatePatient : function(data, transaction) {
		var isHaveRole = false;
		if(check.checkData(data)){
			data.ModifiedDate = new Date();
			// data.DOB =moment(data.DOB,'YYYY-MM-DD HH:mm:ss ZZ').format('DD/MM/YYYY');
			data.DOB = data.DOB?data.DOB:null;
			//get data not required
			var patientInfo={
				ID              : data.ID,
				Title           : data.Title,
				FirstName       : data.FirstName,
				MiddleName      : data.MiddleName,
				LastName        : data.LastName,
				DOB             : data.DOB,
				Gender          : data.Gender,
				Address1        : data.Address1,
				Address2        : data.Address2,
				Enable          : data.Enable,
				Suburb          : data.Suburb,
				Postcode        : data.Postcode,
				State           : data.State,
				Email1          : data.Email1,
				Occupation      : data.Occupation,
				HomePhoneNumber : data.HomePhoneNumber,
				WorkPhoneNumber : data.WorkPhoneNumber
			};

			//get data required ( if data has values, get it)
			if(data.UserAccountID)  patientInfo.UserAccountID = data.UserAccountID;
			if(data.CountryID1)  patientInfo.CountryID1 = data.CountryID1;
			if(data.UID)  patientInfo.UID = data.UID;
			return sequelize.transaction()
				.then(function(t){
				return Services.Patient.validation(data)
				.then(function(success){
					return Patient.update(patientInfo,{
						where:{
							UID : patientInfo.UID
						},
						transaction:t
					});
				}, function(err){
					throw err;
				})
				.then(function(result){
					if(data.RoleId!=undefined && data.RoleId!=null 
					&& data.RoleId!="" && (data.RoleId==3)){
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
		}
	},


	/*
		GetPatient : service get a patient with condition
		input:useraccount's UID
		output: get patient's information.
	*/
	GetPatient : function(data, transaction) {
		var attributes=[];
		if(data.attributes){
			if(data.attributes.length > 0){
				for(var i = 0; i < data.attributes.length; i++){
					attributes[i] = data.attributes[i].field;
				};
			}
			else {
				attributes = defaultAtrributes;
			}
		}
		else{
			attributes = defaultAtrributes;
		}
		return Services.UserAccount.GetUserAccountDetails(data)
		.then(function(user){
			//check if UserAccount is found in table UserAccount, get UserAccountID to find patient
			if(check.checkData(user)){
				return Patient.findAll({
					where: {
						UserAccountID : user.ID
					},
					transaction:transaction,
					attributes:attributes,
					include: [
						 {
			            	model: UserAccount,
			            	attributes: ['PhoneNumber'],
			            	required: true
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
	
	/*
		DetailPatient: service get patient detail by patient's UID
		input: Patient's UID
		output: get patient's detail
	*/
	DetailPatient : function(data, transaction) {
		return Patient.findAll({
			where:{
				UID : data.UID
			},
			transaction:transaction,
			include:[
				{
	            	model: UserAccount,
	            	attributes: ['PhoneNumber','Email','ID','UID'],
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
			    	model: Country,
	            	attributes: ['ShortName'],
			    	required: false
			    }
			]
		})
		.then(function(result){
			return result;
		},function(err){
			throw err;
		});
	},

	/*
		LoadListPatient : service get list patient
		input: amount patient
		output: get list patient from table Patient
	*/
	LoadListPatient : function(data, transaction){
		var FirstName = '',LastName = '';
		var isConcat = false;
		var attributes=[];
		if(data.attributes!=undefined && data.attributes!=null
			 && data.attributes!='' && data.attributes.length!=0){
			for(var i = 0; i < data.attributes.length; i++){
				if(data.attributes[i].field!='UserAccount'){
					attributes.push(data.attributes[i].field);
				}
			};
			attributes.push("UID");
		}
		else{
			attributes = defaultAtrributes;
		}
		var whereClause = Services.Patient.whereClause(data);
		if(data.Search){
			if(data.Search.FirstName!='' && data.Search.LastName!=''
				&& data.Search.FirstName!=undefined && data.Search.LastName!=undefined){
				FirstName = data.Search.FirstName;
				LastName  = data.Search.LastName;
				isConcat = true;
			}
		}
		return Patient.findAndCountAll({
			include:[
				{
		           	model: UserAccount,
		          	attributes: ['PhoneNumber','Enable'],
				   	required: true,
				   	where:{
				   		$or: whereClause.UserAccount
				   	}
			    }
			],
			attributes : attributes,
			limit      : data.limit,
			offset     : data.offset,
			order      : data.order,
			where: {
				$or: [
					whereClause.Patient,
					isConcat?Sequelize.where(Sequelize.fn("concat", Sequelize.col("FirstName"),' ', Sequelize.col("LastName")), {
				       	like: '%'+FirstName+' '+LastName+'%'
					}):null,
				]
				
			},
			transaction:transaction
		})
		.then(function(result){
			return result;
		},function(err){
			throw err;
		});
	},

	CheckPatient : function(data, transaction) {
		var info = {};
		return Services.Patient.validation(data,false)
		.then(function(success){
			if(check.checkData(data.PhoneNumber)){
				// data.PhoneNumber = data.PhoneNumber.substr(0,3)=="+61"?data.PhoneNumber:"+61"+data.PhoneNumber;
				return Services.UserAccount.FindByPhoneNumber(data.PhoneNumber,transaction)
				.then(function(user){
					if(check.checkData(user)){
						info.Email = user[0].Email;
						info.PhoneNumber = user[0].PhoneNumber;
						return Patient.findAll({
								where :{
									UserAccountID : user[0].ID
								},
								transaction:transaction
							});
		
					}
					else
						return ({
							isCreated:false
						});
				},function(err){
					throw err;
				})
				.then(function(result){
					if(check.checkData(result) && result.isCreated!==false){
						return ({
							isCreated:true
						});
					}
					else
						return ({
							isCreated:false,
							data: {
								Email : info.Email,
								PhoneNumber: info.PhoneNumber
							}
						});
				},function(err){
					throw err;
				});
			}
			else{
				var error = new Error("CheckPatient.error");
				error.pushErrors("invalid.PhoneNumber");
				throw error;
			}
		},function(err){
			throw err;
		})
	},

	getfileUID: function(data){
		if(check.checkData(data.UserAccountID)){
			return FileUpload.findAll({
				attributes:['UserAccountID','UID'],
				where :{
					UserAccountID : data.UserAccountID,
					FileType: data.FileType,
					Enable : 'Y'
				}
			});
		}
	}


	// DeletePatient : function(patientID) {
	// 	return Patient.destroy({
	// 		where : {
	// 			ID : patientID
	// 		}
	// 	});
	// }

};