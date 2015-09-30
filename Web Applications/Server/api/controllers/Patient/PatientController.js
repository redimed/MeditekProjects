module.exports = {
	/*
		func: CreatePatient
		input: Patient's information
		output: insert Patient's information into table Patient 
	*/
	CreatePatient : function(req, res) {
		console.log(req.body);
		var data = req.body.data;
		data.UID = UUIDService.Create();
		Patient.create({
			UID           : data.UID,
			SiteID        : data.SiteID,
			UserAccountID : data.UserAccountID,
			FirstName     : data.FirstName,
			MiddleName    : data.MiddleName,
			LastName      : data.LastName,
			//Dob           : data.Dob,
			Sex           : data.Sex,
			Address       : data.Address,
			CountryID     : data.CountryID
			//Enable        : data.Enable,
			//CreationDate  : data.CreationDate,
			//CreatedBy     : data.CreatedBy,
			//ModifiedDate  : data.ModifiedDate,
			//ModifiedBy    : data.ModifiedBy
		})
		.then(function(result){
			res.json("success");
		})
		.catch(function(err){
			console.log("***ERROR***: ",err);
			res.json({
				status:"error",
			});
			return;
		});
	},

	UpdatePatient : function(req, res) {
		var data = req.body.data;
		Patient.update({
			UID           : data.UID,
			SiteID        : data.SiteID,
			UserAccountID : data.UserAccountID,
			FirstName     : data.FirstName,
			MiddleName    : data.MiddleName,
			LastName      : data.LastName,
			//Dob           : data.Dob,
			Sex           : data.Sex,
			Address       : data.Address,
			CountryID     : data.CountryID
			//Enable        : data.Enable,
			//CreationDate  : data.CreationDate,
			//CreatedBy     : data.CreatedBy,
			//ModifiedDate  : data.ModifiedDate,
			//ModifiedBy    : data.ModifiedBy
		},{
			where:{

			}
		})
	},

	SearchPatient : function(req, res) {
		var data = req.body.data;
		Patient.findAll({
			where: {
				$or :[

					{
						FirstName:{
							$like: '%'+data.Name+'%'
						}
					},

					{
						LastName:{
							$like: '%'+data.Name+'%'
						}
					}
		  		]
		  	}
		})
		.then(function(result){
			console.log(result);
			var info = [];
			for(var i = 0; i < result.length; i++){
				info.push(result[i].dataValues);
			}
			console.log(info);
			res.json({
				status:"success",
				data:info
			});
			return;

		})
		.catch(function*(err){

			console.log("***ERROR***: ",err);
			res.json({
				status:"error",
			});
			return;
		});
	}

};