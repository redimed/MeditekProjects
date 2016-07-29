var o = require('../HelperService');
module.exports = function(data) {
	if(!data) {
		var err = new Error('createFormByUpload.error');
		err.pushError('notFound.Params');
		throw err;
	}
	if(!data.fileUID) {
		var err = new Error('createFormByUpload.error');
		err.pushError('notFound.fileUID.Params');
		throw err;
	}
	if(!data.fileName) {
		var err = new Error('createFormByUpload.error');
		err.pushError('notFound.fileName.Params');
		throw err;
	}
	if(!data.fileExt) {
		var err = new Error('createFormByUpload.error');
		err.pushError('notFound.fileExt.Params');
		throw err;
	}
	if(!data.patientUID) {
		var err = new Error('createFormByUpload.error');
		err.pushError('notFound.patientUID.Params');
		throw err;
	}
	var promise = new Promise(function(a, b) {
		var patient, eform;
		var item_length = 0;
		sequelize.transaction()
		.then(function(t) {

			Patient.findOne({
				attributes:['ID','UID','UserAccountID','FirstName','LastName'],
				where: {
					UID : data.patientUID,
				},
				transaction: t,
			})
			.then(function(got_patient) {
				if(got_patient == null || got_patient == '') {
					var err = new Error('createFormByUpload.error');
					err.pushError('notFound.Patient');
					throw err;
				}
				else {
					patient = got_patient;
					var uid = UUIDService.Create();
					return EForm.create({
						UID 			: uid,
						EFormTemplateID : o.const.ImportTemplate,
						Name 			: data.fileName,
						Status			: 'saved',
						Enable			: 'Y',
						Note 			: data.fileUID + '.' + data.fileExt,
						CreatedBy		: patient.UserAccountID,
					},{transaction: t});
				}
			}, function(err) {
				throw err;
			})
			.then(function(created_eform) {
				if(created_eform == '' || created_eform == null) {
					var err = new Error('createFormByUpload.error');
					err.pushError('CreateError.WhenCreateEForm');
					throw err;
				}
				else {
					eform = created_eform;
					return EFormData.create({
						UID 		: UUIDService.Create(),
						EFormID 	: created_eform.ID,
						FormData	: data.fileUID,
						TempData	: data.fileUID,
						CreatedBy	: patient.UserAccountID,
					},{transaction: t});
				}
			}, function(err) {
				throw err;
			})
			.then(function(created_eformData) {
				if(created_eformData == '' || created_eformData == null) {
					var err = new Error('createFormByUpload.error');
					err.pushError('CreateError.WhenCreateEFormData');
					throw err;
				}
				else {
					return eform.addPatient(patient.ID,{
                            transaction: t
                    })
				}
			}, function(err) {
				throw err;
			})
			.then(function(created_relEFormPatient) {
				if(created_relEFormPatient == '' || created_relEFormPatient == null) {
					var err = new Error('createFormByUpload.error');
					err.pushError('CreateError.WhenCreateRelPatientEForm');
					throw err;
				}
				else {
					if(data.arr_ApptUID && data.arr_ApptUID != null && data.arr_ApptUID != '') {
						var arr_ApptUID = [];
						for(var i = 0; i < data.arr_ApptUID.length; i++) {
							data.arr_ApptUID[i].EFormID = eform.ID;
							// data.arr_ApptUID[i].AppointmentID = data.arr_ApptUID[i].UID;
							arr_ApptUID.push(data.arr_ApptUID[i].UID);
							item_length++;
						}
						return Appointment.findAll({
							attributes: ['ID','UID','Code'],
							where : {
								UID : { $in : arr_ApptUID }
							},
							transaction : t,
						});
					}
					else {
						return created_relEFormPatient;
					}
				}
			}, function(err) {
				throw err;
			})
			.then(function(got_appts) {
				if(data.arr_ApptUID && data.arr_ApptUID != null && data.arr_ApptUID != '') {
					if(got_appts == null || got_appts == '' || got_appts.length != item_length) {
						var err = new Error('createFormByUpload.error');
						err.pushError('Err.whenCheckAppt');
						throw err;
					}
					else {
						for(var i = 0; i < got_appts.length; i++) {
							data.arr_ApptUID[i].AppointmentID = got_appts[i].ID;
						}
						return RelEFormAppointment.bulkCreate(data.arr_ApptUID,{
							transaction: t,
							individualHooks: true,
						});
					}
				}
				else {
					return got_appts;
				}
			}, function(err) {
				throw err;
			})
			.then(function(finish) {
				if(finish == '' || finish == null) {
					var err = new Error('createFormByUpload.error');
					err.pushError('CreateError.QreryError');
					t.rollback();
					b(err);
				}
				else {
					t.commit();
					a(finish);
				}
			}, function(err) {
				b(err);
			})

		}, function(err) {
			b(err);
		})
	});
	return promise;
};