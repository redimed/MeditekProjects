module.exports = function(objCreate) {
    return objCreate.telehealthAppointmentObject.createWAAppointment(objCreate.data, {
        transaction: objCreate.transaction
    });
};
