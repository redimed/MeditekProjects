module.exports = function(objUpdate) {
    return WAAppointment.update(objUpdate.data, {
        where: objUpdate.where,
        transaction: objUpdate.transaction
    });
};
