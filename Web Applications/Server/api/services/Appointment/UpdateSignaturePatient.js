module.exports = function(objUpdate) {
    var $q = require('q');
    var defer = $q.defer();
    var userAccountID = null;
    var fileUploadID = null;
    if (!_.isEmpty(objUpdate) &&
        !_.isEmpty(objUpdate.where) &&
        !_.isEmpty(objUpdate.data)) {
        FileUpload.findOne({
                attributes: ['ID'],
                where: objUpdate.data,
                transaction: objUpdate.transaction,
                raw: true
            })
            .then(function(fileUpload) {
                if (!_.isEmpty(fileUpload)) {
                    fileUploadID = fileUpload.ID;
                    return Patient.update({
                        Signature: fileUpload.ID
                    }, {
                        where: {
                            $or: objUpdate.where
                        },
                        transaction: objUpdate.transaction,
                        individualHooks: true
                    });
                }
            }, function(err) {
                defer.reject(err);
            })
            .then(function(patientUpdated) {
                if (!_.isEmpty(patientUpdated) &&
                    !_.isEmpty(patientUpdated[1]) &&
                    !_.isEmpty(patientUpdated[1][0]) &&
                    !_.isEmpty(patientUpdated[1][0].dataValues)) {
                    userAccountID = patientUpdated[1][0].dataValues.UserAccountID;
                    return FileUpload.update({
                        Enable: 'N'
                    }, {
                        where: {
                            FileType: 'Signature',
                            UserAccountID: userAccountID
                        },
                        transaction: objUpdate.transaction
                    });
                }
            }, function(err) {
                defer.reject(err);
            })
            .then(function(signatureDisabled) {
                return FileUpload.update({
                    UserAccountID: userAccountID
                }, {
                    where: {
                        ID: fileUploadID
                    },
                    transaction: objUpdate.transaction
                });
            }, function(err) {
                defer.reject(err);
            })
            .then(function(signatureUpdated) {
                defer.resolve(signatureUpdated);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        defer.reject('UpdateSignaturePatient.data.isEmpty');
    }
    return defer.promise;
};
