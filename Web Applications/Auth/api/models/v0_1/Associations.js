module.exports = {
    associations: function() {
        //association Appointment - TelehealthAppointment
        Appointment.hasOne(TelehealthAppointment, {
            foreignKey: 'AppointmentID'
        });
        TelehealthAppointment.belongsTo(Appointment, {
            foreignKey: 'AppointmentID'
        });

        //association TelehealthAppointment - PatientAppointment
        TelehealthAppointment.hasOne(PatientAppointment, {
            foreignKey: 'TelehealthAppointmentID'
        });
        PatientAppointment.belongsTo(TelehealthAppointment, {
            foreignKey: 'TelehealthAppointmentID'
        });

        //association TelehealthAppointment - ExaminationRequired
        TelehealthAppointment.hasOne(ExaminationRequired, {
            foreignKey: 'TelehealthAppointmentID'
        });

        //association TelehealthAppointment - PreferredPractitioner
        TelehealthAppointment.hasMany(PreferredPractitioner, {
            foreignKey: 'TelehealthAppointmentID'
        });
        PreferredPractitioner.belongsTo(TelehealthAppointment, {
            foreignKey: 'TelehealthAppointmentID'
        });

        //association WAAppointment - PreferredPractitioner
        WAAppointment.hasMany(PreferredPractitioner, {
            foreignKey: 'WAAppointmentID'
        });
        PreferredPractitioner.belongsTo(WAAppointment, {
            foreignKey: 'WAAppointmentID'
        });

        //association TelehealthAppointment - Doctor
        TelehealthAppointment.belongsToMany(Doctor, {
            through: 'RelTelehealthAppointmentDoctor',
            foreignKey: 'TelehealthAppointmentID'
        });
        Doctor.belongsToMany(TelehealthAppointment, {
            through: 'RelTelehealthAppointmentDoctor',
            foreignKey: 'DoctorID'
        });
        //association TelehealthAppointment - ClinicalDetail
        TelehealthAppointment.hasMany(ClinicalDetail, {
            foreignKey: 'TelehealthAppointmentID'
        });
        ClinicalDetail.belongsTo(TelehealthAppointment, {
            foreignKey: 'TelehealthAppointmentID'
        });

        //association Appointment - Doctor
        Appointment.belongsToMany(Doctor, {
            through: 'RelDoctorAppointment',
            foreignKey: 'AppointmentID'
        });
        Doctor.belongsToMany(Appointment, {
            through: 'RelDoctorAppointment',
            foreignKey: 'DoctorID'
        });

        //association Appointment - Patient
        Appointment.belongsToMany(Patient, {
            through: 'RelPatientAppointment',
            foreignKey: 'AppointmentID'
        });
        Patient.belongsToMany(Appointment, {
            through: 'RelPatientAppointment',
            foreignKey: 'PatientID'
        });

        //association Appointment - FileUpload
        Appointment.belongsToMany(FileUpload, {
            through: 'RelAppointmentFileUpload',
            foreignKey: 'AppointmentID'
        });
        FileUpload.belongsToMany(Appointment, {
            through: 'RelAppointmentFileUpload',
            foreignKey: 'FileUploadID'
        });

        //association FileUpload - DocumentFile
        FileUpload.belongsTo(DocumentFile, {
            foreignKey: 'ID'
        });
        FileUpload.hasOne(DocumentFile, {
            foreignKey: 'FileUploadID'
        });

        //association FileUpload - MedicalImage
        FileUpload.belongsTo(MedicalImage, {
            foreignKey: 'ID'
        });
        FileUpload.hasOne(MedicalImage, {
            foreignKey: 'FileUploadID'
        });
        UserAccount.hasMany(FileUpload, {
            foreignKey: 'UserAccountID'
        });
        //association Patient - PatientKin
        Patient.hasOne(PatientKin, {
            foreignKey: 'PatientID'
        });
        PatientKin.belongsTo(Patient, {
            foreignKey: 'PatientID'
        });

        //association Patient - PatientMedicare
        Patient.hasOne(PatientMedicare, {
            foreignKey: 'PatientID'
        });
        PatientMedicare.belongsTo(Patient, {
            foreignKey: 'PatientID'
        });
        //association ClinicalDetail - FileUpload
        ClinicalDetail.belongsToMany(FileUpload, {
            through: 'RelClinicalDetailFileUpload',
            foreignKey: 'ClinicalDetailID'
        });
        FileUpload.belongsToMany(ClinicalDetail, {
            through: 'RelClinicalDetailFileUpload',
            foreignKey: 'FileUploadID'
        });
        //association TelehealthAppointment - WAAppointment
        TelehealthAppointment.hasOne(WAAppointment, {
            foreignKey: 'TelehealthAppointmentID'
        });
        WAAppointment.belongsTo(TelehealthAppointment, {
            foreignKey: 'TelehealthAppointmentID'
        });
        //association Patient - UserAccount
        Patient.belongsTo(UserAccount, {
            foreignKey: 'UserAccountID'
        });

        Doctor.belongsTo(Department, {
            foreignKey: 'DepartmentID'
        });
        Department.hasOne(Doctor, {
            foreignKey: 'DepartmentID'
        });

        //UserAccount
        UserAccount.hasOne(Patient, {
            foreignKey: 'UserAccountID'
        });
        UserAccount.hasMany(UserActivation, {
            foreignKey: 'UserAccountID'
        });

        //TelehealthUser
        UserAccount.hasOne(TelehealthUser, {
            foreignKey: 'UserAccountID'
        });
        TelehealthUser.belongsTo(UserAccount, {
            foreignKey: 'UserAccountID'
        });

        //Patient - UserAccount
        UserAccount.hasOne(Patient, {
            foreignKey: 'UserAccountID'
        });
        Patient.belongsTo(UserAccount, {
            foreignKey: 'UserAccountID'
        });
        //Patient - Country
        Country.hasOne(Patient, {
            foreignKey: 'CountryID1'
        });
        Patient.belongsTo(Country, {
            foreignKey: 'CountryID1'
        })

        /* Doctor */
        FileUpload.hasOne(Doctor, {
            foreignKey: 'Signature'
        });
        Doctor.belongsTo(FileUpload, {
            foreignKey: 'Signature'
        });
        Country.hasOne(Doctor, {
            foreignKey: 'CountryID'
        });
        Doctor.belongsTo(Country, {
            foreignKey: 'CountryID'
        });
        UserAccount.hasOne(Doctor, {
            foreignKey: 'UserAccountID'
        });
        Doctor.belongsTo(UserAccount, {
            foreignKey: 'UserAccountID'
        });
        /* End Doctor */

        //UserAccount
        UserAccount.hasMany(UserActivation, {
            foreignKey: 'UserAccountID'
        });
        UserActivation.belongsTo(UserAccount, {
            foreignKey: 'UserAccountID'
        })


        UserAccount.hasMany(RelUserRole, {
            foreignKey: 'UserAccountId'
        })
        RelUserRole.belongsTo(UserAccount, {
            foreignKey: 'UserAccountId'
        })
        Role.hasMany(RelUserRole, {
            foreignKey: 'RoleId'
        })
        RelUserRole.belongsTo(Role, {
            foreignKey: 'RoleId'
        })

        Role.belongsToMany(UserAccount, {
            through: 'RelUserRole',
            foreignKey: 'RoleId'
        });
        UserAccount.belongsToMany(Role, {
            through: 'RelUserRole',
            foreignKey: 'ID'
        });

    }
};
