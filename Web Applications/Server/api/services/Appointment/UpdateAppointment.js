module.exports = function(objUpdate) {
    return Appointment.update(objUpdate.data, {
        where: {
            UID: objUpdate.where
        },
        transaction: objUpdate.transaction,
        individualHooks: true
    });
};
