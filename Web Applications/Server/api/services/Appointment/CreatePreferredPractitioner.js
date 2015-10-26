module.exports = function(objCreated) {
    return objCreated.telehealthAppointmentCreated.bulkCreate(objCreated.data, {
        transaction: objCreated.transaction
    });
};
