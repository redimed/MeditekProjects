module.exports = {
	/*
		func: CreatePatient
		input: Patient's information
		output: insert Patient's information into table Patient 
	*/
	CreatePatient : function(req, res) {
		// UserAccount.create({
		// 	UID:"UID.004",
		// 	UserName:"asdv",
		// 	Email:"gaas@gasa.com",
		// 	PhoneNumber:"0907738377",
		// 	Password:"asdasdasdasd"	
		// })
		// .then(function(user){
		// 	console.log(user);
		// 	user.createPatient(info)
		// 	.then(function(result){
		// 		console.log("yes");
		// 	})
		// 	.catch(function(err){
		// 		console.log("err");
		// 	});
		// })
		// .catch(function(err){
		// 	console.log("as");
		// 	console.log(err.message);
		// });

		var data = req.body.data;
		var info = {
			FirstName  : data.FirstName,
			MiddleName : data.MiddleName,
			LastName   : data.LastName,
			Dob        : data.Dob,
			Sex        : data.Sex,
			Address    : data.Address,
			Enable     : data.Enable
		};
		info.UID = UUIDService.Create();
		info.SiteID = 1;
		info.CountryID = 84;
		
		UserAccountService.FindByPhoneNumber(data.PhoneNumber)
		.then(function(user){
			if(user.length > 0) {
				data.UserAccountID = result.dataValues.ID;
				Patient.create(info)
				.then(function(result){
					res.ok({status:200,message:"success"});
				})
				.catch(function(err){
					res.serverError({status:500,message:err.message});
				});
			}
			else {
				var userInfo = {
					UserName: data.PhoneNumber,
					Email: data.Email,
					PhoneNumber:data.PhoneNumber,
					Password: data.Password
				};
				userInfo.UID = UUIDService.Create();
				UserAccountService.CreateUserAccount(userInfo)
				.then(function(user){
					user.createPatient(info)
					.then(function(result){
						res.ok({status:200,message:"success"});
					})
					.catch(function(err){
						res.serverError({status:500,message:err.message});
					});
				})
				.catch(function(err){
					res.serverError({status:500,message:err.message});
				});
			}
		})
		.catch(function(err) {
			res.serverError({status:500,message:err.message});
		});
	},

	SearchPatient : function(req, res) {
		var data = req.body.data;
		PatientService.SearchPatient(data)
		.then(function(result){
			console.log(result);
			if(result.length > 0) {
				var info = [];
				for(var i = 0; i < result.length; i++){
					info.push(result[i].dataValues);
				}
				//console.log(info);
				res.ok(info);
				return;
			}
			else {
				res.notFound({status:404,message:"notFound"});
			}

		})
		.catch(function(err){
			res.serverError({status:500,message:err.message});
		});
	},

	UpdatePatient : function(req, res) {
		var data = req.body.data;
		var patientInfo={
				FirstName    : data.FirstName,
				MiddleName   : data.MiddleName,
				LastName     : data.LastName,
				Dob          : data.Dob,
				Sex          : data.Sex,
				Address      : data.Address,
				Enable       : data.Enable,
				CreationDate : data.CreationDate,
				CreatedBy    : data.CreatedBy,
				ModifiedDate : data.ModifiedDate,
				ModifiedBy   : data.ModifiedBy
		};


		if(data.SiteID)  patientInfo.SiteID=data.SiteID;
		if(data.UserAccountID)  patientInfo.UserAccountID = data.UserAccountID;
		if(data.CountryID)  patientInfo.CountryID = data.CountryID;
		if(data.UID)  patientInfo.UID = data.UID;

		PatientService.UpdatePatient(patientInfo)
		.then(function(result){
			res.ok({status:200,message:"success"});
		})
		.catch(function(err){
			return res.serverError({status:500,message:err.message});
		});
	}

};


