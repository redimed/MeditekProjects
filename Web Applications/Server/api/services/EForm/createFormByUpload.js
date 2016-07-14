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
	if(!data.patientUID) {
		var err = new Error('createFormByUpload.error');
		err.pushError('notFound.patientUID.Params');
		throw err;
	}
	var promise = new Promise(function(a, b) {
		var patient, eform;
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
						Note 			: data.fileUID,
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
					return RelEFormPatient.create({
						EFormID 	: eform.ID,
						PatientID 	: patient.ID,
					},{transaction: t});
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
					if(data.ApptUID && data.ApptUID != null && data.ApptUID != '') {
						return Appointment.findOne({
							attributes: ['ID','UID','Code'],
							where : {
								UID : data.ApptUID,
							},
							transaction: t,
						})
						.then(function(got_appt) {
							if(got_appt == '' || got_appt == null) {
								var err = new Error('createFormByUpload.error');
								err.pushError('CreateError.WhenCreateRelAppointmentEForm');
								throw err;
							}
							else {
								return RelEFormAppointment.create({
									EFormID 		: eform.ID,
									AppointmentID 	: got_appt.ID,
								},{transaction: t});
							}
						}, function(err) {
							throw err;
						})
					}
					else {
						return created_relEFormPatient;
					}
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