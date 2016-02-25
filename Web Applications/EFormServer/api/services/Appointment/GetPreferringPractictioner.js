module.exports = function(objectFind) {
    //find information PreferringPractitioner
    return UserAccount.findOne({
        attributes: ['ID'],
        include: [{
            attributes: ['ID', 'FirstName', 'MiddleName', 'LastName',
                'HealthLink', 'Address1', 'Address2', 'HomePhoneNumber', 'PostCode',
                'ProviderNumber', 'Signature', 'WorkPhoneNumber'
            ],
            model: Doctor,
            required: false
        }],
        where: {
            UID: objectFind.data
        },
        transaction: objectFind.transaction
    });
};
