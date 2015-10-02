//generator Password
var generatePassword = require('password-generator');

module.exports = {
	/*
		func: CreatePatient
		input: Patient's information
		output: insert Patient's information into table Patient 
	*/
	CreatePatient : function(req, res) {
		var data = req.body.data;
		var info = {
			FirstName  : data.FirstName,
			MiddleName : data.MiddleName,
			LastName   : data.LastName,
			Dob        : data.Dob,
			Gender     : data.Gender,
			Address    : data.Address,
			Enable     : "Y"
		};
		info.UID = UUIDService.Create();
		info.SiteID = 1;
		info.CountryID = 84;
		//check is patient have UserAccount by Phone Number
		Services.UserAccount.FindByPhoneNumber(data.PhoneNumber)
		.then(function(user){
			//if patient has user account, get UserAccountID to create patient
			if(user.length > 0) {
				info.UserAccountID = user[0].ID;
				Services.Patient.CreatePatient(info)
				.then(function(result){
					res.ok({status:200,message:"success"});
				})
				.catch(function(err){
					res.serverError({status:500,message:ErrorWrap(err)});
				});
			}
			//if patient doesn't have UserAccount, create UserAccount before create patient
			else {
				var pas = generatePassword(12, false);
				var userInfo = {
					UserName    : data.PhoneNumber,
					Email       : data.Email,
					PhoneNumber : data.PhoneNumber,
					Password    : pas
				};
				userInfo.UID = UUIDService.Create();
				//create UserAccount
				Services.UserAccount.CreateUserAccount(userInfo)
				.then(function(user){
					//call createPatient function from model UserAccount
					return user.createPatient(info);
				})
				.catch(function(err){
					res.serverError({status:500,message:ErrorWrap(err)});
				})
				//after call function createPatient, this code runs
				.then(function(result){
					res.ok({status:200,message:"success"});
				})
				.catch(function(err){
					res.serverError({status:500,message:ErrorWrap(err)});
				});
			}
		})
		.catch(function(err) {
			res.serverError({status:500,message:ErrorWrap(err)});
		});
	},

	/*
		func : SearchPatient
		input: Patient's name or PhoneNumber
		output: get patient's list which was found in client 
	*/
	SearchPatient : function(req, res) {
		var data = req.body.data;
		Services.Patient.SearchPatient(data)
		.then(function(info){
			if(info!==undefined && info!==null && info.length > 0)
				res.ok({status:200, message:"success", data:info});
			else
				res.notFound({status:404,message:"not Found"});
		})
		.catch(function(err){
			res.serverError({status:500,message:ErrorWrap(err)});
		});
	},


	/*
		func : UpdatePatient
		input: patient's information updated
		output: update patient'infomation into table Patient 
	*/
	UpdatePatient : function(req, res) {
		var data = req.body.data;
		//get data not required
		var patientInfo={
				ID           : data.ID,
				FirstName    : data.FirstName,
				MiddleName   : data.MiddleName,
				LastName     : data.LastName,
				Dob          : data.Dob,
				Gender       : data.Gender,
				Address      : data.Address,
				Enable       : data.Enable,
				CreationDate : data.CreationDate,
				CreatedBy    : data.CreatedBy,
				ModifiedDate : data.ModifiedDate,
				ModifiedBy   : data.ModifiedBy
		};

		//get data required ( if data has value, get it)
		if(data.SiteID)  patientInfo.SiteID=data.SiteID;
		if(data.UserAccountID)  patientInfo.UserAccountID = data.UserAccountID;
		if(data.CountryID)  patientInfo.CountryID = data.CountryID;
		if(data.UID)  patientInfo.UID = data.UID;

		Services.Patient.UpdatePatient(patientInfo)
		.then(function(result){
			if(result[0] > 0)
				res.ok({status:200,message:"success"});
			else
				res.notFound({status:404,message:"not Found"});
		})
		.catch(function(err){
			return res.serverError({status:500,message:ErrorWrap(err)});
		});
	},

	/*
		func : GetPatient
		input:  Patient's ID
		output: Patient's information of Patient's ID if patient has data.
	*/
	GetPatient : function(req, res) {
		var ID = req.body.data;
		Services.Patient.GetPatient(ID)
		.then(function(info){
			if(info!==null && info!==undefined){
				res.ok({status:200, message:"success", data:info});
			} else {
				res.notFound({status:404, message:"not Found"});
			}
		})
		.catch(function(err){
			res.serverError({status:500,message:ErrorWrap(err)});
		});
	},

	/*
		func : DeletePatient
		input: Patient's ID
		output: delete Patient's information into table Patient
	*/
	DeletePatient : function(req, res) {
		var ID = req.body.data;
		var patientInfo = {
			ID     : ID,
			Enable : "N"
		}
		Services.Patient.UpdatePatient(patientInfo)
		.then(function(result){
			if(result===0)
				res.notFound({status:404, message:"not Found"});
			else
				res.ok({status:200,message:"success"});
		})
		.catch(function(err){
			res.serverError({status:500, message:ErrorWrap(err)});
		});
	}

};


