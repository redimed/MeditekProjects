module.exports = function(objUpdate) {
    return PatientAppointment.update(objUpdate.data, {
        where: {
            UID: objUpdate.where
        },
        transaction: objUpdate.transaction
    });
};
