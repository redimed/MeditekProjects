angular.module("app.authentication.WAAppointment.services", [])
    .factory("WAAppointmentService", function(Restangular) {
        var services = {};
        var api = Restangular.all("api");
        services.RequestWAApointment = function(requestInfo) {
            return api.all('appointment-wa-request').post({
                data: requestInfo
            });
        }
            //load list WAappointment
        services.loadListWAAppointment = function(data) {
            return api.all("appointment-wa-list").post({
                data: data
            });
        };
         services.loadListWAAppointmentConsultation = function(data) {
            return api.all("appointment-wa-list/consultation").post({
                data: data
            });
        };
        //load detail WAappointment
        services.getDetailWAAppointmentByUid = function(UID) {
            return api.one("appointment-wa-detail/" + UID).get();
        };
        //update wa
        services.updateWaAppointment = function(data) {
            return api.all("appointment-wa-update").post({
                data: data
            });
        };
        services.ListDoctor = function() {
            return api.one('doctorappointment').get();
        };
        services.getDoctorById = function(data) {
            return api.all('doctorIdappointment').post({
                data: data
            });
        };
        services.GetDetailPatientByUid = function(data) {
            return api.all('patient/detail-patient').post({
                data: data
            });
        };
        return services;
    });
