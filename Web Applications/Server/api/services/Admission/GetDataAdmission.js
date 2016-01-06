module.exports = {
    PatientAdmission: function(data, userID) {
        if (HelperService.CheckExistData(data) &&
            !_.isEmpty(data)) {
            _.forEach(data, function(valueAdmission, indexPatientAdmission) {
                if (HelperService.CheckExistData(valuePatientAdmission) &&
                    HelperService.CheckExistData(valuePatientAdmission.UID)) {
                    data[indexPatientAdmission].CreatedBy = userID;
                } else if (HelperService.CheckExistData(valuePatientAdmission) &&
                    !HelperService.CheckExistData(valuePatientAdmission.UID)) {
                    data[indexPatientAdmission].CreatedBy = userID;
                    data[indexPatientAdmission].UID = UUIDService.Create();
                }
            });
        }
        return data;
    },
    PatientAdmissionData: function(data, userID) {
        if (HelperService.CheckExistData(data) &&
            !_.isEmpty(data)) {
            _.forEach(data, function(valuePatientAdmissionData, indexPatientAdmissionData) {
                if (HelperService.CheckExistData(valuePatientAdmissionData) &&
                    HelperService.CheckExistData(valuePatientAdmissionData.UID)) {
                    data[indexPatientAdmissionData].CreatedBy = userID;
                } else if (HelperService.CheckExistData(valuePatientAdmissionData) &&
                    !HelperService.CheckExistData(valuePatientAdmissionData.UID)) {
                    data[indexPatientAdmissionData].CreatedBy = userID;
                    data[indexPatientAdmissionData].UID = UUIDService.Create();
                }
            });
        }
        return data;
    }
};
