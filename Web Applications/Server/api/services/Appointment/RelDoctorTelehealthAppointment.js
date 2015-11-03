module.exports = function(objCreate) {
    return objCreate.telehealthAppointmentObject.addDoctor(objCreate.data, {
        transaction: objCreate.transaction
    });
};
