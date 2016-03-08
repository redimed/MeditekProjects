var $q = require('q');
var moment = require('moment');
var check  = require('../HelperService');
var generatePassword = require('password-generator');
var config = sails.config.myconf;
var secret = 'ewfn09qu43f09qfj94qf*&H#(R';
var twilioClient = require('twilio')(config.twilioSID, config.twilioToken);
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
				include:[
					{
						all:true,

						required:false
					},
					{
						model:Patient,
						through:
						{

							required:true
						},
						required:false
					}
				],
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
					// returnData.Company = got_company;
					// return CompanySite.findAll({
					// 	where :{
					// 		CompanyID : got_company.ID,
					// 		Enable    : 'Y'
					// 	},
					// 	transaction: t
					// });
					t.commit();
					return got_company;
				}

			},function(err) {
				t.rollback();
				throw err;
			})
			// .then(function(got_companysite) {
			// 	if(got_companysite != null && got_companysite != ''){
			// 		t.commit();
			// 		returnData.CompanySite = got_companysite;
			// 		return returnData;
					
			// 	}
			// 	else {
			// 		return returnData;
			// 	}
			// },function(err) {
			// 	t.rollback();
			// 	throw err;
			// });

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
			where: {
				UID : data.UID
			}
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
											RoleId        : 6
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
			return model.findOne({
				where:{
					// UID: data.info.UID,
					$and: data.whereClauses
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
					// delete data.info['UID'];
					return model.update(
						data.info
					,{
						where:{
							$and: data.whereClauses
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
					t.rollback();
					var err = new Error("CreateStaff.Error");
					err.pushError("CreateAssociation.Queryerror");
					throw err;
				}
				else {
					t.commit();
					return created_association;
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

	Test: function() {
		// var model = sequelize.models[data.model];
		console.log(sequelize.models['Company'].getAssociation());
	}

};