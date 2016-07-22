var _ = require('lodash');
module.exports = function(data) {
	if(!Array.isArray(data)) {
		var err = new Error('transferData.WrongFormat');
		throw err;
	}
	for(var i = 0; i < data.length; i++) {
		if(data[i].detailEmployer) {
			data[i].detailEmployer = JSON.parse(data[i].detailEmployer);
		}
	}
	var arr_id = [];
	
	function ParseData(info) {
		var obj = {};
		obj.CompanySite = {Data:{}};
		for(var key in info) {
			if(key == 'id') {
				obj.IDRefer = info[key];
			}
			else if(key == 'name') {
				obj.CompanyName = info[key];
			}
			else if(key == 'code') {
				obj.Code = info[key];
			}
			else if(key == 'IMA') {
				obj.CompanySite.IMA = info[key];
			}
			else if(key == 'email') {
				obj.CompanySite.Email = info[key];
			}
			else if(key == 'address') {
				obj.CompanySite.Address1 = info[key];
			}
			else if(key == 'phone') {
				obj.CompanySite.HomePhoneNumber = info[key];
			}
			else if(key == 'sname') {
				obj.CompanySite.SiteName = info[key];
			}
			else if (key == 'smphone') {
				obj.CompanySite.PhoneNumber = info[key];
			}
			else if(key == 'insurer') {
				obj.CompanySite.Data.insurer = info[key];
			}
			else if(key == 'sms') {
				obj.CompanySite.Data.sms = info[key];
			}
			else if(key == 'smedic') {
				obj.CompanySite.Data.smedic = info[key];
			}
			else if(key == 'detailEmployer') {
				obj.CompanySite.Data.detailEmployer = info[key];
			}
		}
		return obj;
	};

	function CreateCompany(info, transaction) {
		var p = new Promise(function(a, b) {
			var IDRefer = info.IDRefer;
			info.UID = UUIDService.Create();
			info.Enable = 'Y';
			info.Active = 'Y';
			info.Description = 'Import from Redisite';
			Company.create(info,{transaction: transaction})
			.then(function(created_company) {
				if(!created_company) {
					var err = new Error('transferData.CreateCompany.Error');
					throw err;
				}
				else {
					info.CompanySite.SiteIDRefer = IDRefer;
					info.CompanySite.CompanyID  = created_company.ID;
					info.CompanySite.UID = UUIDService.Create();
					info.CompanySite.Data = JSON.stringify(info.CompanySite.Data);
					info.CompanySite.Enable = 'Y';
					return CompanySite.create(info.CompanySite,{transaction: transaction});
				}
			}, function(err) {
				throw err;
			})
			.then(function(created_site) {
				if(!created_site) {
					var err = new Error('transferData.CreateCompanySite.Error');
					throw err;
				}
				else {
					a(created_site);
				}
			}, function(err) {
				b(err);
			})
		});
		return p;
	};

	function UpdateCompany(info, transaction) {
		var p = new Promise(function(a, b) {
			var IDRefer = info.IDRefer;
			Company.update(info,{
				where: {
					IDRefer : IDRefer
				},
				transaction: transaction,
			})
			.then(function(updated_company) {
				if(!updated_company) {
					var err = new Error('transferData.UpdateCompany.Error');
					throw err;
				}
				else {
					info.CompanySite.SiteIDRefer = IDRefer;
					info.CompanySite.Data = JSON.stringify(info.CompanySite.Data);
					return CompanySite.update(info.CompanySite,{
						where: {
							SiteIDRefer : IDRefer
						},
						transaction: transaction,
					});
				}
			}, function(err) {
				throw err;
			})
			.then(function(updated_site) {
				if(!updated_site) {
					var err = new Error('transferData.UpdateCompanySite.Error');
					throw err;
				}
				else {
					a(updated_site);
				}
			}, function(err) {
				b(err);
			})
		});
		return p;
	};

	function prommise_checkIDReferCompany(dataArr, transaction) {
		var p = new Promise(function(a, b) {
			var OnlineBooking_id = [];
			var Redisite_id = [];
			Company.findAll({
				where : {
					IDRefer : {$in: dataArr}
				},
				transaction: transaction,
			})
			.then(function(got_company) {
				// a(got_company);
				if(got_company.length == 0) {
					a(got_company);
				}
				else {
					for(var i = 0; i < got_company.length; i++) {
						if(got_company[i].Description === 'Import from OnlineBooking') {
							OnlineBooking_id.push(got_company[i].IDRefer);
						}
						else if(got_company[i].Description === 'Import from Redisite') {
							Redisite_id.push(got_company[i].IDRefer);
						}
					}
					a({Redisite: Redisite_id, OnlineBooking: OnlineBooking_id});
				}
			}, function(err) {
				b(err);
			});
		});
		return p;
	};

	function prommise_checkIDReferSite(dataArr, transaction) {
		var OnlineBooking_id = [];
		var Redisite_id = [];
		var p = new Promise(function(a, b) {
			CompanySite.findAll({
				where : {
					SiteIDRefer : {$in: dataArr}
				},
				transaction: transaction,
			})
			.then(function(got_companySite) {
				// a(got_companySite);
				if(got_companySite.length == 0) {
					return got_companySite;
				}
				else {
					var id = [];
					for(var i = 0; i < got_companySite.length; i++) {
						id.push(got_companySite[i].CompanyID);
					}
					return Company.findAll({
						where: {
							ID : {$in:id}
						},
						transaction: transaction
					});
				}
			}, function(err) {
				// b(err);
				throw err;
			})
			.then(function(got_company) {
				if(got_company.length == 0) {
					a(got_company);
				}
				else {
					for(var i = 0; i < got_company.length; i++) {
						if(got_company[i].Description === 'Import from OnlineBooking') {
							OnlineBooking_id.push(got_company[i].IDRefer);
						}
						else if(got_company[i].Description === 'Import from Redisite') {
							Redisite_id.push(got_company[i].IDRefer);
						}
					}
					a({Redisite: Redisite_id, OnlineBooking: OnlineBooking_id});
				}
			}, function(err) {
				b(err);
			});
		});
		return p;
	};

	function promise_processRedisite(Redisite_arrId, transaction) {
		var p = new Promise(function(a, b) {
			var Redisite_data = [];
			var count = 0;
			for(var i = 0; i < data.length; i++) {
				for(var j = 0; j < Redisite_arrId.length; j++) {
					if(data[i].id == Redisite_arrId[j]) {
						var obj = ParseData(data[i]);
						var promise = UpdateCompany(obj, transaction);
						Redisite_data.push(promise);
						count++;
					}
				}
			}
			if(Redisite_data.length == 0) {
				a(null);
			}
			else {
				Promise.all(Redisite_data)
				.then(function(updated) {
					a({update:updated,count:count});
				}, function(err) {
					b(err);
				});
			}
		});
		return p;
	}

	function promise_processDefault(default_arrId, transaction) {
		var p = new Promise(function(a, b) {
			var default_data = [];
			var count = 0;
			for(var i = 0; i < data.length; i++) {
				for(var j = 0; j < default_arrId.length; j++) {
					if(data[i].id == default_arrId[j]) {
						var obj = ParseData(data[i]);
						var promise = CreateCompany(obj, transaction);
						default_data.push(promise);
						count++;
					}
				}
			}
			if(default_data.length == 0) {
				a(null);
			}
			else {
				Promise.all(default_data)
				.then(function(created) {
					a({import:created,count:count});
				}, function(err) {
					b(err);
				});
			}
		});
		return p;
	}

	var p = new Promise(function(a, b) {
		for(var i = 0; i < data.length; i++) {
			arr_id.push(data[i].id);
		}
		sequelize.transaction()
		.then(function(t) {
			var p_checkIDReferCompany = prommise_checkIDReferCompany(arr_id, t);
			var p_checkIDReferSite = prommise_checkIDReferSite(arr_id, t);
			Promise.all([p_checkIDReferCompany, p_checkIDReferSite])
			.then(function(values) {
				// t.commit();
				console.log("adasasd");
				console.log("values ",values);
				var Redisite_arrId  = [];
				var OnlineBooking_arrId = [];
				var merge_arrId = [];
				if(values[0].length != 0 || values[1].length != 0) {
					Redisite_arrId  = _.uniq(values[0].Redisite.concat(values[1].Redisite));
					OnlineBooking_arrId = _.uniq(values[0].OnlineBooking.concat(values[1].OnlineBooking));
					merge_arrId = _.uniq(Redisite_arrId.concat(OnlineBooking_arrId));
				}
				else {
					merge_arrId = [];
				}
				var default_arrId = [];
				for(var i = 0; i < arr_id.length; i++) {
					var isCheck = false;
					for(var j = 0; j < merge_arrId.length; j++) {
						if(arr_id[i] == merge_arrId[j])
							isCheck = true;
					}
					if(isCheck == false) {
						default_arrId.push(arr_id[i]);
					}
				}
				console.log(" ???")
				console.log("Redisite_arrId ",Redisite_arrId);
				console.log("OnlineBooking_arrId ",OnlineBooking_arrId);
				console.log("default_arrId ",default_arrId);

				var p_processRedisite = promise_processRedisite(Redisite_arrId);
				var p_processDefault  = promise_processDefault(default_arrId, t);

				Promise.all([p_processRedisite, p_processDefault])
				.then(function(finish) {
					t.commit();
					a({message:"success",changed:finish,forOnlineBooking:OnlineBooking_arrId});
				}, function(err) {
					t.rollback();
					b(err);
				})
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