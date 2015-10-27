module.exports = function(objCreate) {
    return objCreate.appointmentCreated.createTelehealthAppointment(objCreate.data, {
        transaction: objCreate.transaction
    });
};
