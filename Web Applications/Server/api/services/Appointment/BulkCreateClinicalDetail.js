module.exports = function(objectBulkCreated) {
    return ClinicalDetail.bulkCreate(objectBulkCreated.data, {
        transaction: objectBulkCreated.transaction
    });
};
