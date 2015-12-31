module.exports = {
    ConsultationData: function(data, userID) {
        if (HelperService.CheckExistData(data) &&
            !_.isEmpty(data)) {
            _.forEach(data, function(valueConsultation, indexConsultData) {
                if (HelperService.CheckExistData(valueConsultation) &&
                    HelperService.CheckExistData(valueConsultation.ConsultationData) &&
                    HelperService.CheckExistData(valueConsultation.ConsultationData[0]) &&
                    HelperService.CheckExistData(valueConsultation.ConsultationData[0].UID)) {
                    data[indexConsultData].ConsultationData[0].CreatedBy = userID;
                } else if (HelperService.CheckExistData(valueConsultation) &&
                    HelperService.CheckExistData(valueConsultation.ConsultationData) &&
                    HelperService.CheckExistData(valueConsultation.ConsultationData[0]) &&
                    !HelperService.CheckExistData(valueConsultation.ConsultationData[0].UID)) {
                    data[indexConsultData].ConsultationData[0].UID = UUIDService.Create();
                    data[indexConsultData].ConsultationData[0].CreatedBy = userID;
                }
            });
        }
        return data;
    }
};
