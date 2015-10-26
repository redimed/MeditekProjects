module.exports = function(objFind) {
    return FileUpload.findAll({
        attributes: ['ID'],
        where: {
            UID: {
                $in: objFind.data
            }
        },
        transaction: objFind.transaction
    });
};
