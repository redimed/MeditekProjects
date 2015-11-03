module.exports = function(objFind) {
    return Appointment.findOne({
        attributes: ['ID'],
        include: [{
            model: TelehealthAppointment,
            attributes: ['ID'],
            required: true
        }],
        where: {
            UID: objFind.where
        },
        transaction: objFind.transaction
    });
};
