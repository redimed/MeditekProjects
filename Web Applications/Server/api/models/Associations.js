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
        TelehealthAppointment.hasOne(PreferedPlasticSurgeon, {
            foreignKey: 'TelehealthAppointmentID'
        });

        // TelehealthAppointment - ClinicalDetail
        TelehealthAppointment.hasOne(ClinicalDetail, {
            foreignKey: 'TelehealthAppointmentID'
        });
        // TelehealthAppointment - ClinicalDetail
        TelehealthAppointment.hasMany(GeneralPractitioner, {
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


        //GeneralPractitioner - Doctor
        GeneralPractitioner.belongsToMany(Doctor, {
            through: 'RefGeneralPractitionerDoctor',
            foreignKey: 'GeneralPractitionerID'
        });
        Doctor.belongsToMany(GeneralPractitioner, {
            through: 'RefGeneralPractitionerDoctor',
            foreignKey: 'DoctorID'
        });

        /* Doctor */
        Site.hasMany(Doctor, {
            foreignKey: 'SiteID'
        });
        UserAccount.hasOne(Doctor, {
            foreignKey: 'UserAccountID'
        });
        /* End Doctor */


        //UserAccount
        UserAccount.hasOne(Patient, {
            foreignKey: 'UserAccountID'
        });
        UserAccount.hasMany(UserActivation, {
            foreignKey: 'UserAccountID'
        });
        UserActivation.belongsTo(UserAccount, {
            foreignKey: 'UserAccountID'
        })

    }
};
