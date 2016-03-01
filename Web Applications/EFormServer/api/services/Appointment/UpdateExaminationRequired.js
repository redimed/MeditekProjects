module.exports = function(objUpdate) {
    return ExaminationRequired.update(objUpdate.data, {
        where: {
            TelehealthAppointmentID: objUpdate.where
        },
        transaction: objUpdate.transaction
    });
};
