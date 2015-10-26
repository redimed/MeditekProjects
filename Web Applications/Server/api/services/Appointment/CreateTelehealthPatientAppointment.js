module.exports = function(objCreate) {
    return objCreate.telehealthAppointmentCreated.createPatientAppointment(
        objCreate.dataTelehealthPatientAppointment, {
            transaction: objCreate.transaction
        });
};
