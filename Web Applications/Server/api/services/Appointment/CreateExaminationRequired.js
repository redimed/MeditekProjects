module.exports = function(objCreated) {
    return objCreated.telehealthAppointmentObject.createExaminationRequired(objCreated.data, {
        transaction: objCreated.transaction
    });
};
