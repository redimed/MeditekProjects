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

        // TelehealthAppointment - TelehealthClinicalDetail
        TelehealthAppointment.hasOne(TelehealthClinicalDetail, {
            foreignKey: 'TelehealthAppointmentID'
        });
         // TelehealthAppointment - TelehealthClinicalDetail
        TelehealthAppointment.hasMany(GeneralPractitioner, {
            foreignKey: 'TelehealthAppointmentID'
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
	    UserAccount.hasOne(Patient,{foreignKey:'UserAccountID'});
        UserAccount.hasMany(UserActivation,{
            foreignKey:'UserAccountID'
        });
        UserActivation.belongsTo(UserAccount,{
            foreignKey:'UserAccountID'
        })

    }
};
