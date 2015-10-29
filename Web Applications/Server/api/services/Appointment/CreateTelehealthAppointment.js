module.exports = function(objCreate) {
    return objCreate.appointmentObject.createTelehealthAppointment(objCreate.data, {
        transaction: objCreate.transaction
    });
};
