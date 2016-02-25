module.exports = function(objCreated) {
    return Company.create(objCreated, {
        transaction: objCreated.transaction
    });
};
