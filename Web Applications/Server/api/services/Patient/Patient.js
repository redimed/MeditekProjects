var $q = require('q');
module.exports = {
	/*
		func: validation
		input: patient's information
		output: validate patient's information
	*/
	validation : function(data) {
		var q = $q.defer();
		var errors = [];
		var err = new Error("ERRORS VALIDATE");
		try {

			//validate FirstName
			if(data.FirstName.length < 0 || data.FirstName.length > 50){
				errors.push({field:"FirstName",message:"Patient.FirstName.length"});
				console.log(err);
				err.pushErrors(errors);
			}

			//validate MiddleName
			if(data.MiddleName.length < 0 || data.MiddleName.length > 100){
				errors.push({field:"MiddleName",message:"Patient.MiddleName.length"});
				console.log(err);
				err.pushErrors(errors);
			}

			//validate LastName
			if(data.LastName.length < 0 || data.LastName.length > 50){
				errors.push({field:"LastName",message:"Patient.LastName.length"});
				console.log(err);
				err.pushErrors(errors);
			}

			//validate Gender
			if(data.Gender != "F" || data.Gender != "M"){
				errors.push({field:"Gender",message:"Patient.Gender.valueField"});
				err.pushErrors(errors);
			}

			//validate Address
			if(data.Address.length < 0 || data.Address.length > 255){
				errors.push({field:"Address",message:"Patient.Address.length"});
				console.log(err);
				err.pushErrors(errors);
				throw err;
			}
			else{
				throw err;
			}
			q.resolve({status:'success'});

		}
		catch(err){
			q.reject(err);
		}
		return q.promise;
	},


	/*
		func: CreatePatient
		input: Patient's information
		output: insert Patient's information into table Patient 
	*/
	CreatePatient : function(data) {
		return Services.Patient.validation()
		.then(function(success){
			return Patient.create(data);
		},function(err){
			throw err;
		});
	},


	/*
		func: SearchPatient
		input:patient's information
		output:find patient which was provided information.
	*/
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


	/*
		func: UpdatePatient
		input:patient's information
		output:update patient into table Patient
	*/
	UpdatePatient : function(data) {
		return Services.Patient.validation(data)
		.then(function(success){
			return Patient.update(data,{
				where:{
					ID : data.ID
				}
			});
		}, function(err){
			throw err;
		});
	},


	/*
		func:GetPatient
		input:patient's ID
		output: get patient's information.
	*/
	GetPatient : function(patientID) {
		return Patient.find({
			where: {
				ID : patientID
			}
		});
	},
	
	// DeletePatient : function(patientID) {
	// 	return Patient.destroy({
	// 		where : {
	// 			ID : patientID
	// 		}
	// 	});
	// }

};