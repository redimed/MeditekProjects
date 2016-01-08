module.exports = function(data, userInfo) {
    var pagination = Services.GetPaginationAppointment(data, userInfo, Consultation);
    return Consultation.findAndCountAll({
        attributes: Services.AttributesConsult.Consultation(),
        include: [{
            attributes: ['UID'],
            model: Appointment,
            required: (HelperService.CheckExistData(pagination.filterAppointment) && !_.isEmpty(pagination.filterAppointment)),
            where: pagination.filterAppointment,
            include: [{
                attributes: Services.AttributesAppt.Doctor(),
                required: (HelperService.CheckExistData(pagination.filterDoctor) && !_.isEmpty(pagination.filterDoctor)),
                model: Doctor,
                where: pagination.filterDoctor
            }, {
                attributes: ['UID'],
                required: (HelperService.CheckExistData(pagination.filterPatient) && !_.isEmpty(pagination.filterPatient)),
                model: Patient,
                where: pagination.filterPatient
            }]
        }],
        subQuery: false,
        order: pagination.order,
        limit: pagination.limit,
        offset: pagination.offset
    });
};
