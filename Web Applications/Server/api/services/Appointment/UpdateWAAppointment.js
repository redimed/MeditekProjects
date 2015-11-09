module.exports = function(objUpdate) {
    return WAAppointment.upsert(objUpdate.data, {
        where: {
            TelehealthAppointmentID: objUpdate.where
        },
        transaction: objUpdate.transaction
    });
};
