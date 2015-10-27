module.exports = function(objAdded) {
    return objAdded.telehealthApointmentCreated.addDoctor(objAdded.data, {
        transaction: objAdded.transaction
    });
};
