module.exports = {
    Admission: function(data, userID) {
        if (HelperService.CheckExistData(data) &&
            !_.isEmpty(data)) {
            _.forEach(data, function(valueAdmission, indexAdmission) {
                if (HelperService.CheckExistData(valueAdmission) &&
                    HelperService.CheckExistData(valueAdmission.UID)) {
                    data[indexAdmission].CreatedBy = userID;
                } else if (HelperService.CheckExistData(valueAdmission) &&
                    !HelperService.CheckExistData(valueAdmission.UID)) {
                    data[indexAdmission].CreatedBy = userID;
                    data[indexAdmission].UID = UUIDService.Create();
                }
            });
        }
        return data;
    },
    AdmissionData: function(data, userID) {
        if (HelperService.CheckExistData(data) &&
            !_.isEmpty(data)) {
            _.forEach(data, function(valueAdmissionData, indexAdmissionData) {
                if (HelperService.CheckExistData(valueAdmissionData) &&
                    HelperService.CheckExistData(valueAdmissionData.UID)) {
                    data[indexAdmissionData].CreatedBy = userID;
                } else if (HelperService.CheckExistData(valueAdmissionData) &&
                    !HelperService.CheckExistData(valueAdmissionData.UID)) {
                    data[indexAdmissionData].CreatedBy = userID;
                    data[indexAdmissionData].UID = UUIDService.Create();
                }
            });
        }
        return data;
    }
};
