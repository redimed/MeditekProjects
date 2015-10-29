module.exports = function(objCreate) {
    return objCreate.telehealthAppointmentObject.createPatientAppointment(
        objCreate.data, {
            transaction: objCreate.transaction
        });
};
