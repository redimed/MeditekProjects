module.exports = function(data, userInfo) {
    var pagination = Services.GetPaginationAppointment(data, userInfo, Admission);
    return Admission.findAndCountAll({
        attributes: Services.AttributesAdmission.Admission(),
        include: [{
            attributes: ['UID'],
            model: Appointment,
            required: (HelperService.CheckExistData(pagination.filterAppointment) && !_.isEmpty(pagination.filterAppointment)),
            where: pagination.filterAppointment,
            include: [{
                attributes: ['UID'],
                required: (HelperService.CheckExistData(pagination.filterDoctor) && !_.isEmpty(pagination.filterDoctor)),
                model: Doctor,
                where: pagination.filterDoctor
            }, {
                attributes: ['UID'],
                required: (HelperService.CheckExistData(pagination.filterPatient) && !_.isEmpty(pagination.filterPatient)),
                model: Patient,
                where: pagination.filterPatient
            }]
        },{
            attributes: Services.AttributesAdmission.AdmissionData(),
            required: true,
            model: AdmissionData,
            where: pagination.filterAdmission
        }],
        subQuery: false,
        order: pagination.order,
        limit: pagination.limit,
        offset: pagination.offset
    });
};
