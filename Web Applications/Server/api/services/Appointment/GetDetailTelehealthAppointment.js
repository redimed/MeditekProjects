module.exports = function(teleAppointmentUID) {
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
                required: true,
                include: [{
                    model: PatientAppointment,
                    attributes: ['UID', 'FirstName', 'MiddleName', 'LastName',
                        'DOB', 'Email', 'PhoneNumber', 'Address', 'Suburb', 'Postcode',
                        'Email', 'PhoneNumber', 'HomePhoneNumber'
                    ],
                    required: true,
                }, {
                    model: ExaminationRequired,
                    attributes: ['Private', 'Public', 'DVA', 'WorkersComp', 'MVIT'],
                    required: true
                }, {
                    model: PreferedPlasticSurgeon,
                    attributes: ['Name'],
                    required: true
                }, {
                    model: ClinicalDetail,
                    attributes: ['UID', 'Section', 'Category', 'Type', 'Name', 'Value', 'ClinicalNote', 'Description'],
                    required: true
                }, {
                    model: Doctor,
                    attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB', 'Type', 'Email', 'Phone'],
                    required: true
                }]
            }, {
                model: Doctor,
                attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB', 'Type', 'Email', 'Phone'],
                required: true,
                include: [{
                    model: Department,
                    attributes: ['UID', 'DepartmentCode', 'DepartmentName', 'Description'],
                    required: true
                }]
            }, {
                model: Patient,
                attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB',
                    'Gender', 'Address', 'Suburb', 'Postcode', 'Email', 'HomePhoneNumber'
                ],
                required: true,
                include: [{
                    model: UserAccount,
                    attributes: ['UserName', 'Email', 'PhoneNumber', 'Activated'],
                    required: true
                }]
            }],
            where: {
                UID: teleAppointmentUID
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
