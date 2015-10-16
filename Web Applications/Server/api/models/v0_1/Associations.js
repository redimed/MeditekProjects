module.exports = {
    associations: function() {
        //Appointment - TelehealthAppointment
        Appointment.hasOne(TelehealthAppointment, {
            foreignKey: 'AppointmentID'
        });
        TelehealthAppointment.belongsTo(Appointment, {
            foreignKey: 'AppointmentID'
        });

        // TelehealthAppointment - PatientAppointment
        TelehealthAppointment.hasOne(PatientAppointment, {
            foreignKey: 'TelehealthAppointmentID'
        });

        // TelehealthAppointment - ExaminationRequired
        TelehealthAppointment.hasOne(ExaminationRequired, {
            foreignKey: 'TelehealthAppointmentID'
        });

        // TelehealthAppointment - PreferedPlasticSurgeon
        TelehealthAppointment.hasMany(PreferedPlasticSurgeon, {
            foreignKey: 'TelehealthAppointmentID'
        });
        // TelehealthAppointment - Doctor
        TelehealthAppointment.belongsToMany(Doctor, {
            through: 'RelTelehealthAppointmentDoctor',
            foreignKey: 'TelehealthAppointmentID'
        });
        Doctor.belongsToMany(TelehealthAppointment, {
            through: 'RelTelehealthAppointmentDoctor',
            foreignKey: 'DoctorID'
        });
        // TelehealthAppointment - ClinicalDetail
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
        })

        //Patient - UserAccount
        UserAccount.hasOne(Patient, {
            foreignKey: 'UserAccountID'
        });
        Patient.belongsTo(UserAccount, {
            foreignKey: 'UserAccountID'
        });
        //Patient - Country
        Country.hasOne(Patient, {
            foreignKey: 'CountryID'
        });
        Patient.belongsTo(Country, {
            foreignKey: 'CountryID'
        })

        /* Doctor */
        FileUpload.hasOne(Doctor, {
            foreignKey: 'Signature'
        });
        Country.hasOne(Doctor, {
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

    }
};
