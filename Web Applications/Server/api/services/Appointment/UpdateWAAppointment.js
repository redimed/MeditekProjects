module.exports = function(objUpdate) {
    return WAAppointment.update(objUpdate.data, {
        where: {
            TelehealthAppointmentID: objUpdate.where
        },
        transaction: objUpdate.transaction
    });
};
