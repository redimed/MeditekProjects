var moment = require('moment');
var _ = require('lodash');
var S = require('string');
var generatePassword = require('password-generator');

module.exports = {
	
	/*  
		GetDoctor: Get all data from specific table
		Ouput: Information of doctor table
	*/
	LoadlistDoctor: function(req, res) {
		// Information
		var data = req.body.data;
		Services.Doctor.LoadlistDoctor(data)
		.then(function(result){
			if(result!==undefined && result!==null && result!=='')
				res.ok({message:"success",data:result.rows,count:result.count});
			else{
				var err = new Error("SERVER ERROR");
				err.pushError("No data result");
				res.notFound({message:ErrorWrap(err)});
			}
		})
		.catch(function(err){
			res.serverError({message:ErrorWrap(err)});
		});

	},

	DetailDoctor: function(req, res) {
		var data = req.body.data;
		Services.Doctor.DetailDoctor(data)
		.then(function(info){
			FileUpload.findAll({
				where:{
					UserAccountID : info.UserAccountID,
					FileType : {$in: ["ProfileImage", "Signature"]},
					Enable : 'Y'
				}
			})
			.then(function(success){
				console.log(success);
				if(success!==undefined && success!==null && success!=='' && success.length!==0){
					for(var i = 0;i < success.length; i++){
						if(success[i].FileType =="ProfileImage")
							info.dataValues.FileUID_img = success[i].UID?success[i].UID:null;
						if(success[i].FileType =="Signature")
							info.dataValues.FileUID_sign = success[i].UID?success[i].UID:null;
					}
					res.ok({status:200, message:"success", data:info});
				}
				else{
					info.dataValues.FileUID = null;
					res.ok({status:200, message:"success", data:info});
				}
			},function(err){
				var err = new Error("SERVER ERROR");
				err.pushError("Server Error");
				res.notFound({message:ErrorWrap(err)});
			});
		})
		.catch(function(err){
			res.serverError({message:ErrorWrap(err)});
		})
	},

	UpdateDoctor: function(req, res) {
		var data = req.body.data;
		Services.Doctor.UpdateDoctor(data)
		.then(function(result){
			res.ok({message:"success",data:result});
		})
		.catch(function(err){
			res.serverError({message:ErrorWrap(err)});
		})
	},

	GetDoctor: function(req, res) {
		var data = req.body.data;
		Services.Doctor.GetDoctor(data)
		.then(function(info){
			if(info!=undefined&&info!=null&&info!=''&&info.length!=0){
				FileUpload.findAll({
					where:{
						UserAccountID : info.UserAccountID,
						FileType : {$in: ["ProfileImage", "Signature"]},
						Enable : 'Y'
					}
				})
				.then(function(success){
					console.log(success);
					if(success!==undefined && success!==null && success!=='' && success.length!==0){
						for(var i = 0;i < success.length; i++){
							if(success[i].FileType =="ProfileImage")
								info.dataValues.FileUID_img = success[i].UID?success[i].UID:null;
							if(success[i].FileType =="Signature")
								info.dataValues.FileUID_sign = success[i].UID?success[i].UID:null;
						}
						res.ok({status:200, message:"success", data:info});
					}
					else{
						info.dataValues.FileUID = null;
						res.ok({status:200, message:"success", data:info});
					}
				},function(err){
					var err = new Error("SERVER ERROR");
					err.pushError("Server Error");
					res.notFound({message:ErrorWrap(err)});
				});
			}
			else{
				res.ok({message:"no data result"});
			}
		})
		.catch(function(err){
			console.log(err);
			res.serverError({message:ErrorWrap(err)});
		});
	},

	CheckDoctor: function(req, res) {
		var data = req.body.data;
		Services.Doctor.CheckDoctor(data)
		.then(function(result){
			res.ok({message:"success",data:result});
		})
		.catch(function(err){
			res.serverError({message:ErrorWrap(err)});
		})
	},

	CheckInfo: function(req, res) {
		var data = req.body.data;
		Services.Doctor.validation(data)
		.then(function(success){
			res.ok(success);
		},function(err){
			console.log(err);
			res.serverError(ErrorWrap(err));
		});
	},

	CreateDoctorByNewAccount: function(req, res) {
		var data = req.body.data;
		Services.Doctor.CreateDoctorByNewAccount(data)
		.then(function(success){
			res.ok(success);
		})
		.catch(function(err){
			res.serverError(ErrorWrap(err));
		})
	},

	/*
		doctorAppointment: List doctor for Appointment
	*/
	DoctorAppointment: function(req, res) {

		Services.Doctor.DoctorAppointment()
		.then(function(result) {
			res.ok(result);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/*
		DoctorIDAppointment: Get doctor according to ID
	*/
	DoctorIDAppointment: function(req, res) {

		var data = req.body.data;

		Services.Doctor.DoctorIDAppointment(data)
		.then(function(result) {
			res.ok(result);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});
	},
	/*
		ListCountry: Get all data of country
		Ouput: list country
	*/
	ListCountry: function(req, res) {
		HelperService.getListCountry()
		.then(function(result) {
			res.ok(result);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});
	},
	/*
		GetDepartment: Get all's department
	*/
	GetDepartment: function(req, res) {

		Services.Doctor.GetAllDepartment()
		.then(function(result) {
			res.ok(result);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/*
		Doctor
		CreateDoctor: Create new doctor and new doctor's account
		Input: info's doctor and info's useraccount
		Ouput: success or error
	*/
	CreateDoctor: function(req, res) {
		
		var data = req.body.data;

		var userInfo={
			Enable: 'Y',
			UserName: data.PhoneNumber,
			Email: data.Email,
			PhoneNumber: data.PhoneNumber,
			Password: generatePassword(12, false)
		};
		
		// Create Account
		sequelize.transaction().then(function(t){
					
			return Services.UserAccount.CreateUserAccount(userInfo, t)
			.then(function(result) {
				
				// Create Role
				var info_id = {
					ID: result.ID
				};

				if(data.Type == 'INTERNAL_PRACTITIONER') {
					var info_role = {
						RoleCode: data.Type,
						SiteId: '1'
					};
				} else {
					var info_role = {
						RoleCode: data.Type
					};
				}

				Services.UserRole.CreateUserRoleWhenCreateUser(result, info_role, t)
				.then(function(success) {
					// Create Doctor
					data.CreatedDate = moment(new Date(), 'YYYY-MM-DD HH:mm:ss Z');
					data.CreatedBy = req.user?req.user.ID:null;
					data.UserAccountID = result.ID;
					Services.Doctor.CreateDoctor(data, t)
					.then(function(resultd) {
						t.commit();
						var info_show = {
							UID: result.UID
						}
						res.ok(info_show);
					})
					.catch(function(err) {
						t.rollback();
						res.serverError(ErrorWrap(err));
					});
				})
				.catch(function(err) {
					t.rollback();
					res.serverError(ErrorWrap(err));
				});
				
			})
			.catch(function(err) {
				t.rollback();
				res.serverError(ErrorWrap(err));
			});

		});
		
	},
	/*
		GetBy: Get info's doctor
		Input: UID's doctor
		Ouput: info's doctor and info's useraccount
	*/
	GetBy: function(req, res) {

		var data = req.body.data;

		Services.Doctor.GetDetail(data)
		.then(function(result) {
			res.ok(result);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});
	},
	/*
		UpdateDoctor: update infor's doctor
		Input: info's doctor
		Ouput: success or error
	*/
	// UpdateDoctor: function(req, res) {

	// 	var data = req.body.data;

	// 	data.ModifiedDate = moment(new Date(), 'YYYY-MM-DD HH:mm:ss Z');;
	// 	data.ModifiedBy = req.user?req.user.ID:null;

	// 	Services.Doctor.UpdateDoctor(data)
	// 	.then(function(result) {
		
	// 		var info = {
	// 			Enable: data.Enable,
	// 			UserAccountID: data.UserAccountID
	// 		};

	// 		Services.Doctor.UpdateAccountDoctor(info)
	// 		.then(function(success) {

	// 			Services.Doctor.GetOneUser(data)
	// 			.then(function(result_u) {
	// 				res.ok(result_u);
	// 			})
	// 			.catch(function(err) {
	// 				res.serverError(ErrorWrap(err));
	// 			});

	// 		})
	// 		.catch(function(err) {
	// 			res.serverError(ErrorWrap(err));
	// 		});

	// 	})
	// 	.catch(function(err) {
	// 		res.serverError(ErrorWrap(err));
	// 	});
	// },
	/*
		GetFile: Get UID's fileupload
		Input: UserAccountID
		Ouput: List's UploadFile
	*/
	GetFile: function(req, res) {
		var data = req.body.data;

		Services.Doctor.GetUploadFile(data)
		.then(function(result) {
			res.ok(result);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/*
		RemoveImage: Disable Image
		Input: Type, UID
		Ouput: success or error
	*/
	RemoveImage: function(req, res) {
		
		var data = req.body.data;

		Services.UserAccount.RemoveIdentifierImage(data)
		.then(function(success) {
			res.ok(success);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/*
		ShowRole: Show role's doctor
		Input: AccountID's doctor
		Output: RoleName
	*/
	GetRoleDoctor: function(req, res) {
	
		var data = req.body.data;

		Services.Doctor.GetRoleDoctor(data)
		.then(function(result) {
			res.ok(result);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});

	},
	/*
		GetOneDepartment: Get department by DeparmentID's doctor
		Input: DepartmentID
		Ouput: Data's Department
	*/
	GetOneDepartment: function(req, res) {
	
		var data = req.body.data;

		Services.Doctor.GetDepartment(data)
		.then(function(result) {
			res.ok(result);
		})
		.catch(function(err) {
			res.serverError(ErrorWrap(err));
		});
	
	}
};