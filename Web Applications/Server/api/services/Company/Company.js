var $q = require('q');
var moment = require('moment');
var check  = require('../HelperService');
var _ = require('lodash');
var generatePassword = require('password-generator');
var config = sails.config.myconf;
var secret = 'ewfn09qu43f09qfj94qf*&H#(R';
var twilioClient = require('twilio')(config.twilioSID, config.twilioToken);
var CompanyRole = check.const.rolesID.organization;//Role Company
var PatientRole = check.const.rolesID.patient;;//Role Patient
function SendSMS(toNumber, content, callback) {
    return twilioClient.messages.create({
        body: content,
        to: toNumber,
        from: config.twilioPhone
    }, callback());
};
var defaultAttr = [
	'ID',
	'UID',
	'CompanyName',
	'Enable',
	'Active',
	'Description',
	'CreatedDate',
	'CreatedBy',
	'ModifiedDate',
	'ModifiedBy'
];

module.exports = {

	validate: function(info) {
		var characterRegex = new RegExp(check.regexPattern.character);
		var addressRegex   = new RegExp(check.regexPattern.address);
		var postcodeRegex  = new RegExp(check.regexPattern.postcode);
		var error = [];
		//create a error with contain a list errors input
		var err = new Error("Error");
		var q = $q.defer();
		try {
			//validate FirstName
			if('CompanyName' in info){
				if(info.CompanyName){
					if(info.CompanyName.length < 0 || info.CompanyName.length > 255){
						error.push({field:"CompanyName",message:"max length"});
						err.pushErrors(error);
					}
					if(!characterRegex.test(info.CompanyName)){
						error.push({field:"CompanyName",message:"invalid value"});
						err.pushErrors(error);
					}
				}
			}
			else{
				error.push({field:"CompanyName",message:"required"});
				err.pushErrors(error);
			}

			//validate SiteName
			if('CompanySiteSiteName' in info){
				if(info.CompanySiteSiteName){
					if(info.CompanySiteSiteName < 0 || info.CompanySiteSiteName > 255){
						error.push({field:"CompanySiteSiteName",message:"max length"});
						err.pushErrors(error);
					}
					if(!characterRegex.test(info.CompanySiteSiteName)){
						error.push({field:"CompanySiteSiteName",message:"invalid value"});
						err.pushErrors(error);
					}
				}
			}
			else{
				error.push({field:"CompanySiteSiteName",message:"required"});
				err.pushErrors(error);
			}

			//validate Address1
			if('CompanySiteAddress1' in info){
				if(info.CompanySiteAddress1){
					if(info.CompanySiteAddress1.length < 0 || info.CompanySiteAddress1.length > 255){
						error.push({field:"CompanySiteAddress1",message:"max length"});
						err.pushErrors(error);
					}
					if(!addressRegex.test(info.CompanySiteAddress1)){
						error.push({field:"CompanySiteAddress1",message:"invalid value"});
						err.pushErrors(error);
					}
				}
			}
			else {
				error.push({field:"CompanySiteAddress1",message:"required"});
				err.pushErrors(error);
			}

			//validate Address2
			if('CompanySiteAddress2' in info){
				if(info.CompanySiteAddress2){
					if(info.CompanySiteAddress2.length < 0 || info.CompanySiteAddress2.length > 255){
						error.push({field:"CompanySiteAddress2",message:"max length"});
						err.pushErrors(error);
					}
					if(!addressRegex.test(info.CompanySiteAddress2)){
						error.push({field:"CompanySiteAddress2",message:"invalid value"});
						err.pushErrors(error);
					}
				}
			}

			//validate Suburb
			if('CompanySiteSuburb' in info){
				if(info.CompanySiteSuburb){
					if(info.CompanySiteSuburb.length < 0 || info.CompanySiteSuburb.length > 255){
						error.push({field:"CompanySiteSuburb",message:"max length"});
						err.pushErrors(error);
					}
				}
			}
			else {
				error.push({field:"CompanySiteSuburb",message:"required"});
				err.pushErrors(error);
			}

			//validate Postcode
			if('CompanySitePostcode' in info){
				if(info.CompanySitePostcode){
					if(info.CompanySitePostcode.length < 0 || info.CompanySitePostcode.length > 255){
						error.push({field:"CompanySitePostcode",message:"max length"});
						err.pushErrors(error);
					}
					if(!postcodeRegex.test(info.CompanySitePostcode)){
						error.push({field:"CompanySitePostcode",message:"Postcode is a 4 digits number"});
						err.pushErrors(error);
					}
				}
			}
			else{
				error.push({field:"CompanySitePostcode",message:"required"});
				err.pushErrors(error);
			}

			//validate State
			if('CompanySiteState' in info){
				if(info.CompanySiteState){
					if(info.CompanySiteState.length < 0 || info.CompanySiteState.length > 255){
						error.push({field:"CompanySiteState",message:"max length"});
						err.pushErrors(error);
					}
					if(!characterRegex.test(info.CompanySiteState)){
						error.push({field:"CompanySiteState",message:"invalid value"});
						err.pushErrors(error);
					}
				}
			}
			else {
				error.push({field:"CompanySiteState",message:"required"});
				err.pushErrors(error);
			}

			//validate Country
			if('CompanySiteCountry' in info){
				if(info.CompanySiteCountry==null){
					error.push({field:"CompanySiteCountry",message:"required"});
					err.pushErrors(error);
				}
			}
			else {
				error.push({field:"CompanySiteCountry",message:"required"});
				err.pushErrors(error);
			}

			//validate ContactName
			if('CompanySiteContactName' in info){
				if(info.CompanySiteContactName){
					if(info.CompanySiteContactName.length < 0 || info.CompanySiteContactName.length > 255){
						error.push({field:"CompanySiteContactName",message:"max length"});
						err.pushErrors(error);
					}
				}
				// else {
				// 	error.push({field:"ContactName",message:"required"});
				// }
			}

				//validate HomePhoneNumber? hoi a Tan su dung exception
			if('CompanySiteHomePhoneNumber' in info){
				if(info.CompanySiteHomePhoneNumber){
					var auHomePhoneNumberPattern=new RegExp(/^[0-9]{6,10}$/);
					var HomePhone=info.CompanySiteHomePhoneNumber.replace(/[\(\)\s\-]/g,'');
					if(!auHomePhoneNumberPattern.test(HomePhone)){
						error.push({field:"CompanySiteHomePhoneNumber",message:"Phone Number is invalid. The number is a 6-10 digits number"});
						err.pushErrors(error);
					}
				}
			}
			
			//end validate SiteInfo

			if(error.length > 0){
				throw err;
			}
			else{
				q.resolve({status:'success'});
			}

		}
		catch(error){
			q.reject(error);
		}
		return q.promise;
	},

	whereClause : function(data) {
        // define whereClause's data
        var whereClause = {};
        whereClause.Company = {};
        if(check.checkData(data.Search)){
            if(data.Search.ID){
                whereClause.Company.ID={
                    like:'%'+data.Search.ID+'%'
                } 
            }
            if(data.Search.UID){
                whereClause.Company.UID={
                    like:'%'+data.Search.UID+'%'
                } 
            }
            if(data.Search.CompanyName){
                whereClause.Company.CompanyName={
                    like:'%'+data.Search.CompanyName+'%'
                } 
            }
            if(data.Search.Enable){
                whereClause.Company.Enable={
                    like:'%'+data.Search.Enable+'%'
                } 
            }
            if(data.Search.Active){
                whereClause.Company.Active={
                    like:'%'+data.Search.Active+'%'
                } 
            }
            if(data.Search.Description){
                whereClause.Company.Description={
                    like:'%'+data.Search.Description+'%'
                } 
            }
            if(data.Search.CreatedDate){
                whereClause.Company.CreatedDate={
                    like:'%'+data.Search.CreatedDate+'%'
                } 
            }
            if(data.Search.CreatedBy){
                whereClause.Company.CreatedBy={
                    like:'%'+data.Search.CreatedBy+'%'
                } 
            }
            if(data.Search.ModifiedDate){
                whereClause.Company.ModifiedDate={
                    like:'%'+data.Search.ModifiedDate+'%'
                } 
            }
            if(data.Search.ModifiedBy){
                whereClause.Company.ModifiedBy={
                    like:'%'+data.Search.ModifiedBy+'%'
                } 
            }
          
        }
        return whereClause;
    },

	CreateCompany : function(data) {
		//validate data
		return Services.Company.validate(data)
		.then(function(validated) {
			// return validated;
			var info = {};
			info.CompanySite = {};
			info.Company     = {}; 
			for(var key in data) {
				if(key.indexOf('CompanySite') != -1) {
					var temp = key.replace('CompanySite','');
					info.CompanySite[temp] = data[key];
				}
				else 
					info.Company[key] = data[key];
			}
			console.log(info);

			//begin start transaction
			return sequelize.transaction()
			.then(function(t){
				info.Company.UID = UUIDService.Create();
				info.Company.Enable = 'Y';
				info.Company.Active = 'Y';
				return Company.create(info.Company,{transaction:t})
				.then(function(created_Company){
					if(created_Company == null || created_Company == ""){
						t.rollback();
						var err = new Error("Create.Error");
						err.pushError("CreateCompany.Queryerror");
						throw err;
					}
					else {
						info.CompanySite.UID = UUIDService.Create();
						info.CompanySite.CompanyID = created_Company.ID;
						info.CompanySite.Enable = 'Y';
						return CompanySite.create(info.CompanySite,{transaction:t});
					}
				},function(err){
					t.rollback();
					throw err;
				})
				.then(function(created_CompanySite){
					if(created_CompanySite == null || created_CompanySite == ""){
						t.rollback();
						var err = new Error("Create.Error");
						err.pushError("CreateCompanySite.Queryerror");
						throw err;
					}
					else {
						t.commit();
						return created_CompanySite;
					}
				},function(err){
					t.rollback();
					throw err;
				})
			},function(err){
				throw err;
			})
			//end start transaction

		},function(err) {
			throw err;
		});
		//end validate
	},

	getList : function(data, transaction) {
		//get attribute
		var attrs = [];
		if('attrs' in data){
			attrs = data.attrs;
		}
		else {
			attrs = defaultAttr;
		}
        var whereClause = Services.Company.whereClause(data);
        console.log("whereClause ",whereClause);
        if(_.isEmpty(whereClause.Company))
        	whereClause = {};
        return Company.findAndCountAll({
            attributes : attrs,
            limit      : data.limit,
            offset     : data.offset,
            order      : data.order,
            where: {
                $or: [
                    whereClause.Company
                ]
                
            },
            transaction:transaction
        })
        .then(function(result){
            return result;
            
        },function(err){
            throw err;
        });
	},

	detailCompany : function(data) {
		var returnData = {};
		return sequelize.transaction()
		.then(function(t) {

			return Company.findOne({
				// include:[
				// 	{
				// 		all:true,
				// 		required:false
				// 	},
				// 	{
				// 		model:Patient,
				// 		through:
				// 		{

				// 			required:true
				// 		},
				// 		required:false
				// 	}
				// ],
				where: {
					UID : data.UID
				},
				transaction : t
			})
			.then(function(got_company) {

				if(got_company == null || got_company == ''){
					t.rollback();
					var err = new Error("detailCompany.Error");
					err.pushError("findCompany.Error");
					throw err;
				}
				else {
					t.commit();
					return got_company;
				}

			},function(err) {
				t.rollback();
				throw err;
			})

		},function(err) {
			throw err;
		});
	},

	loadDetail : function(data, transaction) {
		var model = sequelize.models[data.model];
		var include = null;
		if(data.include && data.include==true) {
			include = [{all:true}];
		}
		else {
			if(data.association == true){
				include = [{
		                model: Company,
		                attributes:['UID','ID'],
		                where: {Enable: 'Y'}
		        }];
			}
		}
		console.log(model)
		return model.findOne({
			include: include,
			where: data.whereClause
		})
		.then(function(result) {
			return result;
		},function(err) {
			throw err;
		});
	},

	Create: function(data) {
		return sequelize.transaction()
		.then(function(t) {
			return Company.findOne({
				where:{
					UID: data.CompanyUID,
					Enable :'Y'
				},
				attributes : ['ID','CompanyName'],
				transaction : t
			})
			.then(function(got_company) {
				if(got_company == null || got_company == ''){
					t.rollback();
					var err = new Error('Create.Error');
					err.pushError('Company.notFound');
					throw err;
				}
				else {
					data.info.CompanyID = got_company.ID;
					console.log(data.model);
					var model = sequelize.models[data.model];
					if(data.model == 'UserAccount'){
						data.info.Password  = generatePassword(12, false);
						data.info.PinNumber = generatePassword(6, false);
						data.info.PhoneNumber = check.parseAuMobilePhone(data.info.PhoneNumber);
						console.log(data.info);
					}
					data.info.UID = UUIDService.Create();
					return model.create(data.info,{transaction:t});
				}
			},function(err) {
				t.rollback();
				throw err;
			})
			.then(function(created) {
				if(created == null || created == ''){
					t.rollback();
					var err = new Error('Create.Error');
					err.pushError('CompanySite.Create.Queryerror');
					throw err;
				}
				else {
					if(!data.association || data.association == null || data.association == ''){
						t.commit();
						return created;
					}
					else if (data.association == true) {
						var associationModel = sequelize.models['RelCompany'+data.model];
						var associationData = {
							CompanyID : data.info.CompanyID
						};
						associationData[data.model+'ID'] = created.ID;
						if(associationModel == undefined || associationModel == null || associationModel == ''){
							t.rollback();
							var err = new Error('Create.Error');
							err.pushError('Unknown.ModelAssociation');
							throw err;
						}
						else {
							return associationModel.create(associationData,{transaction : t})
							.then(function(created_association){
								if(created_association == null || created_association == ''){
									var err = new Error('Create.Error');
									err.pushError('association.Create.Queryerror');
									throw err;
								}
								else {
									if(data.model == 'UserAccount'){
										return RelUserRole.create({
											UserAccountId : created.ID,
											RoleId        : CompanyRole
										},{transaction:t})
										.then(function(success) {
											if(success == null || success == ''){
												t.rollback();
												var err = new Error("Create.Error");
												err.pushError('RelUserRole.Create.Queryerror');
												throw err;
											}
											else {
												// t.commit();
												// return created;
												var byEmail = false;
												var byPhone = false;
												data.info.content = data.info.PinNumber;
												console.log("luc nay ne  ",data.info);
												if(data.info.PhoneNumber) {
													return Services.Patient.sendSMS(data.info, t,function(err) {
                        							if(err) 
                            							throw err;
                            						else
                            							byPhone = true;
                    								});
												}
                    							if(data.info.Email) {
                            						return Services.Patient.sendMail(data.info,t,function(err) {
                                						if(err)
                                    						throw err;
                                						else
                                							byEmail = true;
                           							});
                        						}
                        						if(byEmail == true || byPhone == true){
							                        t.commit();
													return created;
                        						}
											}
										},function(err) {
											t.rollback();
											throw err;
										});
									}
									else {
										t.commit();
										return created;
									}
								}
							},function(err) {
								t.rollback();
								throw err;
							});
						}
					}
				}
			},function(err) {
				t.rollback();
				throw err;
			})
		},function(err) {
			throw err;
		});
	},

	Update : function(data) {
		var model = sequelize.models[data.model];
		return sequelize.transaction()
		.then(function(t) {
			return model.findOne({
				where:{
					UID: data.info.UID,
					Enable :'Y'
				},
				transaction : t
			})
			.then(function(got_model) {
				if(got_model == null || got_model == ''){
					t.rollback();
					var err = new Error('Update.Error');
					err.pushError('modelFind.notFound');
					throw err;
				}
				else {
					var UID = data.info.UID;
					delete data.info['UID'];
					return model.update(data.info,{
						where:{
							UID : UID
						},
						transaction:t
					});
				}
			},function(err) {
				t.rollback();
				throw err;
			})
			.then(function(updated) {
				if(updated == null || updated == ''){
					t.rollback();
					var err = new Error('Updated.Error');
					err.pushError('Model.Update.Queryerror');
					throw err;
				}
				else {
					t.commit();
					return updated;
				}
			},function(err) {
				t.rollback();
				throw err;
			})
		},function(err) {
			throw err;
		});
	},

	ChangeStatus : function(data) {
		var model = sequelize.models[data.model];
		return sequelize.transaction()
		.then(function(t) {
			function callChangeStatus(transaction) {
				var q = $q.defer();
				model.findOne({
					where:{
						// UID: data.info.UID,
						$and: data.whereClauses
					},
					transaction : transaction
				})
				.then(function(got_model) {
					if(got_model == null || got_model == ''){
						var err = new Error('Update.Error');
						err.pushError('modelFind.notFound');
						throw err;
					}
					else {
						var UID = data.info.UID;
						// delete data.info['UID'];
						return model.update(
							data.info
						,{
							where:{
								$and: data.whereClauses
							},
							transaction: transaction
						});
					}
				},function(err) {
					throw err;
				})
				.then(function(updated) {
					if(updated == null || updated == ''){
						var err = new Error('Updated.Error');
						err.pushError('Model.Update.Queryerror');
						throw err;
					}
					else {
						q.resolve(updated);
					}
				},function(err) {
					q.reject(err);
				})
				return q.promise;
			}
			if(!data.isRemoveAdmin) {
				return callChangeStatus(t)
				.then(function(result) {
					t.commit();
					return result;
				},function(err) {
					t.rollback();
					throw err;
				})
			}
			else {
				if(data.isRemoveAdmin == true) {
					return callChangeStatus(t)
					.then(function(result) {
						// t.commit();
						// return result;
						return RelCompanyPatient.update({
							Active: data.info.Enable
						},{
							where:{
								PatientID : data.PatientID,
								CompanyID     : data.CompanyID
							},
							transaction: t
						});
					},function(err) {
						// t.rollback();
						throw err;
					})
					.then(function(success) {
						t.commit();
						return success;
					},function(err) {
						t.rollback();
						throw err;
					})
				}
			}
		},function(err) {
			throw err;
		});
	},

	CreateStaff : function(data) {
		var company;
		return sequelize.transaction()
		.then(function(t) {
			return Company.findOne({
				where : {
					UID : data.CompanyUID,
					Enable:'Y'
				},
				transaction :t
			})
			.then(function(got_company) {
				if(got_company == null || got_company == ''){
					t.rollback();
					var err = new Error("CreateStaff.Error");
					err.pushError("Company.notFound");
					throw err;
				}
				else {
					company = got_company.ID;
					return Patient.findOne({
						where:{
							UID : data.patientUID
						},
						transaction :t
					});
				}
			},function(err) {
				t.rollback();
				throw err;
			})
			.then(function(got_patient) {
				if(got_patient == null || got_patient == ''){
					t.rollback();
					var err = new Error("CreateStaff.Error");
					err.pushError("Patient.notFound");
					throw err;
				}
				else {
					patient = got_patient;
					console.log(company);
					console.log(got_patient.ID);
					return RelCompanyPatient.findOne({
						where: {
							CompanyID : company,
							PatientID : patient.ID
						},
						transaction:t
					});
					// return RelCompanyPatient.create({
					// 	CompanyID : company,
					// 	PatientID : got_patient.ID
					// },{transaction:t});
				}
			},function(err) {
				t.rollback();
				throw err;
			})
			.then(function(checked_association){
				if(checked_association == null || checked_association == ''){
					console.log("ha ? ha ?");
					return RelCompanyPatient.create({
						CompanyID : company,
						PatientID : patient.ID,
						Active    : 'Y'
					},{transaction:t});
				}
				else {
					console.log("duoc khong ha ?????");
					if(checked_association.Active == 'Y') {
						console.log("duoc khong ha ?????");
						t.rollback();
						var err = new Error("CreateStaff.Error");
						err.pushError("Patient.Company.HasAssociation");
						throw err;
					}
					else {
						return RelCompanyPatient.update({
							Active    : 'Y'
						},{
							where:{
								CompanyID : company,
								PatientID : patient.ID,
							},
							transaction:t
						});
					}
				}
			},function(err) {
				t.rollback();
				throw err;
			})
			.then(function(created_association) {
				if(created_association == null || created_association == ''){
					// t.rollback();
					var err = new Error("CreateStaff.Error");
					err.pushError("CreateAssociation.Queryerror");
					throw err;
				}
				else {
					// t.commit();
					console.log(created_association);
					console.log("Patinet ",created_association.PatientID);
					// return created_association;
					return RelCompanyPatient.update({
						Active:'N'
					},{
						where:{
							PatientID: patient.ID,
							CompanyID :{$notIn: [company]}
						},
						transaction: t
					});
				}
			},function(err) {
				// t.rollback();
				throw err;
			})
			.then(function(success) {
				if(success == null || success == ''){
					// t.rollback();
					var err = new Error("CreateStaff.Error");
					err.pushError("UpdateAssociation.Queryerror");
					throw err;
				}
				else {
					t.commit();
					return success;
				}
			},function(err) {
				t.rollback();
				throw err;
			});
		},function(err) {
			throw err;
		});
	},

	CreateUser : function(data) {
		var company;
		return sequelize.transaction()
		.then(function(t) {
			return Company.findOne({
				where : {
					UID : data.CompanyUID,
					Enable:'Y'
				},
				transaction :t
			})
			.then(function(got_company) {
				if(got_company == null || got_company == ''){
					t.rollback();
					var err = new Error("CreateUser.Error");
					err.pushError("Company.notFound");
					throw err;
				}
				else {
					company = got_company.ID;
					return Patient.findOne({
						where:{
							UID : data.patientUID
						},
						transaction :t
					});
				}
			},function(err) {
				t.rollback();
				throw err;
			})
			.then(function(got_patient) {
				if(got_patient == null || got_patient == ''){
					t.rollback();
					var err = new Error("CreateUser.Error");
					err.pushError("Patient.notFound");
					throw err;
				}
				else {
					patient = got_patient;
					console.log(company);
					console.log(got_patient.ID);
					return RelCompanyPatient.findOne({
						where: {
							CompanyID : company,
							PatientID : patient.ID
						},
						transaction:t
					});
				}
			},function(err) {
				t.rollback();
				throw err;
			})
			.then(function(checked_association){
				console.log(checked_association);
				if(checked_association == null || checked_association == ''){
					return RelCompanyPatient.create({
						CompanyID : company,
						PatientID : patient.ID,
						Active    : 'Y'
					},{transaction:t});
				}
				else {
					return checked_association;
				}
			},function(err) {
				t.rollback();
				throw err;
			})
			.then(function(created_association) {
				if(created_association == null || created_association == ''){
					t.rollback();
					var err = new Error("CreateUser.Error");
					err.pushError("CreateAssociation.Queryerror");
					throw err;
				}
				else {
					// t.commit();
					// return created_association;
					return RelUserRole.findOne({
						where:{
							// Enable:'Y',
							UserAccountId:patient.UserAccountID,
							RoleId:CompanyRole
						},
						transaction:t
					});
				}
			},function(err) {
				// t.rollback();
				throw err;
			})
			.then(function(check_userRole) {
				if(check_userRole == null || check_userRole == ''){
					return RelUserRole.create({
						UserAccountId:patient.UserAccountID,
						RoleId : CompanyRole,
						Enable   : 'Y',
						SiteId : 1,
					},{transaction:t});
				}
				else {
					if(check_userRole.Enable == 'Y') {
						t.rollback();
						var err = new Error("CreateUser.Error");
						err.pushError("UserAccount.Company.HasAssociation");
						throw err;
					}
					else {
						return RelUserRole.update({
							Enable    : 'Y'
						},{
							where:{
								UserAccountId:patient.UserAccountID,
								RoleId : CompanyRole,
							},
							transaction:t
						});
					}
				}
			},function(err) {
				throw err;
			})
			.then(function(success) {
				if(success == null || success == ''){
					t.rollback();
					var err = new Error("CreateUser.Error");
					err.pushError("CreateAssociation.Queryerror");
					throw err;
				}
				else {
					t.commit();
					return success;
				}
			},function(err) {
				t.rollback();
				throw err;
			});
		},function(err) {
			throw err;
		});
	},

	CreateFund : function(data) {
		var CompanyID,FundID;
		if(!data.FundUID || data.FundUID == null || data.FundUID == '') {
			var err = new Error("CreateFund.Error");
			err.pushError("FundUID.invalid.params");
			throw err;
		}
		if(!data.CompanyUID || data.CompanyUID == null || data.CompanyUID == '') {
			var err = new Error("CreateFund.Error");
			err.pushError("CompanyUID.invalid.params");
			throw err;
		}
		return sequelize.transaction()
		.then(function(t) {
			return Company.findOne({
				where: {
					UID : data.CompanyUID
				},
				transaction : t
			})
			.then(function(got_company) {
				if(got_company == null || got_company == ''){
					t.rollback();
					var err = new Error("CreateFund.Error");
					err.pushError("Company.notFound");
					throw err;
				}
				else {
					CompanyID = got_company.ID;
					return Fund.findOne({
						where :{
							UID : data.FundUID
						},
						transaction : t
					});
				}
			},function(err) {
				t.rollback();
				throw err;
			})
			.then(function(got_fund) {
				if(got_fund == null || got_fund == ''){
					t.rollback();
					var err = new Error("CreateFund.Error");
					err.pushError("Fund.notFound");
					throw err;
				}
				else {
					FundID = got_fund.ID;
					return RelFundCompany.findOne({
						where :{
							CompanyID : CompanyID,
							FundID    : FundID
						},
						transaction :t
					});
				}
			},function(err) {
				t.rollback();
				throw err;
			})
			.then(function(got_rel) {
				if(got_rel == null || got_rel == '') {
					return RelFundCompany.create({
						CompanyID : CompanyID,
						FundID    : FundID,
						Active    : 'Y'
					},{transaction : t});
				}
				else {
					if(got_rel.Active == 'N') {
						return RelFundCompany.update({
							Active:'Y'
						},{
							where: {
								CompanyID : CompanyID,
								FundID    : FundID
							},
							transaction : t
						});
					}
					else {
						t.rollback();
						var err = new Error("CreateFund.Error");
						err.pushError("Company.HasAssociation.Fund");
						throw err;
					}
				}
			},function(err) {
				t.rollback();
				throw err;
			})
			.then(function(created) {
				if(created == null || created == ''){
					t.rollback();
					var err = new Error("CreateFund.Error");
					err.pushError("create.Queryerror");
					throw err;
				}
				else {
					t.commit();
					return created;
				}
			},function(err) {
				throw err;
			});
		},function(err) {
			throw err;
		})
	},

	DetailCompanyByUser: function(data) {
		if(!data.uid){
			var err = new Error('DetailCompanyByUser.error');
			err.pushError('Uid.invalid');
			throw err;
		}
		return UserAccount.findOne({
			where: {
				UID : data.uid,
				Enable : 'Y'
			},
			attributes :['ID','UID','PhoneNumber','Email','UserName'],
			include:[
               	{
                    model:RelUserRole,
                    attributes:['RoleId','UserAccountId','SiteId'],
                    where:{
                    	Enable:'Y'
                    },
                    required: false
                }
            ]
		})
		.then(function(got_user){
			if(!got_user){
				var err = new Error('DetailCompanyByUser.error');
				err.pushError('User.notFound');
				throw err;
			}
			else {
				return Patient.findOne({
					where:{
						UserAccountID: got_user.ID
					},
					attributes:['ID','UserAccountID','FirstName','LastName']
				});
			}
		},function(err) {
			throw err;
		})
		.then(function(got_patient){
			if(!got_patient){
				var err = new Error('DetailCompanyByUser.error');
				err.pushError('Patient.notFound');
				throw err;
			}
			else {
				return got_patient.getCompanies();
			}
		},function(err) {
			throw err;
		})
		.then(function(got_company) {
			if(!got_company) {
				var err = new Error('DetailCompanyByUser.error');
				err.pushError('Company.notFound');
				throw err;
			}
			else{
				return got_company;
			}
		},function(err) {
			throw err;
		})
	},

	GetListStaff: function(data) {
		if(!data.uid){
			var err = new Error('GetListStaff.error');
			err.pushError('Uid.invalid');
			throw err;
		}
		return UserAccount.findOne({
			where: {
				UID : data.uid,
				Enable : 'Y'
			},
			attributes :['ID','UID','PhoneNumber','Email','UserName'],
			include:[
               	{
                    model:Role,
                    attributes:['RoleCode'],
                    required: true
                }
            ]
		})
		.then(function(got_user){
			console.log(got_user.Roles[0].RelUserRole);
			if(!got_user){
				var err = new Error('GetListStaff.error');
				err.pushError('User.notFound');
				throw err;
			}
			else {
				var isAdminCompany = false;
				for(var i = 0; i < got_user.Roles.length; i++) {
					if(got_user.Roles[i].RelUserRole.RoleId == CompanyRole && got_user.Roles[i].RelUserRole.Enable == 'Y') {
						isAdminCompany = true;
					}
				}
				if(isAdminCompany == false){
					var err = new Error('GetListStaff.error');
					err.pushError('User.NotAdmin');
					throw err;
				}
				else{
					return got_user;
				}
			}
		},function(err) {
			throw err;
		})
		.then(function(user_isAdmin) {
			return Patient.findOne({
				where:{
					UserAccountID: user_isAdmin.ID
				},
				attributes:['ID','UserAccountID','FirstName','LastName']
			});
		},function(err) {
			throw err;
		})
		.then(function(got_patient){
			if(!got_patient) {
				var err = new Error('GetListStaff.error');
				err.pushError('patient.notFound');
				throw err;
			}
			else {
				return got_patient.getCompanies({where:{Active:'Y'}});
			}
		},function(err){
			throw err;
		})
		.then(function(got_company){
			if(!got_company) {
				var err = new Error('GetListStaff.error');
				err.pushError('Company.notFound');
				throw err;
			}
			else {
				return RelCompanyPatient.findAll({
					where:{
						Active:'Y',
						CompanyID:got_company[0].ID
					},
					limit:data.limit?data.limit:null,
					offset:data.offset?data.offset:null
				});
			}
		},function(err){
			throw err;
		})
		.then(function(got_list){
			if(!got_list) {
				var err = new Error('GetListStaff.error');
				err.pushError('listStaff.notFound');
				throw err;
			}
			else {
				var stringID = [];
				for(var i = 0; i < got_list.length; i++) {
					stringID.push(got_list[i].PatientID);
				}
				return Patient.findAll({
					where:{
						ID:{
							$in: stringID
						}
					}
				});
			}
		},function(err) {
			throw err;
		})
	},

	GetListSite: function(data) {
		if(!data.companyuid) {
			var err = new Error('GetListSite.Error');
			err.pushError('CompanyUID.invalid');
			throw err;
		}
		return Company.findOne({
			where:{
				UID : data.companyuid,
				Enable:'Y'
			},
			attributes:['ID','UID','CompanyName'],
		})
		.then(function(got_company) {
			if(!got_company) {
				var err = new Error('GetListSite.Error');
				err.pushError('Company.notFound');
				throw err;
			}
			else {
				return got_company.getCompanySites();
			}
		},function(err) {
			throw err;
		})
		.then(function(got_site) {
			// console.log(got_site);
			if(!got_site) {
				var err = new Error('GetListSite.Error');
				err.pushError('Site.notFound');
				throw err;
			}
			else {
				return got_site;
			}
		},function(err) {
			throw err;
		})
	},

	GetDetailChild: function(data) {
		var count;
		if(!data) {
			var err = new Error('GetDetailChild.error');
			err.pushError('notFound.params');
			throw err;
		}
		if(!data.UID) {
			var err = new Error('GetDetailChild.error');
			err.pushError('UID.invalid');
			throw err;
		}
		if(!data.model) {
			var err = new Error('GetDetailChild.error');
			err.pushError('model.invalid');
			throw err;
		}

		return Company.findOne({
			attributes:['UID','ID'],
			where: {
				UID : data.UID
			}
		})
		.then(function(got_company) {
			if(!got_company) {
				var err = new Error('GetDetailChild.error');
				err.pushError('Company.notFound');
				throw err;
			}
			else {
				//Fund,Staff,CompanySite,UserAccount
				switch(data.model) {
					case 'Funds' :
						return RelFundCompany.count({
							where:{
								CompanyID: got_company.ID
							}
						})
						.then(function(result) {
							console.log("count ",result);
							count = result;
							return got_company.getFunds({
								where:['RelFundCompany.Active=?','Y'],
								limit:data.limit,
								offset:data.offset
							});
						},function(err) {
							throw err;
						})
						break;

					case 'Patients' :
						var whereClause = {};
						// whereClause = data.Search?data.Search:{};
						if(data.Search) {
							for(var key in data.Search) {
								if(key != 'Gender'){
									whereClause[key] = {
										like: '%' + data.Search[key] + '%'
									};
								}
								else {
									whereClause[key] = data.Search[key];
								}
							}
						}
						return RelCompanyPatient.findAndCountAll({
							include:[
								{
									model:Patient,
									required:true,
									where:whereClause
								}
							],
							where: {
								CompanyID: got_company.ID,
								Active:'Y'
							},
							limit:data.limit,
							offset:data.offset
						})
						.then(function(result){
							console.log("count ",result.count);
							count = result.count;
							var arrId = [];
							for(var i = 0; i < result.rows.length; i++) {
								arrId.push(result.rows[i].PatientID);
							}
							return Patient.findAll({
								include:[
									{
										model:UserAccount,
										include:[
											{
												model:Role,
												attributes:['RoleCode'],
												where:{
													ID: {$in:[CompanyRole,PatientRole]}
												},
												required:true
											}
										],
										attributes:['PhoneNumber','ID'],
										required:true
									}
								],
								where:{
									ID:{$in:arrId}
								}
							})
						},function(err) {
							throw err;
						});
						break;

					case 'CompanySites' :
						var whereClause = {
							CompanyID : got_company.ID,
						};
						if(data.Search){
							for(var key in data.Search) {
								whereClause[key]={
				                    like:'%'+data.Search[key]+'%'
				                }
							}
						}
						return CompanySite.findAndCountAll({
							where:whereClause,
							limit:data.limit,
							offset:data.offset,
							order: data.order
						});
						break;

					case 'UserAccounts' :
						return RelCompanyPatient.count({
							where: {
								CompanyID: got_company.ID
							}
						})
						.then(function(result){
							console.log("count ",result);
							count = result;
							return got_company.getPatients({
								where:['RelCompanyPatient.Active=?','Y'],
								include:[
									{
										model:UserAccount,
										include:[
											{
												model:Role,
												through:{
													where:{
														Enable:'Y'
													}
												},
												attributes:['RoleCode'],
												where: {ID: CompanyRole},
												required:true
											}
										],
										attributes:['PhoneNumber','ID','Email','UserName'],
										required:true
									}
								]
							});
						},function(err) {
							throw err;
						});
						break;

					default :
						break;	
				}

			}
		},function(err) {
			throw err;
		})
		.then(function(result) {
			if(!result) {
				var err = new Error('GetDetailChild.error');
				err.pushError('Model.notFound');
				throw err;
			}
			else {
				if(count)
					result.count = count;
				return result;
			}
		},function(err) {
			throw err;
		});

	},

	CreateCompanyForOnlineBooking: function(data) {
		if(!data) {
			var err = new Error('CreateCompanyForOnlineBooking.error');
			err.pushError('params.Invalid');
			throw err;
		}

		if(!data.companyId) {
			var err = new Error('CreateCompanyForOnlineBooking.error');
			err.pushError('companyId.Invalid');
			throw err;
		}

		if(!data.CompanyName) {
			var err = new Error('CreateCompanyForOnlineBooking.error');
			err.pushError('CompanyName.Invalid');
			throw err;
		}

		return sequelize.transaction()
		.then(function(t) {
			var company;
			if(data.FatherId) {
				return Company.findOne({
					where:{
						IDRefer : data.FatherId,
						Enable  : 'Y',
						Active  : 'Y',
					},
					transaction : t
				})
				.then(function(got_company) {

					if(!got_company) {
						var err = new Error('CreateCompanyForOnlineBooking.error');
						err.pushError('Company.notFound');
						throw err;
					}
					else {
						company = got_company;
						return CompanySite.findOne({
							where:{
								SiteIDRefer : data.companyId,
								CompanyID   : company.ID,
								Enable      : 'Y'
							},
							transaction: t
						});
					}

				},function(err) {
					throw err;
				})
				.then(function(got_site) {
					if(got_site) {
						var err = new Error('CreateCompanyForOnlineBooking.error');
						err.pushError('CompanySite.existed');
						throw err;
					}
					else {
						return CompanySite.create({
							UID         : UUIDService.Create(),
							CompanyID   : company.ID,
							SiteIDRefer : data.companyId,
							SiteName    : data.CompanyName,
							Enable      : 'Y'
						},{transaction:t});
					}
				},function(err) {
					throw err;
				})
				.then(function(created_site) {
					if(!created_site) {
						t.rollback();
						var err = new Error('CreateCompanyForOnlineBooking.error');
						err.pushError('CreateSite.queryError');
						throw err;
					}
					else {
						t.commit();
						return created_site;
					}
				},function(err) {
					t.rollback();
					throw err;
				})
			}
			else {
				return Company.findOne({
					where:{
						IDRefer : data.companyId,
						Enable  : 'Y',
						Active  : 'Y',
					},
					transaction : t
				})
				.then(function(got_company) {
					if(got_company) {
						var err = new Error('CreateCompanyForOnlineBooking.error');
						err.pushError('Company.existed');
						throw err;
					}
					else {
						return Company.create({
							CompanyName : data.CompanyName,
							UID         : UUIDService.Create(),
							IDRefer     : data.companyId,
							Enable      : 'Y',
							Active      : 'Y',
						},{transaction:t});
					}
				},function(err) {
					throw err;
				})
				.then(function(created_company) {
					if(!created_company) {
						var err = new Error('CreateCompanyForOnlineBooking.error');
						err.pushError('CreateCompany.queryError');
						throw err;
					}
					else {
						return CompanySite.create({
							UID         : UUIDService.Create(),
							SiteIDRefer : data.companyId,
							SiteName    : data.CompanyName,
							CompanyID   : created_company.ID,
							Enable      : 'Y',

						},{transaction:t});
					}
				},function(err) {
					throw err;
				})
				.then(function(created_site) {
					if(!created_site) {
						t.rollback();
						var err = new Error('CreateCompanyForOnlineBooking.error');
						err.pushError('CreateCompanySite.queryError');
						throw err;
					}
					else {
						t.commit();
						return created_site;
					}
				},function(err) {
					t.rollback();
					throw err;
				});
			}
		},function(err) {
			throw err;
		});
	},

	Test: function() {
		// var model = sequelize.models[data.model];
		console.log(sequelize.models['Company'].getAssociation());
	},


};