module.exports = {
	/*
		func: CreatePatient
		input: Patient's information
		output: insert Patient's information into table Patient 
	*/
	CreatePatient : function(data) {
		console.log(data);
		//var data = req.body.data;
		//data.UID = UUIDService.Create();
		//sails.controllers.userAccount.FindByPhoneNumber(req, res);
		// Patient.create({
		// 	UID           : data.UID,
		// 	SiteID        : data.SiteID,
		// 	UserAccountID : data.UserAccountID,
		// 	FirstName     : data.FirstName,
		// 	MiddleName    : data.MiddleName,
		// 	LastName      : data.LastName,
		// 	Dob           : data.Dob,
		// 	Sex           : data.Sex,
		// 	Address       : data.Address,
		// 	CountryID     : data.CountryID
		// 	Enable        : data.Enable,
		// 	CreationDate  : data.CreationDate,
		// 	CreatedBy     : data.CreatedBy,
		// 	ModifiedDate  : data.ModifiedDate,
		// 	ModifiedBy    : data.ModifiedBy
		// })
		// .then(function(result){
		// 	res.json("success");
		// })
		// .catch(function(err){
		// 	console.log("***ERROR***: ",err);
		// 	res.json({
		// 		status:"error",
		// 	});
		// 	return;
		// });
	},

	SearchPatient : function(data) {
		return Patient.findAll({
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
					},
					{
						ID : data.ID
					}
		  		]

		  	}
		});
	},

	UpdatePatient : function(data) {
		return Patient.update(data,{
			where:{
				ID : data.ID
			}
		});
	}

};