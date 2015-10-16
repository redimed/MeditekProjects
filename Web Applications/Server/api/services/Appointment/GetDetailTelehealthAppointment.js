module.exports = function(appointmentUID) {
    var $q = require('q');
    var defer = $q.defer();
    Appointment.findOne({
            attributes: ['UID', 'FromTime', 'ToTime', 'RequestDate', 'ApprovalDate', 'Status'],
            include: [{
                model: TelehealthAppointment,
                attributes: ['UID', 'Fund', 'Correspondence', 'RefName',
                    'RefHealthLink', 'RefAddress', 'RefTelePhone',
                    'RefPostCode', 'RefSignature', 'RefDate', 'RefProviderNumber',
                    'RefDurationOfReferal', 'PresentComplain', 'Allergy'
                ],
                required: false,
                include: [{
                    model: PatientAppointment,
                    attributes: ['UID', 'FirstName', 'MiddleName', 'LastName',
                        'DOB', 'Email', 'PhoneNumber', 'Address', 'Suburb', 'Postcode',
                        'Email', 'PhoneNumber', 'HomePhoneNumber'
                    ],
                    required: false,
                }, {
                    model: ExaminationRequired,
                    attributes: ['Private', 'Public', 'DVA', 'WorkersComp', 'MVIT'],
                    required: false
                }, {
                    model: PreferedPlasticSurgeon,
                    attributes: ['Name'],
                    required: false
                }, {
                    model: ClinicalDetail,
                    attributes: ['UID', 'Section', 'Category', 'Type', 'Name', 'Value', 'ClinicalNote', 'Description'],
                    required: false
                }]
            }, {
                model: Doctor,
                attributes: ['ID', 'UID', 'FirstName', 'MiddleName', 'LastName', 'DOB', 'Type', 'Email', 'HomePhoneNumber'],
                required: false,
                include: [{
                    model: Department,
                    attributes: ['ID', 'UID', 'DepartmentCode', 'DepartmentName', 'Description'],
                    required: false
                }]
            }, {
                model: Patient,
                attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB',
                    'Gender', 'Address1', 'Address2', 'Suburb', 'Postcode', 'Email', 'HomePhoneNumber'
                ],
                required: false,
                include: [{
                    model: UserAccount,
                    attributes: ['UserName', 'Email', 'PhoneNumber', 'Activated'],
                    required: false
                }]
            }, {
                model: FileUpload,
                required: false
            }],
            where: {
                UID: appointmentUID
            }
        })
        .then(function(detailApptTelehealth) {
            defer.resolve({
                data: detailApptTelehealth
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
