//generator Password
var generatePassword = require('password-generator');

module.exports = {
	/*
		CreatePatient : create a new patient
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
		//hien tai thi CountryID chua co nen tu set 1 CountryID trong bang? Country de test.
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
				data.password = generatePassword(12, false);
				var userInfo = {
					UserName    : data.PhoneNumber,
					Email       : data.Email,
					PhoneNumber : data.PhoneNumber,
					Password    : data.password
				};
				userInfo.UID = UUIDService.Create();
				//create UserAccount
				Services.UserAccount.CreateUserAccount(userInfo)
				.then(function(user){
					info.UserAccountID = user.ID;
					//call createPatient function from model UserAccount
					return Services.Patient.CreatePatient(info);
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
		SearchPatient : find patient with condition
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
		UpdatePatient : update patient's information
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
				CreatedDate  : data.CreatedDate,
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
		GetPatient get a patient with condition
		input:  Patient's ID
		output: Patient's information of Patient's ID if patient has data.
	*/
	GetPatient : function(req, res) {
		var ID = req.body.data;
		Services.Patient.GetPatient(25)
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
		DeletePatient : disable patient who was deleted.
		input: Patient's ID
		output: attribute Enable of Patient will receive value "N" in table Patient 
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
	},

	/*
		LoadListPatient: load list patient
		input: amount patient
		output: get list patient from table Patient
	*/
	LoadListPatient : function(req, res) {
		var data = req.body.data;
		var limit = data.limit;
		var offset = data.offset;
		Services.Patient.LoadListPatient(limit, offset)
		.then(function(result){
			if(result!==undefined && result!==null && result!=='')
				res.ok({status:200,message:"success",data:result});
			else
				res.notFound({status:404,message:"not found"});
		})
		.catch(function(err){
			res.serverError({status:500,message:ErrorWrap(err)});
		});
	}

};


