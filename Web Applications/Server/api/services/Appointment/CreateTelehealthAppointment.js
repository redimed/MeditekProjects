module.exports = function(data) {
    var $q = require('q');
    var dataAppt = Services.GetDataAppointment.Appointment(data);
    dataAppt.UID = UUIDService.Create();
    return sequelize.transaction()
        .then(function(t) {
            var defer = $q.defer();
            //create new appointment
            Appointment.create(dataAppt, {
                    transaction: t
                })
                .then(function(apptCreated) {
                    /*create new TelehealthAppointment link with 
                    appointment created via AppointmentID */
                    var dataTeleAppt = Services.GetDataAppointment.TelehealthAppointment(data);
                    return apptCreated.createTelehealthAppointment(dataTeleAppt, {
                        transaction: t
                    });
                }, function(err) {
                    defer.reject({
                        transaction: t,
                        error: err
                    });
                })
                .then(function(telehealthApptCreated) {
                    /*create new PatientAppointment link with TelehealthAppointment 
                    created via TelehealthAppointmentID*/
                    var dataPatientAppt = Services.GetDataAppointment.PatientAppointment(data);
                    return telehealthApptCreated.createPatientAppointment(dataPatientAppt, {
                        transaction: t
                    });
                }, function(err) {
                    defer.reject({
                        transaction: t,
                        error: err
                    });
                })
                .then(function(patientApptCreated) {
                    /*create new ExaminationRequired link with TelehealthAppointment
                    created via TelehealthAppointmentID*/
                    var dataExamniationRequired = Services.GetDataAppointment.ExamniationRequired(data);
                    return telehealthApptCreated.createExaminationRequired(dataExamniationRequired, {
                        transaction: t
                    });

                }, function(err) {
                    defer.reject({
                        transaction: t,
                        error: err
                    });
                })
                .then(function(examinationRequiredCreated) {
                    /*create new list TelehealthClinicalDetails
                    link with TelehealthAppointment via TelehealthAppointmentID*/
                    var dataPrefPlasSurgon = Services.GetDataAppointment.PrefPlasSurgon(data);
                    telehealthApptCreated.createPreferedPlasticSurgeon(dataPrefPlasSurgon, {
                        transaction: t
                    });
                }, function(err) {
                    defer.reject({
                        transaction: t,
                        error: err
                    });
                })
                .then(function(prefPlasSurgonCreated) {
                    /*create new list TelehealthClinicalDetails
                    link with TelehealthAppointment via TelehealthAppointmentID*/
                    var teleApptID = (!_.isUndefined(telehealthApptCreated.dataValues) ? telehealthApptCreated.dataValues.ID : null);
                    var dataTeleClinicDetail = Services.GetDataAppointment.TeleApptDetail(teleApptID, data);
                    return ClinicalDetail.bulkCreate(dataTeleClinicDetail, {
                        transaction: t
                    });
                })
                .then(function(clinicalDetailCreated) {
                    defer.resolve({
                        transaction: t,
                        status: 'success'
                    });
                }, function(err) {
                    defer.reject({
                        transaction: t,
                        error: err
                    });
                })
            return defer.promise;
        });
};
