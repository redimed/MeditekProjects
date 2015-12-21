module.exports = function(objFind) {
    return WAAppointment.findOne({
        attributes: ['ID'],
        where: {
            TelehealthAppointmentID: objFind.where
        },
        transaction: objFind.transaction
    });
};
