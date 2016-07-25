var _ = require('lodash');
var o = require("../HelperService");
module.exports = function(data, userLogin) {
	if(!data) {
		var err = new Error('updateUserData.error');
		err.pushError('notFound.params');
		throw err;
	}

	if(!data.data) {
		var err = new Error('updateUserData.error');
		err.pushError('notFound.data.params');
		throw err;
	}

	if(!data.type) {
		var err = new Error('updateUserData.error');
		err.pushError('notFound.type.params');
		throw err;
	}

	function CheckUserName(UserName, transaction) {
		var p = new Promise(function(a, b) {
			UserAccount.findOne({
				attributes:['ID','UID'],
				where : { UserName : UserName },
				transaction : transaction
			})
			.then(function(got_user) {
				if(!got_user) {
					a(null);
				}
				else {
					a('UserName');
				}
			}, function(err) {
				b(err);
			})
		});

		return p;
	}

	function CheckPhoneNumber(PhoneNumber, transaction) {
		var p = new Promise(function(a, b) {
			var auPhoneNumberPattern=new RegExp(o.regexPattern.auPhoneNumber);
			PhoneNumber = PhoneNumber.replace(o.regexPattern.phoneExceptChars,'');
			if(!auPhoneNumberPattern.test(PhoneNumber)) {
				var err = new Error('updateUserData.error');
				err.pushError('PhoneNumber.invalid');
				b(err);
			}
			else {
				UserAccount.findOne({
					attributes:['ID','UID'],
					where : { PhoneNumber : PhoneNumber },
					transaction : transaction
				})
				.then(function(got_user) {
					if(!got_user) {
						a(null);
					}
					else {
						a('PhoneNumber');
					}
				}, function(err) {
					b(err);
				})
			}
		});

		return p;
	}

	function CheckEmail(Email, transaction) {
		var p = new Promise(function(a, b) {
			var emailPattern = new RegExp(o.regexPattern.email);
			if(Email && !emailPattern.test(Email)){
				var err = new Error('updateUserData.error');
				err.pushError('Email.invalid');
				b(err);
			}
			else {
				UserAccount.findOne({
					attributes:['ID','UID'],
					where : { Email : Email },
					transaction : transaction
				})
				.then(function(got_user) {
					if(!got_user) {
						a(null);
					}
					else {
						a('Email');
					}
				}, function(err) {
					b(err);
				})
			}
		});

		return p;
	}

	function updatePatient(patientInfo, UID, transaction) {
		var p = new Promise(function(a, b) {
			for(var key in patientInfo) {
				if(key == '' || key == null) {
					delete patientInfo[key];
				}
				if(key == 'Email') {
					patientInfo.Email1 = patientInfo[key];
				}
			}
			Patient.update(patientInfo, {
				where : { UID : UID },
				transaction : transaction
			})
			.then(function(updated) {
				if(!updated) {
					var err = new Error('updateUserData.error');
					err.pushError('updatePatient.QueryError');
					b(err);
				}
				else {
					a('updatedPatient');
				}
			}, function(err) {
				b(err);
			})
		});

		return p;
	}

	function updateDoctor(doctorInfo, transaction) {
		var p = new Promise(function(a, b) {
			for(var key in doctorInfo) {
				if(key == '' || key == null) {
					delete doctorInfo[key];
				}
			}
			Doctor.update(doctorInfo, {
				where : { UID : UID },
				transaction : transaction
			})
			.then(function(updated) {
				if(!updated) {
					var err = new Error('updateUserData.error');
					err.pushError('updateDoctor.QueryError');
					b(err);
				}
				else {
					a('updatedDoctor');
				}
			}, function(err) {
				b(err);
			})
		});
		
		return p;
	}

	var p = new Promise(function(a, b) {
		var user;
		var userUID;
		sequelize.transaction()
		.then(function(t) {
			if(!userLogin) {
				var err = new Error('updateUserData.error');
				err.pushError('notFound.loginUser');
				b(err);
			}
			else {
				var isAdmin = false;
				for(var i = 0; i < userLogin.roles.length; i++) {
					if(userLogin.roles[i].RoleCode == 'ADMIN') {
						isAdmin = true;
					}
				}
				console.log("isAdmin ",isAdmin)
				if(isAdmin == false) {
					data.data.UID = userLogin.UID;
				}
				userUID = data.data ? data.data.UID : null;
				UserAccount.findOne({
					attributes:['ID','UID'],
					where: {
						UID    : userUID,
						Enable : 'Y', 
					},
					include:[
						{
							model:Patient,
							attributes:['ID','UID','PhoneNumber','Email1'],
							required:false,
						},
						{
							model:Doctor,
							attributes:['ID','UID','Email'],
							required:false,
						}
					],
					transaction: t,
				})
				.then(function(got_user) {
					if(!got_user) {
						var err = new Error('updateUserData.error');
						err.pushError('notFound.User');
						throw err;
					}
					else {
						user = got_user;
						delete data.data['UID'];
						delete data.data['ID'];
						delete data.data['Enable'];
						delete data.data['Activated'];
						delete data.data['ExpiryPin'];
						delete data.data['PinNumber'];
						for(var key in data.data) {
							if(data.data[key] == null || data.data[key] == '') {
								delete data.data[key];
							}
						}
						var arr_checkDataPromise = [];
						for(var key in data.data) {
							if(key == 'UserName' && data.data[key] != null && data.data[key] != '') {
								arr_checkDataPromise.push(CheckUserName(data.data[key], t));
							}
							if(key == 'PhoneNumber' && data.data[key] != null && data.data[key] != '') {
								arr_checkDataPromise.push(CheckPhoneNumber(data.data[key], t));
							}
							if(key == 'Email' && data.data[key] != null && data.data[key] != '') {
								arr_checkDataPromise.push(CheckEmail(data.data[key], t));
							}
						}
						return Promise.all(arr_checkDataPromise);
					}
				}, function(err) {
					throw err;
				})
				.then(function(values) {
					if(values.length == 0) {
						var err = new Error('updateUserData.error');
						err.pushError('notFound.data.toUpdate');
						throw err;
					}
					else {
						var arr_err = values.filter(function(item) {
							return item !== null;
						});
						if(arr_err.length == 0) {
							return user;
						}
						else {
							var err = new Error('updateUserData.error.duplicate');
							err.pushErrors(arr_err);
							throw err;
						}
					}
				}, function(err) {
					throw err;
				})
				.then(function(checked_data) {
					// a(checked_data);
					return UserAccount.update(data.data,{
						where: {
							UID : userUID
						},
						transaction : t
					});
				}, function(err) {
					// b(err);
					throw err;
				})
				.then(function(updated) {
					if(updated == null || updated == '' || updated.length == 0) {
						var err = new Error('updateUserData.error');
						err.pushError('updateUser.QueryError');
						t.rollback();
						b(err);
					}
					else {
						// t.commit();
						var arr_updatedChild = [];
						if(user.Patient != null) {
							arr_updatedChild.push(updatePatient(data.data, user.Patient.UID, t));
						}
						if(user.Doctor != null) {
							arr_updatedChild.push(updateDoctor(data.data, user.Patient.UID, t));
						}
						return Promise.all(arr_updatedChild);
						// a(updated);
					}
				}, function(err) {
					// t.rollback();
					// b(err);
					throw err;
				})
				.then(function(updated_child) {
					t.commit();
					a(updated_child);
				}, function(err) {
					t.rollback();
					b(err);
				})

			}


		}, function(err) {
			b(err);
		})
	});

	return p;
};