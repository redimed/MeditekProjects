module.exports = function(objCreated) {
    return objCreated.telehealthApointmentCreated.createExaminationRequired(
        objCreated.data, {
            transaction: objCreated.transaction
        });
};
