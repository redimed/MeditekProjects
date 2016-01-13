module.exports = {
    Consultation: function(data, userID) {
        if (HelperService.CheckExistData(data) &&
            !_.isEmpty(data)) {
            _.forEach(data, function(valueConsultation, indexConsultation) {
                if (HelperService.CheckExistData(valueConsultation) &&
                    HelperService.CheckExistData(valueConsultation.UID)) {
                    data[indexConsultation].CreatedBy = userID;
                } else if (HelperService.CheckExistData(valueConsultation) &&
                    !HelperService.CheckExistData(valueConsultation.UID)) {
                    data[indexConsultation].CreatedBy = userID;
                    data[indexConsultation].UID = UUIDService.Create();
                }
            });
        }
        return data;
    },
    ConsultationData: function(data, userID) {
        if (HelperService.CheckExistData(data) &&
            !_.isEmpty(data)) {
            _.forEach(data, function(valueConsultData, indexConsultData) {
                if (HelperService.CheckExistData(valueConsultData) &&
                    HelperService.CheckExistData(valueConsultData.UID)) {
                    data[indexConsultData].CreatedBy = userID;
                } else if (HelperService.CheckExistData(valueConsultData) &&
                    !HelperService.CheckExistData(valueConsultData.UID)) {
                    data[indexConsultData].CreatedBy = userID;
                    data[indexConsultData].UID = UUIDService.Create();
                }
            });
        }
        return data;
    }
};
