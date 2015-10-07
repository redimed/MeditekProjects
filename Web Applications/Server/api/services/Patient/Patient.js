var $q = require('q');

//moment
var moment = require('moment');

//generator Password
var generatePassword = require('password-generator');

module.exports = {
	/*
		validation : validate input from client post into server
		input: patient's information
		output: validate patient's information
	*/
	validation : function(data) {
		var q = $q.defer();
		var errors = [];
		//create a error with contain a list errors input
		var err = new Error("ERRORS");
		try {
			//validate FirstName
			if(data.FirstName){
				if(data.FirstName.length < 0 || data.FirstName.length > 50){
					errors.push({field:"FirstName",message:"Patient.FirstName.length"});
					err.pushErrors(errors);
				}
			}

			//validate MiddleName
			if(data.MiddleName){
				if(data.MiddleName.length < 0 || data.MiddleName.length > 100){
					errors.push({field:"MiddleName",message:"Patient.MiddleName.length"});
					err.pushErrors(errors);
				}
			}

			//validate LastName
			if(data.LastName){
				if(data.LastName.length < 0 || data.LastName.length > 50){
					errors.push({field:"LastName",message:"Patient.LastName.length"});
					err.pushErrors(errors);
				}
			}

			//validate Gender
			if(data.Gender){
				if(data.Gender != "F" && data.Gender != "M"){
					errors.push({field:"Gender",message:"Patient.Gender.valueField"});
					err.pushErrors(errors);
				}
			}

			//validate Address
			if(data.Address){
				if(data.Address.length < 0 || data.Address.length > 255){
					errors.push({field:"Address",message:"Patient.Address.length"});
					err.pushErrors(errors);
				}
			}

			//validate Suburb
			if(data.Suburb){
				if(data.Suburb.length < 0 || data.Suburb.length > 100){
					errors.push({field:"Suburb",message:"Patient.Suburb.length"});
					err.pushErrors(errors);
				}
			}

			//validate Postcode
			if(data.Postcode){
				if(data.Postcode.length < 0 || data.Postcode.length > 100){
					errors.push({field:"Postcode",message:"Patient.Postcode.length"});
					err.pushErrors(errors);
				}
			}

			//validate Email? hoi a Tan su dung exception
			if(data.Email){
				if(data.Email.length < 0 || data.Email.length > 100){
					errors.push({field:"Email",message:"Patient.Email.length"});
					err.pushErrors(errors);
				}
			}
			

			//validate HomePhoneNumber? hoi a Tan su dung exception
			if(data.HomePhoneNumber){
				if(data.HomePhoneNumber.length < 0 || data.HomePhoneNumber.length > 20){
					errors.push({field:"HomePhoneNumber",message:"Patient.HomePhoneNumber.length"});
					err.pushErrors(errors);
					throw err;
				}
			}
			
			else{
				//if data input has value throw err with contain a list error into controller 
				if(err.errors!=undefined && err.errors!=null)
					throw err;
				else
					q.resolve({status:'success'});
			}
			//q.resolve({status:'success'});

		}
		catch(err){
			q.reject(err);
		}
		return q.promise;
	},


	/*
		CreatePatient : service create patient
		input: Patient's information
		output: insert Patient's information into table Patient 
	*/
	CreatePatient : function(data) {
		var info = {
			FirstName       : data.FirstName,
			MiddleName      : data.MiddleName,
			LastName        : data.LastName,
			DOB             : data.DOB?moment(data.DOB,'YYYY-MM-DD HH:mm:ss ZZ').toDate():null,
			Gender          : data.Gender,
			CountryID       : data.CountryID,
			Suburb          : data.Suburb,
			Postcode        : data.Postcode,
			Email           : data.Email,
			HomePhoneNumber : data.HomePhoneNumber,
			UID             : UUIDService.Create(),
			SiteID          : 1,
			Address         : data.Address,
			Enable          : "Y",
			CreatedDate     : new Date()
		};
		return Services.Patient.validation(data)
		.then(function(success){
			return Services.UserAccount.FindByPhoneNumber(data.PhoneNumber);
			//return Patient.create(data);
		},function(err){
			throw err;
		})
		.then(function(user){
			if(user.length > 0) {
				info.UserAccountID = user[0].ID;
				return Patient.create(info);
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
				return Services.UserAccount.CreateUserAccount(userInfo)
				.then(function(user){
					info.UserAccountID = user.ID;
					return Patient.create(info);
				},function(err){
					throw err;
				});
			}
		},function(err){
			throw err;
		});
	},


	/*
		SearchPatient : services find patient with condition
		input:patient's information
		output:find patient which was provided information.
	*/
	SearchPatient : function(data) {
		//if data is Phone Number
		if(data.PhoneNumber!=undefined && data.PhoneNumber!=null){
			return Services.UserAccount.FindByPhoneNumber(data.PhoneNumber)
			.then(function(user){
				//check if Phone Number is found in table UserAccount, get UserAccountID to find patient
				if(user!=undefined && user!=null){
					console.log(user[0]);
					return Patient.findAll({
						where: {
							UserAccountID : user[0].ID
						}
					});
				}
				else{
					res.notFound({status:404,message:"not Found"});
				}
			},function(err){
				res.serverError({status:500,message:ErrorWrap(err)});
			});
		}
		else {
			//if data is patient's information
			return Patient.findAll({
				where: {
					$or :[
							// gom 3 cot FirstName MiddleName LastName lai de search FullName
							//dung concat sequelize
							Sequelize.where(Sequelize.fn("concat", Sequelize.col("FirstName"), ' ', Sequelize.col("MiddleName"), ' ', Sequelize.col("LastName")), {
						        like: '%'+data.Name+'%'
						    }),

						{
							UID : data.UID
						}
			  		]
			  	}
			});
		}
	},


	/*
		UpdatePatient : service update a patient
		input:patient's information
		output:update patient into table Patient
	*/
	UpdatePatient : function(data) {
		data.ModifiedDate = new Date();
		return Services.Patient.validation(data)
		.then(function(success){
			return Patient.update(data,{
				where:{
					UID : data.UID
				}
			});
		}, function(err){
			throw err;
		});
	},


	/*
		GetPatient : service get a patient with condition
		input:useraccount's UID
		output: get patient's information.
	*/
	GetPatient : function(data) {
		return Services.UserAccount.GetUserAccountDetails(data)
		.then(function(user){
			console.log(user.ID);
			//check if UserAccount is found in table UserAccount, get UserAccountID to find patient
			if(user!=undefined && user!=null && user!='' && user.length!=0){
				return Patient.findAll({
					where: {
						UserAccountID : user.ID
					}
				});
			}
			else{
				return null;
			}
		},function(err){
			res.serverError({status:500,message:ErrorWrap(err)});
		});
	},
	
	
	/*
		LoadListPatient : service get list patient
		input: amount patient
		output: get list patient from table Patient
	*/
	LoadListPatient : function(limit,offset){
		return Patient.findAll({
			limit: limit
		})
	}


	// DeletePatient : function(patientID) {
	// 	return Patient.destroy({
	// 		where : {
	// 			ID : patientID
	// 		}
	// 	});
	// }

};