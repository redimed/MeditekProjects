module.exports = {
	/*
		func: CreatePatient
		input: Patient's information
		output: insert Patient's information into table Patient 
	*/
	CreatePatient : function(data) {
		return Patient.create(data);
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
	},

	GetPatient : function(patientID) {
		return Patient.find({
			where: {
				ID : patientID
			}
		});
	},

	DeletePatient : function(patientID) {
		return Patient.destroy({
			where : {
				ID : patientID
			}
		});
	}

};