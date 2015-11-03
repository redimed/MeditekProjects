module.exports = function(objCreated) {
    //create new Appointment
    return Appointment.create(objCreated.data, {
        transaction: objCreated.transaction
    });
};
