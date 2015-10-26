module.exports = function(objAdded) {
    return objAdded.telehealthAppointmentCreated.addDoctor(
        objAdded.data, {
            transaction: objAdded.transaction
        });
};
