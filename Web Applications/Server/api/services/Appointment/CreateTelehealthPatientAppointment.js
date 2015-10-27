module.exports = function(objCreate) {
    return objCreate.telehealthApointmentCreated.createPatientAppointment(
        objCreate.data, {
            transaction: objCreate.transaction
        });
};
