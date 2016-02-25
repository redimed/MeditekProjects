module.exports = function(objUpdate) {
    return TelehealthAppointment.update(objUpdate.data, {
        where: {
            UID: objUpdate.where
        },
        transaction: objUpdate.transaction
    });
};
