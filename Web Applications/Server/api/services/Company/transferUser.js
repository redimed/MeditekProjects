var _ = require('lodash');
//generator Password
var generatePassword = require('password-generator');
module.exports = function(data) {
	if(!Array.isArray(data)) {
		var err = new Error('transferUser.WrongFormat');
		throw err;
	}
	for(var i = 0; i < data.length; i++) {
		if(data[i].detail) {
			data[i].detail = JSON.parse(data[i].detail);
			if(data[i].detail.drsign) delete data[i].detail['drsign'];
		}
		if(data[i].deviceId)
			delete data[i]['deviceId'];
	}

	function getUserInfo(info) {
		var obj = {};
		for(var key in info) {
			if(key == 'username') obj.UserName = info[key];
			// if(key == 'email') obj.Email  = info[key];
			if(key == 'companyId') obj.CompanyID = info[key];
		}
		obj.UID = UUIDService.Create();
		obj.Enable = 'Y';
		obj.Activated = 'Y';
		obj.Password = generatePassword(6, false,/[\w\d]/);
		obj.PinNumber = generatePassword(6, false,/\d/);
		obj.ExpiryPin = 5;
		return obj;
	}

	function getPatientInfo(info) {
		var obj = {};
		obj.UID = UUIDService.Create();
		obj.Enable = 'Y';
		for(var key in info) {
			if(key == 'name') {
				obj.FirstName = info[key].substr(0, info[key].indexOf(' '));
				obj.LastName = info[key].substr(info[key].indexOf(' '), info[key].length);
			}
			else if(key == 'email') obj.Email1 = info[key];
			else if(key == 'address') obj.Address1 = info[key];
			else if(key == 'phone') {
				obj.PhoneNumber     = info[key].replace(/\s+/g, '');
				obj.WorkPhoneNumber = info[key].replace(/\s+/g, '');
			}
		}
		return obj;
	}

	function Create(obj, transaction) {
		var notFoundCompany = false;
		var promise_create = new Promise(function(a, b) {
			var user, patient,company;
			var userInfo = getUserInfo(obj);
			var patientInfo    = getPatientInfo(obj.detail);
			if(obj.email) patientInfo.Email2 = obj.email;
			Services.UserAccount.CreateUserAccount(userInfo, transaction)
			.then(function(created_user) {
				if(!created_user) {
					var err = new Error('Create.queryErrorWhenCreateUser');
					throw err;
				}
				else {
					user = created_user;
					patientInfo.UserAccountID = created_user.ID;
					return Patient.create(patientInfo,{transaction: transaction});
					// a(created);
				}
			}, function(err) {
				// b(err);
				throw err;
			})
			.then(function(created_patient) {
				if(!created_patient) {
					var err = new Error('Create.queryErrorWhenCreatePatient');
					throw err;
				}
				else {
					// a(user);
					patient = created_patient;
					return Company.findOne({
						attributes:['ID','UID','Code','CompanyName'],
						where :{
							IDRefer : userInfo.CompanyID
						},
						transaction : transaction
					});
					
				}
			}, function(err) {
				throw err;
			})
			.then(function(got_company) {
				company = got_company;
				if(!got_company) {
					notFoundCompany = true;
					return RelUserRole.bulkCreate(
						[
							{UserAccountId: user.ID, RoleId: 3, SiteId:1, Enable: 'Y'},
						],
						{
							transaction: transaction,
							individualHooks: true
						}
					);
				}
				else {
					return RelUserRole.bulkCreate(
						[
							{UserAccountId: user.ID, RoleId: 3, SiteId:1, Enable: 'Y'},
							{UserAccountId: user.ID, RoleId: 6, SiteId:1, Enable: 'Y'},
						],
						{
							transaction: transaction,
							individualHooks: true
						}
					);
					
				}
			}, function(err) {
				throw err;
			})
			.then(function(created_role) {
				if(!created_role) {
					var err = new Error('Create.queryErrorWhenCreateRole');
					throw err;
				}
				else {
					if(notFoundCompany == false) {
						return RelCompanyPatient.create({
							PatientID : patient.ID,
							CompanyID : company.ID,
							Active    : 'Y',
						},{transaction: transaction});
					}
					else {
						return created_role;
					}
					
				}
			}, function(err) {
				throw err;
			})
			.then(function(created_relCompany) {
				if(!created_relCompany) {
					var err = new Error('Create.queryErrorWhenCreateRelCompany');
					b(err);
				}
				else {
					if(notFoundCompany == true) {
						a({message:'notFoundCompany',data:obj});
					}
					else {
						a(patient);
					}
				}
			}, function(err) {
				b({err:err,data:obj});
			})

		});
		return promise_create;
	}

	var p = new Promise(function(a, b) {
		var p_array = [];
		sequelize.transaction()
		.then(function(t) {
			for(var i = 0; i < data.length; i++) {
				p_array.push(Create(data[i], t));
			}
			Promise.all(p_array)
			.then(function(values) {
				t.commit();
				a(values);
			}, function(err) {
				t.rollback();
				b(err);
			})
		}, function(err) {
			b(err);
		})
	});
	return p;

};