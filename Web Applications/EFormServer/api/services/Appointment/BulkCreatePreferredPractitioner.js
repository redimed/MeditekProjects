module.exports = function(objCreated) {
    return PreferredPractitioner.bulkCreate(objCreated.data, {
        transaction: objCreated.transaction
    });
};
