module.exports = {
	/*
		CreatePatient : create a new patient
		input: Patient's information
		output: insert Patient's information into table Patient 
	*/
	CreatePatient : function(req, res) {
		var data = req.body.data;
		Services.Patient.CreatePatient(data)
		.then(function(patient){
			console.log(patient);
			if(patient!==undefined && patient!==null && patient!=='' && patient.length!==0){
				var info = {
					UID            : patient.result.UID,
					FirstName      : patient.result.FirstName,
					LastName       : patient.result.LastName,
					DOB            : patient.result.DOB,
					Address1       : patient.result.Address1,
					Address2       : patient.result.Address2,
					UserAccountUID : patient.UserAccountUID
				};
				res.ok({status:200, message:"success",data:info});
			}
			else{
				var err = new Error("SERVER ERROR");
				err.pushError("No data result");
				res.notFound({status:200,message:ErrorWrap(err)});
			}
		})
		.catch(function(err){
			res.serverError({status:500, message:ErrorWrap(err)});
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
			if(info!==undefined){
				if(info === null)
					res.ok({status:200, message:"success", data:'',count:0});
				else
					res.ok({status:200,message:"success",data:info.rows,count:info.count});
			}
			else{
				var err = new Error("SERVER ERROR");
				err.pushError("No data result");
				res.notFound({status:200,message:ErrorWrap(err)});
			}
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
		Services.Patient.UpdatePatient(data)
		.then(function(result){
			if(result[0] > 0)
				res.ok({status:200,message:"success"});
			else{
				var err = new Error("SERVER ERROR");
				err.pushError("No data result");
				res.notFound({status:200,message:ErrorWrap(err)});
			}
		})
		.catch(function(err){
			return res.serverError({status:500,message:ErrorWrap(err)});
		});
	},

	/*
		GetPatient get a patient with condition
		input:  UserAccount's UID
		output: Patient's information of Patient's ID if patient has data.
	*/
	GetPatient : function(req, res) {
		var data = req.body.data;
		Services.Patient.GetPatient(data)
		.then(function(info){
			if(info!=null && info!=undefined && info!=''){
				res.ok({status:200, message:"Success", data:info});
			} else {
				var err = new Error("SERVER ERROR");
				err.pushError("No data result");
				res.notFound({status:200,message:ErrorWrap(err)});
			}
		})
		.catch(function(err){
			res.serverError({status:500,message:ErrorWrap(err)});
		});
	},

	/*
		DetailPatient: get detail patient with patient UID
		input: patient's UID
		output: Patient's information
	*/
	DetailPatient : function(req, res) {
		var data = req.body.data;
		if(typeof(data)=='string'){
			data = JSON.parse(data);
		}
		Services.Patient.DetailPatient(data)
		.then(function(info){
			if(info!=null && info!=undefined && info!='' && info.length!=0){
				FileUpload.findAll({
					where:{
						UserAccountID : info[0].UserAccountID,
						FileType : 'ProfileImage',
						Enable : 'Y'
					}
				})
				.then(function(success){
					if(success!==undefined && success!==null && success!=='' && success.length!==0){
						info[0].dataValues.FileUID = success[0].UID?success[0].UID:null;
						info[0].dataValues.CountryName = info[0].dataValues.Country.ShortName;
						delete info[0].dataValues['Country'];
						res.ok({status:200, message:"success", data:info});
					}
					else{
						info[0].dataValues.FileUID = null;
						res.ok({status:200, message:"success", data:info});
					}
				},function(err){
					var err = new Error("SERVER ERROR");
					err.pushError("Server Error");
					res.notFound({status:200,message:ErrorWrap(err)});
				});
				
			} else {
				var err = new Error("SERVER ERROR");
				err.pushError("No data result");
				res.ok({status:200,message:ErrorWrap(err)});
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
			if(result===0){
				var err = new Error("SERVER ERROR");
				err.pushError("No data result");
				res.notFound({status:200,message:ErrorWrap(err)});
			}
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
		if(typeof(data)=='string'){
			data = JSON.parse(data);
		for(var key in data){
			if(typeof(data[key]) == 'string')
				data[key] = JSON.parse(data[key]);
		}
		Services.Patient.LoadListPatient(data)
		.then(function(result){
			if(result!==undefined && result!==null && result!=='')
				res.ok({status:200,message:"success",data:result.rows,count:result.count});
			else{
				var err = new Error("SERVER ERROR");
				err.pushError("No data result");
				res.notFound({status:200,message:ErrorWrap(err)});
			}
		})
		.catch(function(err){
			res.serverError({status:500,message:ErrorWrap(err)});
		});
	},

	/*
		CheckPatient : check patient has created ?
		input : Patient's PhoneNumber
		output: true if patient has created and (false,data:{}) if patient hasn't created
	*/
	CheckPatient : function(req, res) {
		var data = req.body.data;
		Services.Patient.CheckPatient(data)
		.then(function(result){
			if(result!==undefined && result!==null){
				res.ok({status:200,message:"success",data:result});
			}
			else{
				var err = new Error("SERVER ERROR");
				err.pushError("No data result");
				res.notFound({status:200,message:ErrorWrap(err)});
			}
		})
		.catch(function(err){
			res.serverError({status:500,message:ErrorWrap(err)});
		})
	},

	GetListCountry : function(req, res) {
		HelperService.getListCountry()
		.then(function(result){
			if(result!==undefined && result!==null && result!=='' && result.length!==0)
				res.ok({status:200,message:"success",data:result});
			else{
				var err = new Error("SERVER ERROR");
				err.pushError("No data result");
				res.notFound({status:200,message:ErrorWrap(err)});
			}
		})
		.catch(function(err){
			res.serverError({status:500,message:ErrorWrap(err)});
		})
	},

	getfileUID: function(req, res) {
		var data = req.body.data;
		Services.Patient.getfileUID(data)
		.then(function(result){
			if(result!=undefined){
				res.ok({status:200,message:"success",data:result});
			}
			else{
				var err = new Error("SERVER ERROR");
				err.pushError("No data result");
				res.notFound({status:200,message:ErrorWrap(err)});
			}

		})
		.catch(function(err){
			res.serverError({status:500,message:ErrorWrap(err)});
		})
	}

};