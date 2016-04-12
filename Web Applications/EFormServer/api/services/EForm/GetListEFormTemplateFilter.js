module.exports = function(data, userInfo) {
    var $q = require('q')
    var defer = $q.defer()
    var pagination = PaginationService(data, EFormTemplate)
    EFormTemplate.findAndCountAll({
            include: [{
                attributes: ['ID'],
                model: EForm,
                include: [{
                    attributes: ['ID', 'UID'],
                    model: Appointment,
                    where: pagination.Appointment,
                    required: false
                }],
                required: false
            }, {
                attributes: ['UID'],
                model: Role,
                required: false
            },{
                model: EFormGroup,
                required: true,
                where: pagination.EFormGroup
            }],
            where: pagination.EFormTemplate,
            order: pagination.order,
            limit: pagination.limit,
            offset: pagination.offset
        })
        .then(function(eformTemplateList) {
            defer.resolve({ data: eformTemplateList })
        }, function(err) {
            defer.reject({
                error: err
            })
        })
    return defer.promise
}
